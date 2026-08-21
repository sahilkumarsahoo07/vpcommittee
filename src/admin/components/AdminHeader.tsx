import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ExternalLink, User } from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const getRoleBadgeStyle = () => {
    switch (user?.role) {
      case 'SUPERADMIN':
        return 'bg-[#5A0F16] text-[#F4B942] border-[#F4B942]';
      case 'ADMIN':
        return 'bg-[#E87516] text-white border-[#D4A72C]';
      default:
        return 'bg-[#2A1710] text-[#FFF7E8] border-[#D4A72C]/40';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex-shrink-0 bg-[#32070B] text-[#FFF7E8] border-b-2 border-[#D4A72C]/40 py-3.5 px-4 sm:px-6 flex items-center justify-between shadow-md">
      
      {/* Left Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-[#240407] border border-[#D4A72C]/40 text-[#F4B942]"
        >
          ☰
        </button>
        <div>
          <h1 className="font-cinzel text-lg sm:text-xl font-black text-[#F4B942] tracking-wider uppercase">
            Vighnaharta Portal
          </h1>
          <p className="text-[11px] text-[#FFF7E8]/70 font-semibold uppercase tracking-widest hidden sm:block">
            Ganesh Utsav 2026 Admin Suite
          </p>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Public Website Preview Link */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#240407] hover:bg-[#5A0F16] border border-[#D4A72C]/50 text-[#F4B942] text-xs font-bold transition-all shadow-sm"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* User Badge */}
        <div className="flex items-center gap-2 bg-[#240407] border border-[#D4A72C]/40 rounded-xl px-3 py-1.5">
          <div className="w-8 h-8 rounded-full bg-[#5A0F16] border border-[#F4B942] flex items-center justify-center text-[#F4B942]">
            <User className="w-4 h-4" />
          </div>

          <div className="text-left hidden md:block">
            <div className="text-xs font-black text-[#FFF7E8]">{user?.name || 'Administrator'}</div>
            <div className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${getRoleBadgeStyle()}`}>
              {user?.role || 'ADMIN'}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-2 rounded-xl bg-[#5A0F16] hover:bg-red-700 text-[#FFF7E8] border border-red-500/50 transition-colors shadow-sm"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>

      </div>
    </header>
  );
};
