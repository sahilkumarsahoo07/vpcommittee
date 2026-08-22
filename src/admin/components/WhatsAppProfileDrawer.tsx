import React, { useState } from 'react';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Shield,
  Key,
  Copy,
  Check,
  Edit3,
  Calendar,
  Lock,
  MessageCircle,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface WhatsAppProfileDrawerProps {
  user: {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (updatedUser: any) => void;
  onOpenManagePermissions?: (user: any) => void;
}

export const WhatsAppProfileDrawer: React.FC<WhatsAppProfileDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdated,
  onOpenManagePermissions,
}) => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'SUPERADMIN';
  const isAdmin = currentUser?.role === 'ADMIN';

  const targetId = user ? user.id || user._id! : '';
  const currentUserId = currentUser?.id || (currentUser as any)?._id;
  const isSelf = currentUserId === targetId || currentUser?.email?.toLowerCase() === user?.email?.toLowerCase();

  // Can the logged-in user edit this account?
  // 1. SuperAdmin can edit anyone (except changing own role/status)
  // 2. Admin can edit Committee Member and Member, and their own personal profile
  const canEdit =
    isSuperAdmin ||
    (isAdmin && (isSelf || user?.role === 'COMMITTEE_MEMBER' || user?.role === 'MEMBER'));

  const [isEditing, setIsEditing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePhoto: '',
    role: 'MEMBER' as UserRole,
    password: '',
    isActive: true,
  });

  // Sync state when user changes
  React.useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        profilePhoto: user.profilePhoto || '',
        role: user.role,
        password: '',
        isActive: user.isActive ?? true,
      });
      setIsEditing(false);
      setFeedback(null);
      setShowPassword(false);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '');
  const perms = user.permissions || [];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const payload: any = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        profilePhoto: editForm.profilePhoto.trim(),
        isActive: editForm.isActive,
      };

      if (isSuperAdmin && editForm.role !== user.role) {
        payload.role = editForm.role;
      }

      if (editForm.password && editForm.password.length >= 6) {
        payload.password = editForm.password;
      }

      const res = await userAPI.updateUser(targetId, payload);
      if (res.success) {
        const updated = {
          ...user,
          ...payload,
          plainPassword: editForm.password ? editForm.password : user.plainPassword,
        };
        onUserUpdated(updated);
        setFeedback({ type: 'success', text: 'Profile details updated successfully!' });
        setIsEditing(false);
      } else {
        setFeedback({ type: 'error', text: res.message || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Error updating account details.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadgeStyle = (roleStr: string) => {
    switch (roleStr) {
      case 'SUPERADMIN':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'ADMIN':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'COMMITTEE_MEMBER':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'MEMBER':
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* WhatsApp Style Slide-out Drawer */}
      <div className="w-full sm:max-w-md h-full sm:h-[94vh] bg-[#170204] border-l-2 sm:border-2 border-[#D4A72C]/60 sm:rounded-3xl text-[#FFF7E8] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* TOP BAR */}
        <div className="bg-[#240407] border-b border-[#D4A72C]/30 px-4 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#32070B] rounded-full text-[#FFF7E8]/80 hover:text-[#F4B942] transition-colors"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="font-cinzel text-sm font-bold text-[#F4B942] tracking-wider uppercase">
              {isEditing ? 'Edit Contact Info' : 'Contact Information'}
            </span>
          </div>

          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-[#F4B942] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {/* FEEDBACK BANNER */}
        {feedback && (
          <div
            className={`p-3 text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-[#15341E] text-emerald-300 border-b border-emerald-500/40'
                : 'bg-red-950 text-red-300 border-b border-red-500/40'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* VIEW MODE */}
          {!isEditing ? (
            <>
              {/* HERO PROFILE PICTURE & NAME */}
              <div className="flex flex-col items-center text-center space-y-3 bg-[#1F0407] border border-[#D4A72C]/30 p-5 rounded-3xl relative overflow-hidden shadow-md">
                <div className="relative group">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-28 h-28 rounded-full object-cover border-4 border-[#F4B942] shadow-xl shadow-[#D4A72C]/20"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-[#32070B] border-4 border-[#F4B942] flex items-center justify-center text-[#F4B942] text-4xl font-black font-cinzel shadow-xl">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}

                  {/* Status badge */}
                  <span
                    className={`absolute bottom-1 right-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border shadow-md ${
                      user.isActive
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                        : 'bg-red-950 text-red-300 border-red-500/60'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Suspended'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="font-cinzel text-xl font-black text-[#F4B942] tracking-wide">
                    {user.name}
                  </h2>
                  <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getRoleBadgeStyle(user.role)}`}>
                    Role: {user.role}
                  </span>
                </div>
              </div>

              {/* QUICK ACTION BUTTONS (WhatsApp Style) */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {/* WhatsApp button */}
                <a
                  href={cleanPhone ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}` : '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all shadow-sm ${
                    cleanPhone
                      ? 'bg-[#15341E] hover:bg-[#1C4528] border-[#4ADE80]/40 text-[#4ADE80]'
                      : 'bg-[#1F0407] border-[#D4A72C]/20 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-[11px] font-bold">WhatsApp</span>
                </a>

                {/* Call button */}
                <a
                  href={user.phone ? `tel:${user.phone}` : '#'}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all shadow-sm ${
                    user.phone
                      ? 'bg-[#32070B] hover:bg-[#5A0F16] border-[#D4A72C]/40 text-[#F4B942]'
                      : 'bg-[#1F0407] border-[#D4A72C]/20 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-[11px] font-bold">Call</span>
                </a>

                {/* Email button */}
                <a
                  href={`mailto:${user.email}`}
                  className="p-3 rounded-2xl bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-[#F4B942] flex flex-col items-center gap-1.5 transition-all shadow-sm"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-[11px] font-bold">Email</span>
                </a>
              </div>

              {/* CONTACT DETAILS CARDS */}
              <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-4 rounded-3xl space-y-3.5 text-xs">
                {/* Phone */}
                <div className="flex items-center justify-between py-1 border-b border-[#D4A72C]/20">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#FFF7E8]/50 block uppercase">Phone Number</span>
                      <span className="font-semibold text-[#FFF7E8]">{user.phone || 'Not specified'}</span>
                    </div>
                  </div>
                  {user.phone && (
                    <button
                      onClick={() => handleCopy(user.phone!, 'phone')}
                      className="p-1.5 hover:bg-[#32070B] rounded-lg text-[#FFF7E8]/60 hover:text-[#F4B942]"
                      title="Copy Phone"
                    >
                      {copiedField === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-1 border-b border-[#D4A72C]/20">
                  <div className="flex items-center gap-3 truncate pr-2">
                    <Mail className="w-4 h-4 text-[#D4A72C] shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-[#FFF7E8]/50 block uppercase">Email Address</span>
                      <span className="font-semibold text-[#FFF7E8] truncate block">{user.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(user.email, 'email')}
                    className="p-1.5 hover:bg-[#32070B] rounded-lg text-[#FFF7E8]/60 hover:text-[#F4B942]"
                    title="Copy Email"
                  >
                    {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 py-1 border-b border-[#D4A72C]/20">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#FFF7E8]/50 block uppercase">Address</span>
                    <span className="font-semibold text-[#FFF7E8]">{user.address || 'Not specified'}</span>
                  </div>
                </div>

                {/* Joined Date */}
                {user.createdAt && (
                  <div className="flex items-center gap-3 py-1">
                    <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#FFF7E8]/50 block uppercase">Joined Committee</span>
                      <span className="font-semibold text-[#FFF7E8]/90">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* PERMISSIONS & ACCESS OVERVIEW */}
              <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-4 rounded-3xl space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#D4A72C]/20 pb-2">
                  <div className="font-bold text-[#F4B942] uppercase text-[11px] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Module Permissions ({perms.length} Granted)</span>
                  </div>

                  {isSuperAdmin && onOpenManagePermissions && (
                    <button
                      onClick={() => onOpenManagePermissions(user)}
                      className="text-[10px] text-[#F4B942] font-bold hover:underline"
                    >
                      Manage Matrix →
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {user.role === 'SUPERADMIN' ? (
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-[10px] font-bold border border-amber-500/40">
                      ⭐ Full Access (All 12 Modules)
                    </span>
                  ) : perms.length === 0 ? (
                    <span className="px-2.5 py-1 bg-[#120204] text-[#FFF7E8]/60 rounded-lg text-[10px] font-semibold border border-[#D4A72C]/20 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-red-400" />
                      <span>Zero Permissions Assigned (Default)</span>
                    </span>
                  ) : (
                    perms.map((p) => (
                      <span
                        key={p}
                        className="px-2.5 py-1 bg-[#15341E] text-emerald-300 rounded-lg text-[10px] font-bold border border-emerald-500/40"
                      >
                        ✓ {p}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* SUPERADMIN PASSWORD SECURITY VIEW */}
              {isSuperAdmin && (
                <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-4 rounded-3xl space-y-2 text-xs">
                  <div className="font-bold text-[#F4B942] uppercase text-[11px] flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    <span>Password Security (SuperAdmin View)</span>
                  </div>

                  <div className="flex items-center justify-between bg-[#120204] border border-[#D4A72C]/20 p-2.5 rounded-xl">
                    <span className="font-mono text-sm text-[#F4B942]">
                      {showPassword ? user.plainPassword || 'No password set' : '••••••••••••'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 hover:bg-[#32070B] rounded-lg text-[#FFF7E8]/70 hover:text-[#F4B942]"
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      {user.plainPassword && (
                        <button
                          onClick={() => handleCopy(user.plainPassword!, 'password')}
                          className="p-1.5 hover:bg-[#32070B] rounded-lg text-[#FFF7E8]/70 hover:text-[#F4B942]"
                          title="Copy Password"
                        >
                          {copiedField === 'password' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="text-xs font-bold text-[#F4B942] uppercase tracking-wider border-b border-[#D4A72C]/20 pb-2 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4" />
                <span>Update Account Information</span>
              </div>

              {/* Direct Profile Photo Upload */}
              <ProfilePhotoUploader
                value={editForm.profilePhoto}
                onChange={(newPhoto) => setEditForm({ ...editForm, profilePhoto: newPhoto })}
                userName={editForm.name}
                label="Profile Picture (Gallery / Camera)"
              />

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Kamakhyanagar, Dhenkanal, Odisha"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              {/* Role Switcher */}
              {isSelf ? (
                <div className="p-3 bg-[#120204] border border-[#D4A72C]/20 rounded-xl text-xs flex items-center justify-between">
                  <span className="font-semibold text-[#FFF7E8]/70">Account Role</span>
                  <span className="text-[11px] font-bold text-[#F4B942] bg-[#32070B] px-2.5 py-1 rounded-lg border border-[#D4A72C]/30">
                    🔒 {user.role} (Cannot modify own role)
                  </span>
                </div>
              ) : isSuperAdmin ? (
                <div>
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                    Change Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] font-bold focus:outline-none focus:border-[#F4B942]"
                  >
                    <option value="SUPERADMIN">SuperAdmin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="COMMITTEE_MEMBER">Committee Member</option>
                    <option value="MEMBER">Member</option>
                  </select>
                </div>
              ) : isAdmin ? (
                <div>
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                    Assign Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] font-bold focus:outline-none focus:border-[#F4B942]"
                  >
                    <option value="COMMITTEE_MEMBER">Committee Member</option>
                    <option value="MEMBER">Member</option>
                  </select>
                </div>
              ) : null}

              {/* Reset/Set Login Password */}
              <div>
                <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                  {user.role === 'MEMBER' && editForm.role !== 'MEMBER'
                    ? 'Assign Login Password *'
                    : isSelf
                    ? 'Change My Password (Optional)'
                    : 'Change / Reset Password (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="Enter new password (min 6 chars)"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] font-mono focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              {/* Status Toggle (Cannot deactivate own account) */}
              {!isSelf ? (
                <div className="flex items-center justify-between p-3 bg-[#120204] border border-[#D4A72C]/20 rounded-xl text-xs">
                  <span className="font-semibold text-[#FFF7E8]">Account Status</span>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                    className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase transition-all ${
                      editForm.isActive
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-950 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {editForm.isActive ? 'Active' : 'Suspended'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-[#120204] border border-[#D4A72C]/20 rounded-xl text-xs">
                  <span className="font-semibold text-[#FFF7E8]/70">Account Status</span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    Active (Current Session)
                  </span>
                </div>
              )}

              {/* Edit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/30 text-xs font-semibold text-[#FFF7E8]/80 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-[#1F0407] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
