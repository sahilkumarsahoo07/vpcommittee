import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Lock, ArrowLeft, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PermissionGuardProps {
  module:
    | 'DASHBOARD'
    | 'FINANCE'
    | 'REPORTS'
    | 'CMS_MEMBERS'
    | 'CMS_EVENTS'
    | 'CMS_GALLERY'
    | 'CMS_ANNOUNCEMENTS'
    | 'CMS_VOLUNTEERS'
    | 'CMS_SUBSCRIBERS'
    | 'USERS'
    | 'SETTINGS'
    | 'AUDIT_LOGS';
  moduleTitle?: string;
  children: React.ReactNode;
}

export const checkModuleAccess = (
  role: string | undefined,
  permissions: string[] | undefined,
  module: string
): boolean => {
  if (!role) return false;

  // 1. SuperAdmin has unrestricted access to all modules
  if (role === 'SUPERADMIN') return true;

  const userPerms = permissions || [];

  // If user has specific permission tag or 'ALL'
  if (userPerms.includes('ALL') || userPerms.includes(module)) {
    return true;
  }

  // Broad category grants
  if (module.startsWith('CMS_') && userPerms.includes('CMS')) return true;
  if (module === 'FINANCE' && userPerms.includes('FINANCE')) return true;
  if (module === 'REPORTS' && (userPerms.includes('REPORTS') || userPerms.includes('FINANCE'))) return true;

  // 2. Admin role standard defaults
  if (role === 'ADMIN') {
    if (module === 'AUDIT_LOGS') return false; // SuperAdmin only
    return true; // Admin has Dashboard, Finance, CMS, Users, Settings, Reports
  }

  // 3. Committee Member role standard defaults (100% existing behavior)
  if (role === 'COMMITTEE_MEMBER') {
    if (module === 'DASHBOARD') return true;
    if (
      module === 'CMS_MEMBERS' ||
      module === 'CMS_EVENTS' ||
      module === 'CMS_GALLERY' ||
      module === 'CMS_ANNOUNCEMENTS' ||
      module === 'CMS_VOLUNTEERS' ||
      module === 'CMS_SUBSCRIBERS'
    ) {
      return true;
    }
    return false;
  }

  // 4. Member role: strictly requires explicit permissions granted
  if (role === 'MEMBER') {
    return false;
  }

  return false;
};

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  module,
  moduleTitle,
  children,
}) => {
  const { user } = useAuth();
  const hasAccess = checkModuleAccess(user?.role, user?.permissions, module);

  if (hasAccess) {
    return <>{children}</>;
  }

  const getModuleLabel = (mod: string) => {
    switch (mod) {
      case 'DASHBOARD':
        return 'Overview Dashboard';
      case 'FINANCE':
        return 'Finance, Donations & Expenses';
      case 'REPORTS':
        return 'Financial Reports & Exports';
      case 'CMS_MEMBERS':
        return 'Committee Executive Leadership';
      case 'CMS_EVENTS':
        return 'Festival Schedule & Events';
      case 'CMS_GALLERY':
        return 'Gallery & Media Management';
      case 'CMS_ANNOUNCEMENTS':
        return 'Announcements Management';
      case 'CMS_VOLUNTEERS':
        return 'Volunteer Roster & Applications';
      case 'CMS_SUBSCRIBERS':
        return 'Newsletter Subscribers';
      case 'USERS':
        return 'User & Account Management';
      case 'SETTINGS':
        return 'Website CMS Settings';
      case 'AUDIT_LOGS':
        return 'Audit Security Logs';
      default:
        return mod;
    }
  };

  const displayName = moduleTitle || getModuleLabel(module);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-[#1F0407] border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 text-[#FFF7E8] text-center space-y-6 shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border-2 border-red-500/60 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-500/20">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/40">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>403 • Access Restricted</span>
          </div>

          <h2 className="font-cinzel text-xl sm:text-2xl font-black text-[#F4B942] tracking-wide">
            {displayName}
          </h2>

          <p className="text-xs text-[#FFF7E8]/75 leading-relaxed">
            Your account ({user?.name || user?.email || 'User'}) with role{' '}
            <span className="font-bold text-amber-400">[{user?.role || 'MEMBER'}]</span> does not currently have permission to access the{' '}
            <span className="font-bold text-[#F4B942]">{displayName}</span> module.
          </p>
        </div>

        <div className="p-4 bg-[#120204] border border-[#D4A72C]/20 rounded-2xl text-left space-y-2 text-xs">
          <div className="font-bold text-[#F4B942] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <Key className="w-3.5 h-3.5" />
            <span>Role-Based Access Control Policy</span>
          </div>
          <p className="text-[11px] text-[#FFF7E8]/60 leading-normal">
            New Member accounts start with zero default permissions for security. If you require access to this specific module, please request permission assignment from a <b>Super Admin</b>.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/admin"
            className="px-5 py-2.5 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-[#F4B942] font-bold text-xs rounded-xl transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Portal Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
