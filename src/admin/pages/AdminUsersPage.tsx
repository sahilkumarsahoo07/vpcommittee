import React, { useState, useEffect } from 'react';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { userAPI, adminAPI, publicAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { ProfilePhotoUploader } from '../components/ProfilePhotoUploader';
import { WhatsAppProfileDrawer } from '../components/WhatsAppProfileDrawer';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Lock,
  Search,
  Sparkles,
  RefreshCw,
  X,
  Phone,
  Mail,
  User as UserIcon,
  MapPin,
  Shield,
  CheckSquare,
  Square,
  Info,
} from 'lucide-react';

interface UserAccount {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  permissions?: string[];
  isActive: boolean;
  mustChangePassword?: boolean;
  plainPassword?: string;
  createdAt?: string;
}

const ALL_SYSTEM_MODULES = [
  { key: 'DASHBOARD', name: 'Overview Dashboard', desc: 'Main statistics, summaries & quick charts' },
  { key: 'FINANCE', name: 'Finance & Accounting', desc: 'Donations, Expenses & Budget tracking' },
  { key: 'REPORTS', name: 'Financial Reports & Exports', desc: 'PDF statement and Excel generation' },
  { key: 'CMS_MEMBERS', name: 'Executive Leadership CMS', desc: 'Committee members public directory' },
  { key: 'CMS_EVENTS', name: 'Festival Schedule CMS', desc: 'Daily rituals, dates and timelines' },
  { key: 'CMS_GALLERY', name: 'Media Gallery CMS', desc: 'Photo uploads and image gallery' },
  { key: 'CMS_ANNOUNCEMENTS', name: 'Announcements CMS', desc: 'Public updates and flash alerts' },
  { key: 'CMS_VOLUNTEERS', name: 'Volunteer Roster CMS', desc: 'Volunteer applications and rosters' },
  { key: 'CMS_SUBSCRIBERS', name: 'Newsletter Subscribers CMS', desc: 'Subscribed devotee mailing list' },
  { key: 'USERS', name: 'User & Account Management', desc: 'Create and manage system user accounts' },
  { key: 'SETTINGS', name: 'Website Global Settings CMS', desc: 'Site banner, contact and festival info' },
  { key: 'AUDIT_LOGS', name: 'Audit Security Logs', desc: 'Immutable audit logs and security trails' },
];

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser, updateUser: updateAuthUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'SUPERADMIN';
  const isAdmin = currentUser?.role === 'ADMIN';

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Role Permissions Matrix State for SuperAdmin
  const [rolePermissions, setRolePermissions] = useState<{
    ADMIN: { FINANCE: boolean; CMS: boolean; SYSTEM: boolean };
    COMMITTEE_MEMBER: { FINANCE: boolean; CMS: boolean; SYSTEM: boolean };
  }>({
    ADMIN: { FINANCE: true, CMS: true, SYSTEM: false },
    COMMITTEE_MEMBER: { FINANCE: false, CMS: true, SYSTEM: false },
  });
  const [_savingPermissions, setSavingPermissions] = useState(false);

  // WHATSAPP PROFILE DRAWER STATE
  const [drawerUser, setDrawerUser] = useState<UserAccount | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // CREATE USER MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePhoto: '',
    role: (isAdmin ? 'MEMBER' : 'ADMIN') as UserRole,
    password: '',
  });

  // MANAGE PERMISSIONS & ROLE MODAL STATE (SUPERADMIN)
  const [permissionTarget, setPermissionTarget] = useState<UserAccount | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('MEMBER');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newRolePassword, setNewRolePassword] = useState('');
  const [isSavingUserPerms, setIsSavingUserPerms] = useState(false);

  // Password Visibility state per user ID (for SuperAdmin)
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getUsers();
      if (res.success) {
        setUsers(res.data || []);
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to fetch user accounts.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = async () => {
    try {
      const res = await publicAPI.getSettings();
      if (res?.success && res?.data?.rolePermissions) {
        setRolePermissions(res.data.rolePermissions);
      }
    } catch {}
  };

  useEffect(() => {
    fetchUsers();
    fetchRolePermissions();
  }, []);

  const handleTogglePermission = (
    roleKey: 'ADMIN' | 'COMMITTEE_MEMBER',
    moduleKey: 'FINANCE' | 'CMS' | 'SYSTEM',
    value: boolean
  ) => {
    setRolePermissions((prev) => ({
      ...prev,
      [roleKey]: {
        ...prev[roleKey],
        [moduleKey]: value,
      },
    }));
  };
  void handleTogglePermission;

  const handleSavePermissions = async () => {
    setSavingPermissions(true);
    try {
      const res = await adminAPI.updateSettings({ rolePermissions });
      if (res.success) {
        setNotification({
          type: 'success',
          message: 'Role Access Permissions saved successfully! Access policies updated.',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update role permissions.',
      });
    } finally {
      setSavingPermissions(false);
    }
  };
  void handleSavePermissions;

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let randPass = '';
    for (let i = 0; i < 10; i++) {
      randPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: randPass }));
  };

  const handleGenerateNewRolePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let randPass = '';
    for (let i = 0; i < 10; i++) {
      randPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewRolePassword(randPass);
  };

  const handleOpenModal = () => {
    const initialRole = isAdmin ? 'MEMBER' : 'ADMIN';
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      profilePhoto: '',
      role: initialRole,
      password: initialRole === 'MEMBER' ? '' : 'Admin@2026',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const { name, email, password, role, phone, address, profilePhoto } = formData;

    // Validate required fields
    if (role === 'MEMBER') {
      if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !profilePhoto.trim()) {
        setFormError('All 5 fields (Full Name, Email, Phone Number, Address, and Profile Photo) are strictly required for Member accounts.');
        return;
      }
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setFormError('Please fill in Name, Email, and Initial Password.');
        return;
      }
    }

    setFormLoading(true);
    try {
      const res = await userAPI.createUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        profilePhoto: profilePhoto.trim(),
        role,
        password: role === 'MEMBER' ? undefined : password.trim(),
      });

      if (res.success) {
        setNotification({
          type: 'success',
          message: `Account created for ${name} (${role})! ${
            role === 'MEMBER'
              ? 'Initialized with zero permissions (No password required).'
              : `Initial login password: ${password}`
          }`,
        });
        setIsModalOpen(false);
        fetchUsers();
      } else {
        setFormError(res.message || 'Failed to create account.');
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Error creating user account.');
    } finally {
      setFormLoading(false);
    }
  };

  // Open WhatsApp Profile Drawer
  const handleOpenDrawer = (targetUser: UserAccount) => {
    setDrawerUser(targetUser);
    setIsDrawerOpen(true);
  };

  // Sync drawer user updates back into user list
  const handleDrawerUserUpdated = (updatedUser: any) => {
    const uid = updatedUser.id || updatedUser._id;
    setUsers((prev) => prev.map((u) => (u.id === uid || u._id === uid ? { ...u, ...updatedUser } : u)));
    setDrawerUser(updatedUser);
    if (currentUser && (currentUser.id === uid || (currentUser as any)._id === uid)) {
      updateAuthUser(updatedUser);
    }
  };

  // Open Manage Permissions & Role Modal (SuperAdmin)
  const handleOpenManagePermissions = (targetUser: UserAccount) => {
    setPermissionTarget(targetUser);
    setSelectedRole(targetUser.role);
    setSelectedPermissions(targetUser.permissions || []);
    setNewRolePassword('');
  };

  // Toggle single permission for user
  const handleToggleUserPermission = (permKey: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  const handleSelectAllPerms = () => {
    setSelectedPermissions(ALL_SYSTEM_MODULES.map((m) => m.key));
  };
  const handleClearAllPerms = () => {
    setSelectedPermissions([]);
  };

  // Save User Permissions & Role (SuperAdmin)
  const handleSaveUserPermissionsAndRole = async () => {
    if (!permissionTarget) return;
    const targetId = permissionTarget.id || permissionTarget._id!;
    setIsSavingUserPerms(true);

    try {
      const payload: any = {
        role: selectedRole,
        permissions: selectedPermissions,
      };

      if (newRolePassword && newRolePassword.length >= 6) {
        payload.password = newRolePassword;
      }

      const res = await userAPI.updateUser(targetId, payload);

      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === targetId || u._id === targetId
              ? {
                  ...u,
                  role: selectedRole,
                  permissions: selectedPermissions,
                  plainPassword: newRolePassword ? newRolePassword : u.plainPassword,
                }
              : u
          )
        );

        if (currentUser && (currentUser.id === targetId || (currentUser as any)._id === targetId)) {
          updateAuthUser({ role: selectedRole, permissions: selectedPermissions });
        }

        setNotification({
          type: 'success',
          message: `Permissions & Role updated for ${permissionTarget.name}. Role: ${selectedRole}, ${
            selectedPermissions.length
          } modules granted.${newRolePassword ? ` New password: ${newRolePassword}` : ''}`,
        });
        setPermissionTarget(null);
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update permissions.',
      });
    } finally {
      setIsSavingUserPerms(false);
    }
  };

  const handleToggleActive = async (targetUser: UserAccount, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetId = targetUser.id || targetUser._id!;
    if (currentUser && (currentUser.id === targetId || (currentUser as any)._id === targetId)) {
      setNotification({ type: 'error', message: 'You cannot suspend your own active logged-in account.' });
      return;
    }
    if (isAdmin && targetUser.role !== 'COMMITTEE_MEMBER' && targetUser.role !== 'MEMBER') {
      setNotification({
        type: 'error',
        message: 'Permission denied: Admins can only manage Committee Member and Member accounts.',
      });
      return;
    }

    try {
      const updatedStatus = !targetUser.isActive;
      const res = await userAPI.updateUser(targetId, {
        isActive: updatedStatus,
      });
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id || u._id === targetUser._id ? { ...u, isActive: updatedStatus } : u))
        );
        setNotification({
          type: 'success',
          message: `Account status for ${targetUser.name} changed to ${updatedStatus ? 'ACTIVE' : 'SUSPENDED'}.`,
        });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to update user status.' });
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUserClick = (targetUser: UserAccount, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetId = targetUser.id || targetUser._id!;
    if (currentUser && (currentUser.id === targetId || (currentUser as any)._id === targetId)) {
      setNotification({ type: 'error', message: 'You cannot delete your own logged-in account.' });
      return;
    }
    if (isAdmin && targetUser.role !== 'COMMITTEE_MEMBER' && targetUser.role !== 'MEMBER') {
      setNotification({
        type: 'error',
        message: 'Permission denied: Admins can only delete Committee Member and Member accounts.',
      });
      return;
    }
    setDeleteTarget(targetUser);
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id || deleteTarget._id!;
    setIsDeleting(true);

    try {
      const res = await userAPI.deleteUser(targetId);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id && u._id !== deleteTarget._id));
        setNotification({ type: 'success', message: `User account deleted successfully.` });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete user account.',
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const togglePasswordVisibility = (userId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleCopyPassword = (userId: string, passText: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(passText);
    setCopiedId(userId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.address && u.address.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Stats calculation
  const totalUsers = users.length;
  const superAdminCount = users.filter((u) => u.role === 'SUPERADMIN').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const committeeMemberCount = users.filter((u) => u.role === 'COMMITTEE_MEMBER').length;
  const memberCount = users.filter((u) => u.role === 'MEMBER').length;
  const pendingPasswordCount = users.filter((u) => u.mustChangePassword).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-lg animate-fade-in ${
            notification.type === 'success'
              ? 'bg-[#15341E] text-[#4ADE80] border border-[#4ADE80]/40'
              : 'bg-[#3E0A10] text-[#F87171] border border-[#F87171]/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1F0407] border-2 border-[#D4A72C]/40 p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl text-[#FFF7E8] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-0.5 z-10">
          <div className="flex items-center gap-1.5 text-[#F4B942] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="font-cinzel text-lg sm:text-2xl font-black text-[#F4B942] tracking-wide">
            User Account & Role Management
          </h1>
          <p className="text-[11px] sm:text-xs text-[#FFF7E8]/70">
            Tap any user row to open their <b>Profile Card</b> to view contact info or edit details.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10">
          <button
            onClick={fetchUsers}
            title="Refresh Account List"
            className="p-2 sm:p-2.5 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 rounded-xl text-[#F4B942] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenModal}
            className="px-3.5 py-2 bg-gradient-to-r from-[#D4A72C] to-[#E87516] hover:from-[#F4B942] hover:to-[#E87516] text-[#1F0407] font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>🔑 Create Account</span>
          </button>
        </div>
      </div>

      {/* Analytics & Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-2.5 sm:p-3.5 rounded-2xl space-y-0.5 min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#FFF7E8]/60 tracking-wider block truncate">Total Accounts</span>
          <div className="text-base sm:text-xl font-black text-[#F4B942]">{totalUsers}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-2.5 sm:p-3.5 rounded-2xl space-y-0.5 min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-400 tracking-wider block truncate">Super Admins</span>
          <div className="text-base sm:text-xl font-black text-amber-400">{superAdminCount}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-2.5 sm:p-3.5 rounded-2xl space-y-0.5 min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-orange-400 tracking-wider block truncate">Admins</span>
          <div className="text-base sm:text-xl font-black text-orange-400">{adminCount}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-2.5 sm:p-3.5 rounded-2xl space-y-0.5 min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-400 tracking-wider block truncate">Committee</span>
          <div className="text-base sm:text-xl font-black text-emerald-400">{committeeMemberCount}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-2.5 sm:p-3.5 rounded-2xl space-y-0.5 min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-cyan-400 tracking-wider block truncate">Members</span>
          <div className="text-base sm:text-xl font-black text-cyan-400">{memberCount}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-2.5 sm:p-3.5 rounded-2xl space-y-0.5 min-w-0">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-purple-400 tracking-wider block truncate">Pending Pass</span>
          <div className="text-base sm:text-xl font-black text-purple-400">{pendingPasswordCount}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between bg-[#1F0407] p-3 sm:p-4 rounded-2xl border border-[#D4A72C]/30">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#D4A72C]/60" />
          <input
            type="text"
            placeholder="Search by name, email, phone or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-[11px] sm:text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#FFF7E8]/70 shrink-0">Role:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-[#120204] border border-[#D4A72C]/30 text-[11px] sm:text-xs text-[#F4B942] font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#F4B942] w-full sm:w-auto"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="SUPERADMIN">SuperAdmin ({superAdminCount})</option>
            <option value="ADMIN">Admin ({adminCount})</option>
            <option value="COMMITTEE_MEMBER">Committee ({committeeMemberCount})</option>
            <option value="MEMBER">Member ({memberCount})</option>
          </select>
        </div>
      </div>

      {/* Accounts List Container (Mobile Cards & Desktop Table) */}
      <div className="bg-[#1F0407] border-2 border-[#D4A72C]/40 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-[#F4B942] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#FFF7E8]/70">Loading system accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-12 h-12 text-[#D4A72C]/40 mx-auto" />
            <p className="text-sm font-semibold text-[#FFF7E8]/80">No user accounts found matching your query.</p>
          </div>
        ) : (
          <>
            {/* 1. MOBILE CARD VIEW (< 768px): Touch-Optimized Cards */}
            <div className="block md:hidden divide-y divide-[#D4A72C]/20">
              {filteredUsers.map((usr) => {
                const uid = usr.id || usr._id!;
                const currentUserId = currentUser?.id || (currentUser as any)?._id;
                const isSelf = currentUserId === uid || currentUser?.email?.toLowerCase() === usr.email.toLowerCase();
                const canToggleStatus = isSuperAdmin ? !isSelf : (isAdmin && !isSelf && (usr.role === 'COMMITTEE_MEMBER' || usr.role === 'MEMBER'));
                const canDelete = isSuperAdmin ? !isSelf : (isAdmin && !isSelf && (usr.role === 'COMMITTEE_MEMBER' || usr.role === 'MEMBER'));
                const permsCount = usr.permissions ? usr.permissions.length : 0;

                return (
                  <div
                    key={uid}
                    onClick={() => handleOpenDrawer(usr)}
                    className={`p-4 space-y-3 cursor-pointer hover:bg-[#2A050A]/70 transition-colors ${
                      isSelf ? 'bg-[#240407]/40' : ''
                    }`}
                  >
                    {/* Top Row: Avatar + Name + Role Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {usr.profilePhoto ? (
                          <img
                            src={usr.profilePhoto}
                            alt={usr.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-[#F4B942] shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#32070B] border-2 border-[#D4A72C]/40 flex items-center justify-center font-bold text-[#F4B942] text-base shrink-0">
                            {usr.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-sm text-[#FFF7E8] flex items-center gap-1.5">
                            <span>{usr.name}</span>
                            {isSelf && (
                              <span className="text-[9px] bg-[#D4A72C]/20 text-[#F4B942] px-1.5 py-0.2 rounded border border-[#D4A72C]/40 font-bold uppercase">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#FFF7E8]/60 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#D4A72C] shrink-0" />
                            <span className="truncate max-w-[180px]">{usr.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Role Badge (Never Wraps) */}
                      <div className="shrink-0">
                        {usr.role === 'SUPERADMIN' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-[9px] uppercase tracking-wider whitespace-nowrap inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            SuperAdmin
                          </span>
                        ) : usr.role === 'ADMIN' ? (
                          <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-300 font-bold text-[9px] uppercase tracking-wider whitespace-nowrap inline-block">
                            Admin
                          </span>
                        ) : usr.role === 'COMMITTEE_MEMBER' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-[9px] uppercase tracking-wider whitespace-nowrap inline-block">
                            Committee Member
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold text-[9px] uppercase tracking-wider whitespace-nowrap inline-block">
                            Member
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle Details (Phone & Address) */}
                    {(usr.phone || usr.address) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#FFF7E8]/70 pt-1 border-t border-[#D4A72C]/10">
                        {usr.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{usr.phone}</span>
                          </div>
                        )}
                        {usr.address && (
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">{usr.address}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Status & Quick Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#D4A72C]/15" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {/* Status Toggle Button */}
                        <button
                          onClick={(e) => handleToggleActive(usr, e)}
                          disabled={!canToggleStatus}
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border transition-all disabled:opacity-40 ${
                            usr.isActive
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                              : 'bg-red-950 text-red-400 border-red-500/50'
                          }`}
                        >
                          {usr.isActive ? 'Active' : 'Suspended'}
                        </button>

                        {/* Permissions Pill */}
                        <span className="text-[10px] text-[#FFF7E8]/60">
                          {usr.role === 'SUPERADMIN' ? (
                            <span className="text-amber-400 font-bold">Full Access</span>
                          ) : permsCount > 0 ? (
                            <span className="text-emerald-400 font-semibold">{permsCount} Modules</span>
                          ) : (
                            <span>0 Modules</span>
                          )}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenDrawer(usr)}
                          className="px-2.5 py-1 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-[#F4B942] rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <UserIcon className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>

                        {isSuperAdmin && !isSelf && (
                          <button
                            onClick={() => handleOpenManagePermissions(usr)}
                            className="p-1.5 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-emerald-400 rounded-lg"
                            title="Manage Permissions"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={(e) => handleDeleteUserClick(usr, e)}
                          disabled={!canDelete}
                          className="p-1.5 hover:bg-red-950/80 rounded-lg text-red-400 disabled:opacity-30"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. DESKTOP TABLE VIEW (≥ 768px): Full Table with Clean Spacing */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#120204] text-[#F4B942] uppercase text-[10px] tracking-wider border-b border-[#D4A72C]/30">
                  <tr>
                    <th className="py-4 px-4 font-bold">User / Profile Card</th>
                    <th className="py-4 px-4 font-bold">Role & Permissions</th>
                    <th className="py-4 px-4 font-bold">Status</th>
                    <th className="py-4 px-4 font-bold">1st Login Security</th>
                    <th className="py-4 px-4 font-bold">
                      {isSuperAdmin ? 'Password (SuperAdmin View)' : 'Password Security'}
                    </th>
                    <th className="py-4 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A72C]/20 text-[#FFF7E8]/90">
                  {filteredUsers.map((usr) => {
                    const uid = usr.id || usr._id!;
                    const isVisible = visiblePasswords[uid];
                    const currentUserId = currentUser?.id || (currentUser as any)?._id;
                    const isSelf = currentUserId === uid || currentUser?.email?.toLowerCase() === usr.email.toLowerCase();
                    const canToggleStatus = isSuperAdmin ? !isSelf : (isAdmin && !isSelf && (usr.role === 'COMMITTEE_MEMBER' || usr.role === 'MEMBER'));
                    const canDelete = isSuperAdmin ? !isSelf : (isAdmin && !isSelf && (usr.role === 'COMMITTEE_MEMBER' || usr.role === 'MEMBER'));
                    const permsCount = usr.permissions ? usr.permissions.length : 0;

                    return (
                      <tr
                        key={uid}
                        onClick={() => handleOpenDrawer(usr)}
                        className={`hover:bg-[#2A050A]/70 cursor-pointer transition-colors group ${
                          isSelf ? 'bg-[#240407]/40' : ''
                        }`}
                        title="Click to open WhatsApp-style profile card"
                      >
                        {/* Name, Avatar & Contact Details */}
                        <td className="py-4 px-4 space-y-1">
                          <div className="flex items-center gap-3">
                            {usr.profilePhoto ? (
                              <img
                                src={usr.profilePhoto}
                                alt={usr.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-[#F4B942] shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#32070B] border-2 border-[#D4A72C]/40 flex items-center justify-center font-bold text-[#F4B942] text-sm shrink-0 group-hover:scale-105 transition-transform">
                                {usr.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-xs text-[#FFF7E8] flex items-center gap-1.5 group-hover:text-[#F4B942] transition-colors">
                                <span>{usr.name}</span>
                                {isSelf && (
                                  <span className="text-[9px] bg-[#D4A72C]/20 text-[#F4B942] px-1.5 py-0.2 rounded border border-[#D4A72C]/40 font-bold uppercase">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#FFF7E8]/60 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-[#D4A72C]" />
                                <span>{usr.email}</span>
                              </div>
                              {usr.phone && (
                                <div className="text-[11px] text-[#FFF7E8]/60 flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-emerald-400" />
                                  <span>{usr.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role & Granular Permissions Badge */}
                        <td className="py-4 px-4 space-y-1.5">
                          <div>
                            {usr.role === 'SUPERADMIN' ? (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 whitespace-nowrap">
                                <ShieldCheck className="w-3 h-3" />
                                SuperAdmin
                              </span>
                            ) : usr.role === 'ADMIN' ? (
                              <span className="px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-300 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap inline-block">
                                Admin
                              </span>
                            ) : usr.role === 'COMMITTEE_MEMBER' ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap inline-block">
                                Committee Member
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap inline-block">
                                Member
                              </span>
                            )}
                          </div>

                          {/* Permissions Overview Indicator */}
                          <div className="text-[10px] text-[#FFF7E8]/60">
                            {usr.role === 'SUPERADMIN' ? (
                              <span className="text-amber-400 font-bold">Full Access (All Modules)</span>
                            ) : usr.role === 'ADMIN' ? (
                              <span>Standard Admin Matrix</span>
                            ) : usr.role === 'COMMITTEE_MEMBER' ? (
                              <span>Standard CMS Matrix</span>
                            ) : (
                              <span className={permsCount > 0 ? 'text-emerald-400 font-semibold' : 'text-gray-400'}>
                                {permsCount === 0 ? '🔒 Zero Permissions' : `✅ ${permsCount} Module${permsCount > 1 ? 's' : ''} Granted`}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleToggleActive(usr, e)}
                            disabled={!canToggleStatus}
                            title={
                              isSelf
                                ? 'You cannot suspend your own logged-in account'
                                : !canToggleStatus
                                ? 'Admins can only manage Committee Member & Member status'
                                : 'Toggle account status'
                            }
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                              usr.isActive
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900'
                                : 'bg-red-950 text-red-400 border border-red-500/40 hover:bg-red-900'
                            }`}
                          >
                            {usr.isActive ? 'Active' : 'Suspended'}
                          </button>
                        </td>

                        {/* First Login Password Change Badge */}
                        <td className="py-4 px-4">
                          {usr.role === 'MEMBER' ? (
                            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-[10px] whitespace-nowrap">
                              No Password Required
                            </span>
                          ) : usr.mustChangePassword ? (
                            <span className="px-2.5 py-1 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300 text-[10px] font-semibold whitespace-nowrap">
                              Pending 1st Login Change
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-[10px] whitespace-nowrap">
                              Password Set
                            </span>
                          )}
                        </td>

                        {/* SuperAdmin Password Visibility Column */}
                        <td className="py-4 px-4">
                          {isSuperAdmin ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <div className="font-mono bg-[#120204] border border-[#D4A72C]/30 px-2.5 py-1 rounded-lg text-xs text-[#F4B942]">
                                {usr.role === 'MEMBER' && !usr.plainPassword
                                  ? 'No login password'
                                  : isVisible
                                  ? usr.plainPassword || '••••••••'
                                  : '••••••••'}
                              </div>
                              {usr.plainPassword && (
                                <>
                                  <button
                                    onClick={(e) => togglePasswordVisibility(uid, e)}
                                    className="p-1.5 hover:bg-[#32070B] rounded-lg text-[#FFF7E8]/70 hover:text-[#F4B942]"
                                    title={isVisible ? 'Hide Password' : 'Show Password'}
                                  >
                                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={(e) => handleCopyPassword(uid, usr.plainPassword!, e)}
                                    className="p-1.5 hover:bg-[#32070B] rounded-lg text-[#FFF7E8]/70 hover:text-[#F4B942]"
                                    title="Copy Password"
                                  >
                                    {copiedId === uid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="text-[11px] text-[#FFF7E8]/50 italic flex items-center gap-1 whitespace-nowrap">
                              <Lock className="w-3 h-3 text-red-400" />
                              <span>Protected</span>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Open WhatsApp Contact Drawer */}
                            <button
                              onClick={() => handleOpenDrawer(usr)}
                              className="p-2 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-[#F4B942] rounded-xl transition-colors"
                              title="View WhatsApp Profile Card"
                            >
                              <UserIcon className="w-4 h-4" />
                            </button>

                            {/* SuperAdmin: Manage Permissions & Role */}
                            {isSuperAdmin && !isSelf && (
                              <button
                                onClick={() => handleOpenManagePermissions(usr)}
                                className="p-2 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-emerald-400 rounded-xl transition-colors"
                                title="Manage Granular Permissions & Role"
                              >
                                <Shield className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete User */}
                            <button
                              onClick={(e) => handleDeleteUserClick(usr, e)}
                              disabled={!canDelete}
                              className="p-2 hover:bg-red-950/80 rounded-xl text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title={
                                isSelf
                                  ? 'You cannot delete your own logged-in account'
                                  : !canDelete
                                  ? 'Admins can only delete Committee Member and Member accounts'
                                  : 'Delete User Account'
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* CREATE ACCOUNT MODAL (Clean, Easy-To-Use & Intuitive) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-[#170204] border-2 border-[#D4A72C]/70 rounded-3xl p-5 sm:p-6 text-[#FFF7E8] shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8] rounded-full hover:bg-[#32070B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 border-b border-[#D4A72C]/30 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4A72C] to-[#E87516] flex items-center justify-center text-[#1F0407] shadow-md shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F4B942]">Create New User Account</h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  {isAdmin
                    ? 'Admins can create Committee Member and Member accounts.'
                    : 'SuperAdmins can create accounts across all 4 system roles.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-950 border border-red-500/50 rounded-xl text-xs text-red-200">
                  {formError}
                </div>
              )}

              {/* 1. Account Role Selector */}
              <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-3.5 rounded-2xl space-y-1.5">
                <label className="block text-xs font-bold text-[#F4B942] uppercase tracking-wider">
                  Select Account Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    const newRole = e.target.value as UserRole;
                    setFormData({
                      ...formData,
                      role: newRole,
                      password: newRole === 'MEMBER' ? '' : formData.password || 'Member@2026',
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#120204] border border-[#D4A72C]/40 rounded-xl text-xs text-[#FFF7E8] font-bold focus:outline-none focus:border-[#F4B942]"
                >
                  {isSuperAdmin && <option value="SUPERADMIN">SuperAdmin (Full Unrestricted Access)</option>}
                  {isSuperAdmin && <option value="ADMIN">Admin (Finance, CMS & Management)</option>}
                  <option value="COMMITTEE_MEMBER">Committee Member (CMS Operations)</option>
                  <option value="MEMBER">Member (0 Default Permissions • Profile Only)</option>
                </select>

                {formData.role === 'MEMBER' ? (
                  <div className="text-[11px] text-cyan-300 flex items-center gap-1.5 pt-1">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span><b>Member Role:</b> Zero default permissions. <b>No password required</b> on creation.</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-orange-300 flex items-center gap-1.5 pt-1">
                    <Key className="w-3.5 h-3.5 shrink-0" />
                    <span>Active login account. Requires an initial login password.</span>
                  </div>
                )}
              </div>

              {/* 2. Direct Mobile Gallery Profile Photo Uploader */}
              <ProfilePhotoUploader
                value={formData.profilePhoto}
                onChange={(url) => setFormData({ ...formData, profilePhoto: url })}
                userName={formData.name}
                label="Profile Photo (Mobile Gallery / Camera / Presets)"
                required={formData.role === 'MEMBER'}
              />

              {/* 3. Name & Email (2-Column Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rajesh@vighnaharta.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>
              </div>

              {/* 4. Phone & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                    Phone Number {formData.role === 'MEMBER' && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="tel"
                    required={formData.role === 'MEMBER'}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                    Address {formData.role === 'MEMBER' && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="text"
                    required={formData.role === 'MEMBER'}
                    placeholder="Kamakhyanagar, Dhenkanal, Odisha"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>
              </div>

              {/* 5. Password Field (ONLY for Non-Member roles) */}
              {formData.role !== 'MEMBER' ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider">
                      Initial Login Password *
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[11px] text-[#F4B942] hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto Generate</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] font-mono focus:outline-none focus:border-[#F4B942]"
                  />
                </div>
              ) : (
                <div className="p-3 bg-[#120204] border border-cyan-500/30 rounded-2xl text-[11px] text-cyan-200 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <b>No Password Needed for Member</b>: Members exist as inactive contact profiles until Super Admin assigns permissions/role and password.
                  </span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4A72C]/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D4A72C]/30 text-xs font-semibold text-[#FFF7E8]/80 hover:bg-[#32070B]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] font-bold text-xs rounded-xl shadow-lg shadow-[#D4A72C]/20 hover:brightness-110 flex items-center gap-2"
                >
                  {formLoading ? (
                    <div className="w-4 h-4 border-2 border-[#1F0407] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create {formData.role === 'MEMBER' ? 'Member' : 'User'} Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPERADMIN: MANAGE PERMISSIONS & ROLE MODAL */}
      {permissionTarget && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#170204] border-2 border-[#D4A72C]/70 rounded-3xl p-5 sm:p-6 text-[#FFF7E8] shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setPermissionTarget(null)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8] rounded-full hover:bg-[#32070B]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-[#D4A72C]/30 pb-4 mb-4">
              {permissionTarget.profilePhoto ? (
                <img
                  src={permissionTarget.profilePhoto}
                  alt={permissionTarget.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#F4B942]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#32070B] border-2 border-[#F4B942] flex items-center justify-center text-[#F4B942] text-xl font-bold font-cinzel">
                  {permissionTarget.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-cinzel text-lg font-bold text-[#F4B942]">
                  Manage Permissions & Role: {permissionTarget.name}
                </h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  Account: {permissionTarget.email} • Current Role: <span className="font-bold text-[#F4B942]">{permissionTarget.role}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Role Transition Selector */}
              <div className="bg-[#120204] border border-[#D4A72C]/30 p-4 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-[#F4B942] uppercase tracking-wider">
                  Update Account Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 bg-[#1F0407] border border-[#D4A72C]/40 rounded-xl text-xs text-[#FFF7E8] font-bold focus:outline-none focus:border-[#F4B942]"
                >
                  <option value="SUPERADMIN">SuperAdmin (Full Permissions Bypass)</option>
                  <option value="ADMIN">Admin (Finance & CMS Standard Access)</option>
                  <option value="COMMITTEE_MEMBER">Committee Member (CMS Standard Access)</option>
                  <option value="MEMBER">Member (Custom Granular Permission Mode)</option>
                </select>

                {/* If upgrading from Member to an active role, allow setting login password */}
                {permissionTarget.role === 'MEMBER' && selectedRole !== 'MEMBER' && (
                  <div className="pt-2 border-t border-[#D4A72C]/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Key className="w-3.5 h-3.5" />
                        <span>Assign Login Password (Role Upgrade) *</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateNewRolePassword}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auto Generate</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter initial password for upgraded user"
                      value={newRolePassword}
                      onChange={(e) => setNewRolePassword(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1F0407] border border-amber-500/40 rounded-xl text-xs text-[#FFF7E8] font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              {/* Granular Module Permissions Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#F4B942] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#F4B942]" />
                    <span>Granular Module Access Permissions ({selectedPermissions.length} / {ALL_SYSTEM_MODULES.length} Granted)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllPerms}
                      className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Select All</span>
                    </button>
                    <span className="text-[#D4A72C]/40">•</span>
                    <button
                      type="button"
                      onClick={handleClearAllPerms}
                      className="text-[11px] font-bold text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {ALL_SYSTEM_MODULES.map((mod) => {
                    const isChecked = selectedPermissions.includes(mod.key) || selectedPermissions.includes('ALL');

                    return (
                      <label
                        key={mod.key}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#15341E] border-emerald-500/50 text-emerald-200 shadow-sm'
                            : 'bg-[#120204] border-[#D4A72C]/20 text-[#FFF7E8]/70 hover:border-[#D4A72C]/50'
                        }`}
                      >
                        <div className="pr-2">
                          <div className={`font-bold text-xs ${isChecked ? 'text-emerald-300' : 'text-[#FFF7E8]'}`}>
                            {mod.name}
                          </div>
                          <div className="text-[10px] opacity-70 leading-tight">{mod.desc}</div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleUserPermission(mod.key)}
                          className="w-4 h-4 text-[#D4A72C] rounded focus:ring-0 cursor-pointer accent-[#D4A72C] shrink-0"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D4A72C]/30">
                <button
                  type="button"
                  onClick={() => setPermissionTarget(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#D4A72C]/30 text-xs font-semibold text-[#FFF7E8]/80 hover:bg-[#32070B]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveUserPermissionsAndRole}
                  disabled={isSavingUserPerms}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] font-bold text-xs rounded-xl shadow-lg shadow-[#D4A72C]/20 hover:brightness-110 flex items-center gap-2"
                >
                  {isSavingUserPerms ? (
                    <div className="w-4 h-4 border-2 border-[#1F0407] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Permissions & Role</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP PROFILE DRAWER (Slide-out dedicated card) */}
      <WhatsAppProfileDrawer
        user={drawerUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUserUpdated={handleDrawerUserUpdated}
        onOpenManagePermissions={(u) => {
          setIsDrawerOpen(false);
          handleOpenManagePermissions(u);
        }}
      />

      {/* CONFIRM DELETE POPUP */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete User Account"
        itemTitle={deleteTarget?.name}
        message={`Are you sure you want to permanently delete the user account for ${deleteTarget?.name} (${deleteTarget?.email})? This action cannot be undone.`}
        confirmText="Yes, Delete User"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteUser}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
