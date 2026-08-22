import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { logAudit } from '../middleware/auditLog';
import { mockUsers } from './userController';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    let user: any = null;
    try {
      user = await User.findOne({ email: cleanEmail }).select('+password +plainPassword');
    } catch {
      console.warn('[Auth Warning] Database query unavailable. Using fallback authentication check.');
    }

    // Check mock store fallback if not found in database
    if (!user) {
      user = mockUsers.find((m) => m.email.toLowerCase() === cleanEmail);
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or inactive user account',
      });
    }

    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }
    // Direct check plain password fallback if needed
    if (!isMatch && user.plainPassword && password === user.plainPassword) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    try {
      user.lastLogin = new Date();
      if (user.save) await user.save();
    } catch {}

    const token = jwt.sign(
      {
        id: user._id || user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        profilePhoto: user.profilePhoto || '',
        permissions: user.permissions || [],
        mustChangePassword: user.mustChangePassword ?? false,
      },
      process.env.JWT_SECRET || 'vighnaharta_puja_committee_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    await logAudit(
      String(user._id || user.id),
      user.name,
      user.role,
      'USER_LOGIN',
      'User',
      String(user._id || user.id),
      `User ${user.email} logged in successfully`,
      req.ip
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || '',
          address: user.address || '',
          profilePhoto: user.profilePhoto || '',
          permissions: user.permissions || [],
          mustChangePassword: user.mustChangePassword ?? false,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: { code: 'AUTH_FAILED', details: error.message },
    });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    let freshUser: any = null;
    if (userId) {
      try {
        freshUser = await User.findById(userId);
      } catch {}
    }
    if (!freshUser && userEmail) {
      freshUser = mockUsers.find((u) => u.email.toLowerCase() === userEmail.toLowerCase() || u.id === userId);
    }

    const userData = freshUser
      ? {
          id: freshUser._id || freshUser.id,
          name: freshUser.name,
          email: freshUser.email,
          role: freshUser.role,
          phone: freshUser.phone || '',
          address: freshUser.address || '',
          profilePhoto: freshUser.profilePhoto || '',
          permissions: freshUser.permissions || [],
          mustChangePassword: freshUser.mustChangePassword ?? false,
        }
      : req.user;

    res.json({
      success: true,
      data: { user: userData },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
