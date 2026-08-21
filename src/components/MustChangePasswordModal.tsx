import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { ShieldAlert, Lock, Eye, EyeOff, CheckCircle2, KeyRound } from 'lucide-react';

export const MustChangePasswordModal: React.FC = () => {
  const { user, clearMustChangePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user || !user.mustChangePassword) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.changePassword(currentPassword, newPassword);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          clearMustChangePassword();
        }, 1200);
      } else {
        setError(res.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#1F0407] border-2 border-[#D4A72C]/60 rounded-3xl p-6 sm:p-8 text-[#FFF7E8] shadow-2xl shadow-[#D4A72C]/20 relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4A72C]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4A72C] to-[#E87516] flex items-center justify-center shadow-lg shadow-[#D4A72C]/30 text-[#1F0407]">
            <KeyRound className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E87516]/20 border border-[#E87516]/40 text-[#F4B942] text-[11px] font-bold tracking-wider uppercase mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>First-Time Security Action</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F4B942]">
              Change Your Password
            </h2>
            <p className="text-xs text-[#FFF7E8]/70 mt-1">
              Welcome, <strong className="text-[#FFF7E8]">{user.name}</strong>! As this is your first time logging in, please set a new secure password to activate your account access.
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3 bg-[#5A0F16]/40 border border-[#4ADE80]/40 rounded-2xl p-4">
            <CheckCircle2 className="w-12 h-12 text-[#4ADE80] animate-bounce" />
            <h3 className="text-lg font-bold text-[#4ADE80]">Password Updated Successfully!</h3>
            <p className="text-xs text-[#FFF7E8]/80">Redirecting to your management portal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1.5">
                Current / Temporary Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4A72C]/70" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  placeholder="Enter initial assigned password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942] focus:ring-1 focus:ring-[#F4B942]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-3 text-[#FFF7E8]/50 hover:text-[#F4B942]"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4A72C]/70" />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942] focus:ring-1 focus:ring-[#F4B942]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-3 text-[#FFF7E8]/50 hover:text-[#F4B942]"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4A72C]/70" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942] focus:ring-1 focus:ring-[#F4B942]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-3 text-[#FFF7E8]/50 hover:text-[#F4B942]"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-[#D4A72C] to-[#E87516] hover:from-[#F4B942] hover:to-[#E87516] text-[#1F0407] font-bold text-sm rounded-xl shadow-lg shadow-[#D4A72C]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#1F0407] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Update Password & Continue</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
