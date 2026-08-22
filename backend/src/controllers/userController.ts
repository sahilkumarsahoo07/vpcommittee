import { Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, UserRole } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/auditLog';

// In-Memory Mock Store for Users (Fallback if DB is unavailable)
export let mockUsers = [
  {
    _id: 'usr_superadmin_01',
    id: 'usr_superadmin_01',
    name: 'Sahil Kumar Sahoo',
    email: 'sksahoo.dev@gmail.com',
    password: '', // hashed
    plainPassword: '123456',
    role: 'SUPERADMIN' as UserRole,
    phone: '+91 98765 43210',
    address: 'Kamakhyanagar, Dhenkanal, Odisha',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    permissions: ['ALL'],
    isActive: true,
    mustChangePassword: false,
    createdAt: new Date('2026-08-01'),
  },
  {
    _id: 'usr_admin_02',
    id: 'usr_admin_02',
    name: 'Treasurer Admin',
    email: 'admin@vighnaharta.org',
    password: '',
    plainPassword: 'Admin@2026',
    role: 'ADMIN' as UserRole,
    phone: '+91 99381 44556',
    address: 'Main Town, Dhenkanal, Odisha',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    permissions: ['FINANCE', 'CMS', 'REPORTS'],
    isActive: true,
    mustChangePassword: true,
    createdAt: new Date('2026-08-05'),
  },
  {
    _id: 'usr_member_03',
    id: 'usr_member_03',
    name: 'Committee Member',
    email: 'member@vighnaharta.org',
    password: '',
    plainPassword: 'Member@2026',
    role: 'COMMITTEE_MEMBER' as UserRole,
    phone: '+91 91234 88990',
    address: 'Sector 4, Bhubaneswar, Odisha',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    permissions: ['CMS'],
    isActive: true,
    mustChangePassword: true,
    createdAt: new Date('2026-08-10'),
  },
  {
    _id: 'usr_member_04',
    id: 'usr_member_04',
    name: 'Standard Member',
    email: 'newmember@vighnaharta.org',
    password: '',
    plainPassword: 'Member@2026',
    role: 'MEMBER' as UserRole,
    phone: '+91 98765 00000',
    address: 'Kamakhyanagar, Dhenkanal, Odisha',
    profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    permissions: [] as string[],
    isActive: true,
    mustChangePassword: true,
    createdAt: new Date('2026-08-15'),
  },
];

// Initialize hashed mock passwords synchronously/asynchronously
(async () => {
  mockUsers[0].password = await bcrypt.hash('123456', 10);
  mockUsers[1].password = await bcrypt.hash('Admin@2026', 10);
  mockUsers[2].password = await bcrypt.hash('Member@2026', 10);
  mockUsers[3].password = await bcrypt.hash('Member@2026', 10);
})();

// Active Reset Tokens Store (in-memory for demo / fallback)
const activeResetTokens = new Map<string, { code: string; expires: number }>();

