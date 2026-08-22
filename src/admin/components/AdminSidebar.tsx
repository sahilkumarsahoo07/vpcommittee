import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { publicAPI } from '../../services/api';
import {
  LayoutDashboard,
  DollarSign,
  Receipt,
  PieChart,
  FileSpreadsheet,
  Users,
  Calendar,
  Image,
  Bell,
  HeartHandshake,
  Mail,
  Settings,
  ShieldAlert,
  FileText,
  Lock,
  UserPlus,
} from 'lucide-react';

import { checkModuleAccess } from './PermissionGuard';

interface AdminSidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const role = user?.role || 'COMMITTEE_MEMBER';
  const isSuperAdmin = role === 'SUPERADMIN';
  const userPerms = user?.permissions || [];

  const [rolePermissions, setRolePermissions] = useState<{
    ADMIN: { FINANCE: boolean; CMS: boolean; SYSTEM: boolean };
    COMMITTEE_MEMBER: { FINANCE: boolean; CMS: boolean; SYSTEM: boolean };
    MEMBER: { FINANCE: boolean; CMS: boolean; SYSTEM: boolean };
  }>({
    ADMIN: { FINANCE: true, CMS: true, SYSTEM: false },
    COMMITTEE_MEMBER: { FINANCE: false, CMS: true, SYSTEM: false },
    MEMBER: { FINANCE: false, CMS: false, SYSTEM: false },
  });

  useEffect(() => {
    publicAPI
      .getSettings()
      .then((res) => {
        if (res?.success && res?.data?.rolePermissions) {
          setRolePermissions(res.data.rolePermissions);
        }
      })
      .catch(() => {});
  }, []);

  const currentRolePerms =
    rolePermissions[role as 'ADMIN' | 'COMMITTEE_MEMBER' | 'MEMBER'] || { FINANCE: false, CMS: false, SYSTEM: false };

  // Permission checks combining role matrix and granular permissions
  const canAccessDashboard = isSuperAdmin || role === 'ADMIN' || role === 'COMMITTEE_MEMBER' || checkModuleAccess(role, userPerms, 'DASHBOARD');
  const canAccessFinance = isSuperAdmin || currentRolePerms.FINANCE || checkModuleAccess(role, userPerms, 'FINANCE');
  const canAccessReports = isSuperAdmin || currentRolePerms.FINANCE || checkModuleAccess(role, userPerms, 'REPORTS');
  const canAccessCMSMembers = isSuperAdmin || currentRolePerms.CMS || checkModuleAccess(role, userPerms, 'CMS_MEMBERS');
  const canAccessCMSEvents = isSuperAdmin || currentRolePerms.CMS || checkModuleAccess(role, userPerms, 'CMS_EVENTS');
  const canAccessCMSGallery = isSuperAdmin || currentRolePerms.CMS || checkModuleAccess(role, userPerms, 'CMS_GALLERY');
  const canAccessCMSAnnouncements = isSuperAdmin || currentRolePerms.CMS || checkModuleAccess(role, userPerms, 'CMS_ANNOUNCEMENTS');
  const canAccessCMSVolunteers = isSuperAdmin || currentRolePerms.CMS || checkModuleAccess(role, userPerms, 'CMS_VOLUNTEERS');
  const canAccessCMSSubscribers = isSuperAdmin || (role === 'ADMIN' && currentRolePerms.CMS) || checkModuleAccess(role, userPerms, 'CMS_SUBSCRIBERS');
  const canAccessSystemSettings = isSuperAdmin || currentRolePerms.SYSTEM || checkModuleAccess(role, userPerms, 'SETTINGS');
  const canAccessUsers = isSuperAdmin || (role === 'ADMIN') || checkModuleAccess(role, userPerms, 'USERS');
  const canAccessAuditLogs = isSuperAdmin || checkModuleAccess(role, userPerms, 'AUDIT_LOGS');

  const navItems = [
    { label: 'Overview Dashboard', path: '/admin', icon: LayoutDashboard, category: 'MAIN', restricted: !canAccessDashboard },

    // FINANCE SECTION
    { label: 'Donation Management', path: '/admin/donations', icon: DollarSign, category: 'FINANCE', restricted: !canAccessFinance },
    { label: 'Expense Tracker & Budget', path: '/admin/expenses', icon: Receipt, category: 'FINANCE', restricted: !canAccessFinance },
    { label: 'Financial Reports', path: '/admin/reports', icon: FileSpreadsheet, category: 'FINANCE', restricted: !canAccessReports },

    // OPERATIONAL CONTENT CMS
    { label: 'Members & Leadership', path: '/admin/members', icon: Users, category: 'CMS', restricted: !canAccessCMSMembers },
    { label: 'Festival Schedule', path: '/admin/events', icon: Calendar, category: 'CMS', restricted: !canAccessCMSEvents },
    { label: 'Gallery & Media', path: '/admin/gallery', icon: Image, category: 'CMS', restricted: !canAccessCMSGallery },
    { label: 'Announcements', path: '/admin/announcements', icon: Bell, category: 'CMS', restricted: !canAccessCMSAnnouncements },
    { label: 'Volunteer Management', path: '/admin/volunteers', icon: HeartHandshake, category: 'CMS', restricted: !canAccessCMSVolunteers },
    { label: 'Newsletter Subscribers', path: '/admin/subscribers', icon: Mail, category: 'CMS', restricted: !canAccessCMSSubscribers },

    // SYSTEM & AUDIT
    { label: 'Account & Role Manager', path: '/admin/users', icon: UserPlus, category: 'SYSTEM', restricted: !canAccessUsers },
    { label: 'Export Center (PDF/Excel)', path: '/admin/exports', icon: FileText, category: 'SYSTEM', restricted: !canAccessReports },
    { label: 'Website CMS Settings', path: '/admin/settings', icon: Settings, category: 'SYSTEM', restricted: !canAccessSystemSettings },
    { label: 'Audit Security Logs', path: '/admin/audit', icon: ShieldAlert, category: 'SYSTEM', restricted: !canAccessAuditLogs },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-[#1F0407] text-[#FFF7E8] border-r-2 border-[#D4A72C]/40 z-40 transition-transform duration-300 flex flex-col justify-between flex-shrink-0 h-full overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="py-5 px-4 overflow-y-auto flex-1 space-y-6">
          
          {/* Logo Header */}
          <div className="flex items-center gap-3 px-2 pb-4 border-b border-[#D4A72C]/30">
            <img src="/assets/navlogo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow" />
            <div>
              <h2 className="font-cinzel font-black text-sm text-[#F4B942] tracking-wider uppercase">
                Vighnaharta
              </h2>
              <span className="text-[10px] text-[#FFF7E8]/70 font-semibold uppercase tracking-widest block">
                Management Portal
              </span>
            </div>
          </div>

          {/* Navigation Items grouped by Category */}
          {['MAIN', 'FINANCE', 'CMS', 'SYSTEM'].map((cat) => {
            const items = navItems.filter((i) => i.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat} className="space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E87516] px-2 mb-2">
                  {cat === 'MAIN' ? 'Core' : cat === 'FINANCE' ? 'Finance & Accounting' : cat === 'CMS' ? 'Operations & CMS' : 'System Security'}
                </div>

                {items.map((item) => {
                  const Icon = item.icon;

                  if (item.restricted) {
                    return (
                      <div
                        key={item.path}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#FFF7E8]/40 bg-[#240407]/50 border border-transparent cursor-not-allowed select-none"
                        title="Access Restricted for your Role"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span>{item.label}</span>
                        </div>
                        <Lock className="w-3 h-3 text-red-400" />
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/admin'}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/60 shadow-md translate-x-1'
                            : 'text-[#FFF7E8]/80 hover:bg-[#32070B] hover:text-[#F4B942] border border-transparent'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer Role Notice */}
        <div className="p-4 border-t border-[#D4A72C]/30 bg-[#170204] text-center">
          <div className="text-[10px] text-[#FFF7E8]/60 font-semibold uppercase tracking-wider">
            RBAC Enforced • Role: <span className="text-[#F4B942] font-black">{role}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
