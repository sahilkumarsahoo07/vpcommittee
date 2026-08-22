import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, KeyRound, User, Eye, EyeOff, HelpCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../../services/api';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await authAPI.login(email, password);
      if (result.success && result.data) {
        const { token: userToken, user: loggedUser } = result.data;
        login(
          loggedUser.email,
          loggedUser.role,
          userToken,
          loggedUser.name,
          loggedUser.mustChangePassword ?? false,
          loggedUser.id,
          loggedUser.phone,
          loggedUser.address,
          loggedUser.profilePhoto,
          loggedUser.permissions
        );
        navigate('/admin');
      } else {
        setErrorMsg(result.message || 'Authentication failed');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Step 1: Request Code
  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!forgotEmail) {
      setForgotError('Please enter your account email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await authAPI.forgotPassword(forgotEmail);
      if (res.success) {
        setGeneratedCode(res.resetCode || '123456');
        setForgotStep(2);
        setForgotSuccess(res.message);
      } else {
        setForgotError(res.message || 'Failed to request reset code.');
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || 'Error sending reset request.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot Password Step 2: Reset Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!resetCode) {
      setForgotError('Please enter the 6-digit security reset code.');
      return;
    }

    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('New password and confirm password do not match.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await authAPI.resetPassword(forgotEmail, resetCode, newPassword);
      if (res.success) {
        setForgotSuccess('Password reset successfully! You can now log in.');
        setEmail(forgotEmail);
        setPassword(newPassword);
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep(1);
          setGeneratedCode(null);
        }, 1500);
      } else {
        setForgotError(res.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || 'Error resetting password.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1C0407] via-[#2A060A] to-[#120204] text-[#FFF7E8] flex items-center justify-center p-4">
      {/* Golden Lotus Background Watermark */}
      <img
        src="/assets/3rdbgimage.png"
        alt="Lotus Watermark"
        className="absolute left-0 bottom-0 w-80 sm:w-[500px] pointer-events-none opacity-20 object-contain"
      />
      <img
        src="/assets/3rdbgimage.png"
        alt="Lotus Watermark"
        className="absolute right-0 top-0 w-80 sm:w-[500px] pointer-events-none opacity-20 object-contain scale-x-[-1] scale-y-[-1]"
      />

      <div className="w-full max-w-md bg-[#250508] border-2 border-[#D4A72C]/50 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#3D0A11] border-2 border-[#F4B942] flex items-center justify-center mx-auto text-[#F4B942] shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-cinzel text-2xl font-black text-[#F4B942] uppercase tracking-wider">
            Vighnaharta Portal
          </h2>
          <p className="text-xs text-[#FFF7E8]/70 font-semibold uppercase tracking-widest">
            Secure Committee Admin Authentication
          </p>
        </div>



        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-500 text-red-200 text-xs font-bold rounded-xl text-center shadow">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-[#FFF7E8]/80 uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                placeholder="Enter your email address"
                className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-[#FFF7E8] focus:border-[#F4B942] focus:outline-none"
              />
              <User className="w-4 h-4 text-[#D4A72C] absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#FFF7E8]/80 uppercase tracking-wider block">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotStep(1);
                  setForgotError(null);
                  setForgotSuccess(null);
                  setShowForgotModal(true);
                }}
                className="text-[11px] text-[#F4B942] hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Enter your password"
                className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-[#FFF7E8] focus:border-[#F4B942] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#D4A72C] hover:text-[#F4B942] transition-colors p-0.5"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] font-black uppercase text-xs tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-6"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-[#F4B942] hover:underline font-semibold">
            ← Return to Public Website
          </a>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#1F0407] border-2 border-[#D4A72C]/60 rounded-3xl p-6 sm:p-8 text-[#FFF7E8] shadow-2xl relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#5A0F16] border border-[#D4A72C]/50 flex items-center justify-center text-[#F4B942]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#F4B942]">Reset Account Password</h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  {forgotStep === 1 ? 'Step 1: Enter registered account email' : 'Step 2: Enter security reset code & new password'}
                </p>
              </div>
            </div>

            {forgotError && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 mb-4">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestResetCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1.5">
                    Account Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sksahoo.dev@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="text-xs text-[#FFF7E8]/70 hover:text-[#FFF7E8] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </button>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] font-bold text-xs rounded-xl shadow-lg hover:brightness-110 flex items-center gap-2"
                  >
                    {forgotLoading ? 'Generating...' : 'Get Security Reset Code'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                {generatedCode && (
                  <div className="p-3 bg-[#32070B] border border-[#D4A72C]/50 rounded-xl text-xs text-[#F4B942] space-y-1">
                    <div className="font-bold">Security Code Generated!</div>
                    <div className="text-[11px] text-[#FFF7E8]/80">
                      Use Security Reset Code: <strong className="font-mono text-[#F4B942] text-sm">{generatedCode}</strong>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                    6-Digit Security Reset Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter security code (e.g. 123456)"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full px-4 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] font-mono focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4B942] uppercase tracking-wider mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-xs text-[#FFF7E8]/70 hover:text-[#FFF7E8] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] font-bold text-xs rounded-xl shadow-lg hover:brightness-110 flex items-center gap-2"
                  >
                    {forgotLoading ? 'Resetting...' : 'Reset Password & Login'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