/**
 * GET /api/users
 * Returns list of user accounts.
 * SuperAdmin sees plain text passwords; Admin sees users without plain text passwords.
 */
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const requesterRole = req.user?.role;
    const isSuperAdmin = requesterRole === 'SUPERADMIN';

    let dbUsers: any[] = [];
    try {
      const query = User.find();
      if (isSuperAdmin) {
        query.select('+plainPassword');
      }
      dbUsers = await query.lean();
    } catch {
      // Database query failed
    }

    // Merge DB users and mock users so that all accounts are always visible
    const allUsersMap = new Map<string, any>();

    // 1. Insert mock store accounts
    mockUsers.forEach((u) => {
      if (u && u.email) {
        allUsersMap.set(u.email.toLowerCase(), u);
      }
    });

    // 2. Insert or override with live DB records
    dbUsers.forEach((u) => {
      if (u && u.email) {
        allUsersMap.set(u.email.toLowerCase(), u);
      }
    });

    const combinedUsers = Array.from(allUsersMap.values());

    // Format output based on requester role
    const sanitizedUsers = combinedUsers.map((u) => {
      const formatted: any = {
        id: u._id?.toString() || u.id,
        _id: u._id?.toString() || u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone || '',
        address: u.address || '',
        profilePhoto: u.profilePhoto || '',
        permissions: u.permissions || [],
        isActive: u.isActive ?? true,
        mustChangePassword: u.mustChangePassword ?? false,
        createdAt: u.createdAt,
      };

      if (isSuperAdmin) {
        formatted.plainPassword = u.plainPassword || '••••••••';
      }

      return formatted;
    });

    res.json({
      success: true,
      data: sanitizedUsers,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/users
 * Create Account Controller enforcing Role Hierarchy:
 * - SUPERADMIN can create SUPERADMIN, ADMIN, COMMITTEE_MEMBER, MEMBER
 * - ADMIN can create COMMITTEE_MEMBER, MEMBER
 */
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const requesterRole = req.user?.role;
    const { name, email, password, role, phone, address, profilePhoto } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and role are required',
      });
    }

    // Enforce Hierarchy Rules:
    if (requesterRole === 'ADMIN' && role !== 'COMMITTEE_MEMBER' && role !== 'MEMBER') {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: Admins can only create Committee Member and Member accounts.',
      });
    }

    if (requesterRole !== 'SUPERADMIN' && requesterRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: Only SuperAdmin and Admin can create user accounts.',
      });
    }

    // Validate Required Fields for MEMBER role:
    if (role === 'MEMBER') {
      const trimmedName = (name || '').trim();
      const trimmedEmail = (email || '').trim();
      const trimmedPhone = (phone || '').trim();
      const trimmedAddress = (address || '').trim();
      const trimmedPhoto = (profilePhoto || '').trim();

      if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedAddress || !trimmedPhoto) {
        return res.status(400).json({
          success: false,
          message: 'All fields (Full Name, Email, Phone Number, Address, and Profile Photo) are strictly required to create a Member account.',
        });
      }
    } else {
      // Non-member roles require password
      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Initial password of at least 6 characters is required for this role.',
        });
      }
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    let existingUser = null;
    try {
      existingUser = await User.findOne({ email: cleanEmail });
    } catch {}

    if (!existingUser) {
      existingUser = mockUsers.find((m) => m.email.toLowerCase() === cleanEmail);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // For Member without password, set empty placeholder
    let hashedPassword = '';
    const initialPassword = password || '';
    if (initialPassword) {
      hashedPassword = await bcrypt.hash(initialPassword, 10);
    } else {
      hashedPassword = await bcrypt.hash(`MEMBER_NO_LOGIN_${Date.now()}`, 10);
    }

    let createdId = `usr_${Date.now()}`;

    // New Members receive ZERO permissions by default. Other roles receive appropriate defaults.
    const initialPermissions: string[] =
      role === 'MEMBER'
        ? []
        : role === 'ADMIN'
        ? ['FINANCE', 'CMS', 'REPORTS']
        : role === 'COMMITTEE_MEMBER'
        ? ['CMS']
        : ['ALL'];

    try {
      const dbUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        plainPassword: initialPassword || undefined,
        role,
        phone: (phone || '').trim(),
        address: (address || '').trim(),
        profilePhoto: (profilePhoto || '').trim(),
        permissions: initialPermissions,
        isActive: true,
        mustChangePassword: role !== 'MEMBER',
      });
      if (dbUser && dbUser._id) {
        createdId = dbUser._id.toString();
      }
    } catch {}

    const newUserObj = {
      _id: createdId,
      id: createdId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      plainPassword: initialPassword || '',
      role: role as UserRole,
      phone: (phone || '').trim(),
      address: (address || '').trim(),
      profilePhoto: (profilePhoto || '').trim(),
      permissions: initialPermissions,
      isActive: true,
      mustChangePassword: role !== 'MEMBER',
      createdAt: new Date(),
    };

    mockUsers.unshift(newUserObj);

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'ACCOUNT_CREATED',
        'User',
        createdId,
        `Created ${role} account for ${cleanEmail}`
      );
    }

    res.status(201).json({
      success: true,
      message: `Account created successfully for ${name} (${role}). ${
        role === 'MEMBER' ? 'Zero permissions assigned by default (No password required).' : 'Initial login password set.'
      }`,
      data: {
        id: createdId,
        _id: createdId,
        name: name.trim(),
        email: cleanEmail,
        role,
        phone: (phone || '').trim(),
        address: (address || '').trim(),
        profilePhoto: (profilePhoto || '').trim(),
        permissions: initialPermissions,
        isActive: true,
        mustChangePassword: role !== 'MEMBER',
        plainPassword: requesterRole === 'SUPERADMIN' && initialPassword ? initialPassword : undefined,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/users/:id
 * Update user status, role, details, password, or permissions
 */
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const requesterId = req.user?.id;
    const requesterEmail = req.user?.email?.toLowerCase();
    const requesterRole = req.user?.role;
    const isSuperAdmin = requesterRole === 'SUPERADMIN';
    const { name, email, phone, address, profilePhoto, role, permissions, password, isActive } = req.body;

    // Fetch target user to check permissions
    let targetUser: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        targetUser = await User.findById(id);
      } catch {}
    }
    if (!targetUser) {
      targetUser = mockUsers.find((u) => u.id === id || u._id === id);
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const targetUserId = targetUser._id?.toString() || targetUser.id;
    const isSelf = requesterId === targetUserId || requesterEmail === targetUser.email?.toLowerCase();

    // Self-Protection Rule 1: No account can change their own role
    if (isSelf && role !== undefined && role !== targetUser.role) {
      return res.status(403).json({
        success: false,
        message: 'Security violation: You cannot change or modify your own account role.',
      });
    }

    // Self-Protection Rule 2: No account can suspend their own active account
    if (isSelf && isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Security violation: You cannot suspend or deactivate your own logged-in account.',
      });
    }

    // Admin Hierarchy Restrictions:
    if (requesterRole === 'ADMIN') {
      if (!isSelf) {
        // Admin managing other accounts
        if (targetUser.role !== 'COMMITTEE_MEMBER' && targetUser.role !== 'MEMBER') {
          return res.status(403).json({
            success: false,
            message: 'Permission denied: Admins can only manage Committee Member and Member accounts.',
          });
        }
        if (role && role !== 'COMMITTEE_MEMBER' && role !== 'MEMBER') {
          return res.status(403).json({
            success: false,
            message: 'Permission denied: Admins cannot promote users to Admin or SuperAdmin.',
          });
        }
      } else {
        // Admin updating their own profile: role and permissions cannot be touched
        if (role !== undefined && role !== targetUser.role) {
          return res.status(403).json({
            success: false,
            message: 'Permission denied: Admins cannot change their own role.',
          });
        }
      }

      if (permissions !== undefined) {
        return res.status(403).json({
          success: false,
          message: 'Permission denied: Only SuperAdmin can modify user permissions.',
        });
      }
    }

    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (email !== undefined) updateFields.email = email.trim().toLowerCase();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (address !== undefined) updateFields.address = address.trim();
    if (profilePhoto !== undefined) updateFields.profilePhoto = profilePhoto.trim();
    if (role !== undefined && !isSelf) updateFields.role = role;
    if (isActive !== undefined && !isSelf) updateFields.isActive = isActive;

    // If a new password is provided
    if (password && password.length >= 6) {
      // Admin cannot change other Admin/SuperAdmin passwords
      if (requesterRole === 'ADMIN' && !isSelf && targetUser.role !== 'COMMITTEE_MEMBER' && targetUser.role !== 'MEMBER') {
        return res.status(403).json({
          success: false,
          message: 'Permission denied: Admins cannot modify passwords for Admin or SuperAdmin accounts.',
        });
      }
      const hashed = await bcrypt.hash(password, 10);
      updateFields.password = hashed;
      updateFields.plainPassword = password;
      updateFields.mustChangePassword = !isSelf;
    }

    // SuperAdmin can manage granular permissions array for other accounts
    if (isSuperAdmin && permissions !== undefined && Array.isArray(permissions)) {
      updateFields.permissions = permissions;
    }

    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        await User.findByIdAndUpdate(id, updateFields, { new: true });
      } catch {}
    }

    const index = mockUsers.findIndex((u) => u.id === id || u._id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...updateFields };
    }

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'ACCOUNT_UPDATED',
        'User',
        id,
        `Updated account settings for user ${id}`
      );
    }

    res.json({
      success: true,
      message: 'User account updated successfully',
      data: updateFields,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/users/:id
 * Delete User Account
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const requesterId = req.user?.id;
    const requesterEmail = req.user?.email?.toLowerCase();
    const requesterRole = req.user?.role;

    let targetUser: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        targetUser = await User.findById(id);
      } catch {}
    }
    if (!targetUser) {
      targetUser = mockUsers.find((u) => u.id === id || u._id === id);
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const targetUserId = targetUser._id?.toString() || targetUser.id;
    const isSelf = requesterId === targetUserId || requesterEmail === targetUser.email?.toLowerCase();

    // Self-Protection Rule: Current account CANNOT delete their own account
    if (isSelf) {
      return res.status(400).json({
        success: false,
        message: 'Security violation: You cannot delete your own logged-in account.',
      });
    }

    // Admin Hierarchy Restrictions:
    if (requesterRole === 'ADMIN') {
      if (targetUser.role !== 'COMMITTEE_MEMBER' && targetUser.role !== 'MEMBER') {
        return res.status(403).json({
          success: false,
          message: 'Permission denied: Admins can only delete Committee Member and Member accounts.',
        });
      }
    }

    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        await User.findByIdAndDelete(id);
      } catch {}
    }

    mockUsers = mockUsers.filter((u) => u.id !== id && u._id !== id);

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'ACCOUNT_DELETED',
        'User',
        id,
        `Deleted user account ${id}`
      );
    }

    res.json({ success: true, message: 'User account deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/auth/change-password
 * Mandatory or manual password change controller
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    let user: any = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        user = await User.findById(userId).select('+password');
      } catch {}
    }
    if (!user && req.user?.email) {
      try {
        user = await User.findOne({ email: req.user.email }).select('+password');
      } catch {}
    }

    if (!user) {
      user = mockUsers.find((u) => u.id === userId || u._id === userId || u.email === req.user?.email);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    // Verify current password if provided and user is not in forced first login mode
    if (currentPassword && user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch && currentPassword !== user.plainPassword) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect.',
        });
      }
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    try {
      if (user.save) {
        user.password = hashedNewPassword;
        user.plainPassword = newPassword;
        user.mustChangePassword = false;
        await user.save();
      } else {
        await User.findByIdAndUpdate(user._id || user.id, {
          password: hashedNewPassword,
          plainPassword: newPassword,
          mustChangePassword: false,
        });
      }
    } catch {}

    // Update in mock store
    const mockIndex = mockUsers.findIndex((u) => u.email === user.email || u.id === userId);
    if (mockIndex !== -1) {
      mockUsers[mockIndex].password = hashedNewPassword;
      mockUsers[mockIndex].plainPassword = newPassword;
      mockUsers[mockIndex].mustChangePassword = false;
    }

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'PASSWORD_CHANGED',
        'User',
        String(req.user.id),
        `Password changed successfully for ${user.email}`
      );
    }

    res.json({
      success: true,
      message: 'Password updated successfully!',
      data: {
        mustChangePassword: false,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/auth/forgot-password
 * Generate reset OTP token for password recovery
 */
export const forgotPassword = async (req: any, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user: any = null;

    try {
      user = await User.findOne({ email: cleanEmail });
    } catch {}

    if (!user) {
      user = mockUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    // Generate 6-digit Security Reset Code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry

    try {
      await User.findOneAndUpdate(
        { email: cleanEmail },
        { resetPasswordToken: resetCode, resetPasswordExpires: new Date(expiresAt) }
      );
    } catch {}

    activeResetTokens.set(cleanEmail, { code: resetCode, expires: expiresAt });

    res.json({
      success: true,
      message: `Password reset code generated successfully. Use Security Code: ${resetCode} to reset your password.`,
      resetCode: resetCode, // Returned for instant testing & seamless user experience
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/auth/reset-password
 * Complete password reset using OTP code
 */
export const resetPassword = async (req: any, res: Response) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, reset security code, and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cachedToken = activeResetTokens.get(cleanEmail);

    let user: any = null;
    try {
      user = await User.findOne({ email: cleanEmail });
    } catch {}

    if (!user) {
      user = mockUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    // Validate Reset Code
    let isValidCode = false;
    if (user.resetPasswordToken === resetCode && user.resetPasswordExpires && new Date(user.resetPasswordExpires) > new Date()) {
      isValidCode = true;
    } else if (cachedToken && cachedToken.code === resetCode && cachedToken.expires > Date.now()) {
      isValidCode = true;
    }

    if (!isValidCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset security code.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      await User.findOneAndUpdate(
        { email: cleanEmail },
        {
          password: hashedPassword,
          plainPassword: newPassword,
          mustChangePassword: false,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        }
      );
    } catch {}

    const mockIndex = mockUsers.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    if (mockIndex !== -1) {
      mockUsers[mockIndex].password = hashedPassword;
      mockUsers[mockIndex].plainPassword = newPassword;
      mockUsers[mockIndex].mustChangePassword = false;
    }

    activeResetTokens.delete(cleanEmail);

    res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
