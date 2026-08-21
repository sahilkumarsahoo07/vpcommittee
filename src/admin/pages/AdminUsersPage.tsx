import React, { useState, useEffect } from 'react';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
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
} from 'lucide-react';

interface UserAccount {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  mustChangePassword?: boolean;
  plainPassword?: string;
  createdAt?: string;
}

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'SUPERADMIN';
  const isAdmin = currentUser?.role === 'ADMIN';

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: isAdmin ? 'COMMITTEE_MEMBER' : ('ADMIN' as UserRole),
    password: '',
  });

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let randPass = '';
    for (let i = 0; i < 10; i++) {
      randPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: randPass }));
  };

  const handleOpenModal = () => {
    handleGeneratePassword();
    setFormData((prev) => ({
      ...prev,
      name: '',
      email: '',
      phone: '',
      role: isAdmin ? 'COMMITTEE_MEMBER' : 'ADMIN',
    }));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setFormLoading(true);
    try {
      const res = await userAPI.createUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
      });

      if (res.success) {
        setNotification({
          type: 'success',
          message: `Account created for ${formData.name}! Assigned role: ${formData.role}. Initial password: ${formData.password}`,
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

  const handleToggleActive = async (targetUser: UserAccount) => {
    const targetId = targetUser.id || targetUser._id!;
    if (currentUser && (currentUser.id === targetId || (currentUser as any)._id === targetId)) {
      setNotification({ type: 'error', message: 'You cannot suspend your own active logged-in account.' });
      return;
    }
    if (isAdmin && targetUser.role !== 'COMMITTEE_MEMBER') {
      setNotification({ type: 'error', message: 'Permission denied: Admins can only manage Committee Member accounts.' });
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

  const handleDeleteUserClick = (targetUser: UserAccount) => {
    const targetId = targetUser.id || targetUser._id!;
    if (currentUser && (currentUser.id === targetId || (currentUser as any)._id === targetId)) {
      setNotification({ type: 'error', message: 'You cannot delete your own logged-in account.' });
      return;
    }
    if (isAdmin && targetUser.role !== 'COMMITTEE_MEMBER') {
      setNotification({ type: 'error', message: 'Permission denied: Admins can only delete Committee Member accounts.' });
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

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleCopyPassword = (userId: string, passText: string) => {
    navigator.clipboard.writeText(passText);
    setCopiedId(userId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Stats calculation
  const totalUsers = users.length;
  const superAdminCount = users.filter((u) => u.role === 'SUPERADMIN').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const memberCount = users.filter((u) => u.role === 'COMMITTEE_MEMBER').length;
  const pendingPasswordCount = users.filter((u) => u.mustChangePassword).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-lg animate-fade-in ${notification.type === 'success'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1F0407] border-2 border-[#D4A72C]/40 p-6 rounded-3xl text-[#FFF7E8] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-[#F4B942] text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-[#F4B942] tracking-wide">
            User Account Management
          </h1>
          <p className="text-xs text-[#FFF7E8]/70">
            {isSuperAdmin
              ? 'SuperAdmin Access: Create & manage Admin & Committee Member accounts, view plain passwords, and enforce security policies.'
              : 'Admin Access: Create & manage Committee Member accounts.'}
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={fetchUsers}
            title="Refresh Account List"
            className="p-3 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 rounded-2xl text-[#F4B942] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenModal}
            className="px-5 py-3 bg-gradient-to-r from-[#D4A72C] to-[#E87516] hover:from-[#F4B942] hover:to-[#E87516] text-[#1F0407] font-bold text-xs rounded-2xl shadow-lg shadow-[#D4A72C]/20 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>🔑 Create Login Account</span>
          </button>
        </div>
      </div>

      {/* Distinction Guide Banner */}
      <div className="bg-[#1F0407] border border-[#D4A72C]/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#FFF7E8]/90 shadow-md">
        <div className="space-y-1">
          <span className="font-bold text-[#F4B942] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#F4B942]" />
            <span>Portal Login Account vs. Donor Record Profile</span>
          </span>
          <p className="text-[11px] text-[#FFF7E8]/70 leading-relaxed">
            <b>🔑 Create Login Account:</b> Generates portal login credentials (email + password) for SuperAdmins, Admins, or Members to log into this system.<br />
            <b>📒 Record-Keeping Donor Profile:</b> To quickly record money, cash payments, or pledges for devotees without granting login access, use <i>"Add Donor Profile"</i> in Donations & Receipts.
          </p>
        </div>
      </div>

      {/* Analytics & Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#FFF7E8]/60 tracking-wider">Total Accounts</span>
          <div className="text-xl sm:text-2xl font-black text-[#F4B942]">{totalUsers}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Super Admins</span>
          <div className="text-xl sm:text-2xl font-black text-amber-400">{superAdminCount}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Admins</span>
          <div className="text-xl sm:text-2xl font-black text-orange-400">{adminCount}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Committee Members</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">{memberCount}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-4 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">1st Login Pending</span>
          <div className="text-xl sm:text-2xl font-black text-purple-400">{pendingPasswordCount}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#1F0407] p-4 rounded-2xl border border-[#D4A72C]/30">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#D4A72C]/60" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-[#FFF7E8]/70 shrink-0">Role Filter:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-[#120204] border border-[#D4A72C]/30 text-xs text-[#F4B942] font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#F4B942] w-full sm:w-auto"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPERADMIN">SuperAdmin</option>
            <option value="ADMIN">Admin</option>
            <option value="COMMITTEE_MEMBER">Committee Member</option>
          </select>
        </div>
      </div>

      {/* Accounts List Table */}
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#120204] text-[#F4B942] uppercase text-[10px] tracking-wider border-b border-[#D4A72C]/30">
                <tr>
                  <th className="py-4 px-4 font-bold">User Details</th>
                  <th className="py-4 px-4 font-bold">Role</th>
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

                  return (
                    <tr key={uid} className="hover:bg-[#2A050A]/60 transition-colors">
                      {/* Name & Contact */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#32070B] border border-[#D4A72C]/40 flex items-center justify-center font-bold text-[#F4B942]">
                            {usr.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[#FFF7E8]">{usr.name}</div>
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

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        {usr.role === 'SUPERADMIN' ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-400" />
                            SuperAdmin
                          </span>
                        ) : usr.role === 'ADMIN' ? (
                          <span className="px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-300 font-bold text-[10px] uppercase tracking-wider">
                            Admin
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-[10px] uppercase tracking-wider">
                            Committee Member
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(usr)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${usr.isActive
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900'
                            : 'bg-red-950 text-red-400 border border-red-500/40 hover:bg-red-900'
                            }`}
                        >
                          {usr.isActive ? 'Active' : 'Suspended'}
                        </button>
                      </td>

                      {/* First Login Password Change Badge */}
                      <td className="py-4 px-4">
                        {usr.mustChangePassword ? (
                          <span className="px-2.5 py-1 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300 text-[10px] font-semibold">
                            Pending 1st Login Change
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-[10px]">
                            Password Set
                          </span>
                        )}
                      </td>

                      {/* SuperAdmin Password Visibility Column */}
                      <td className="py-4 px-4">
                        {isSuperAdmin ? (
                          <div className="flex items-center gap-2">
                            <div className="font-mono bg-[#120204] border border-[#D4A72C]/30 px-2.5 py-1 rounded-lg text-xs text-[#F4B942]">
                              {isVisible ? usr.plainPassword || '123456' : '••••••••'}
                            </div>
                            <button
                              onClick={() => togglePasswordVisibility(uid)}
                              className="p-1.5 hover:bg-[#32070B] rounded-lg text-[#FFF7E8]/70 hover:text-[#F4B942]"
                              title={isVisible ? 'Hide Password' : 'Show Password'}
                            >
                              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleCopyPassword(uid, usr.plainPassword || '123456')}
                              className="p-1.5 hover:bg-[#32070B] rounded-lg text-[#FFF7E8]/70 hover:text-[#F4B942]"
                              title="Copy Password"
                            >
                              {copiedId === uid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#FFF7E8]/50 italic flex items-center gap-1">
                            <Lock className="w-3 h-3 text-red-400" />
                            <span>Protected (SuperAdmin Only)</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUserClick(usr)}
                          disabled={usr.role === 'SUPERADMIN' && !isSuperAdmin}
                          className="p-2 hover:bg-red-950/80 rounded-xl text-red-400 transition-colors disabled:opacity-40"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE ACCOUNT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#1F0407] border-2 border-[#D4A72C]/60 rounded-3xl p-6 text-[#FFF7E8] shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A72C] to-[#E87516] flex items-center justify-center text-[#1F0407]">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#F4B942]">Create New User Account</h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  {isAdmin
                    ? 'Admins can create Committee Member accounts.'
                    : 'SuperAdmins can create accounts across all roles.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-950 border border-red-500/50 rounded-xl text-xs text-red-200">
                  {formError}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-[#D4A72C]/70" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahil Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#D4A72C]/70" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. sahil@vighnaharta.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-[#D4A72C]/70" />
                  <input
                    type="tel"
                    placeholder="+91 **********"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>
              </div>

              {/* Select Role */}
              <div>
                <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                  Account Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                >
                  {isSuperAdmin && <option value="SUPERADMIN">SuperAdmin (Full Permissions)</option>}
                  {isSuperAdmin && <option value="ADMIN">Admin (Finance & CMS Permissions)</option>}
                  <option value="COMMITTEE_MEMBER">Committee Member (CMS Operations Only)</option>
                </select>
                {isAdmin && (
                  <span className="text-[10px] text-amber-400 mt-1 block">
                    * Admin role is authorized to create Committee Member accounts.
                  </span>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider">
                    Initial Password *
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
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3 text-[#D4A72C]/70" />
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] font-mono focus:outline-none focus:border-[#F4B942]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#32070B] border border-[#D4A72C]/30 rounded-xl text-[11px] text-[#FFF7E8]/80 space-y-1">
                <div className="font-bold text-[#F4B942]">First-Time Login Security Notice</div>
                <div>
                  This account will require password change upon 1st login. The user will be prompted to update this temporary password immediately after logging in.
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
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
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
