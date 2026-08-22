import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminAuditLogsPage: React.FC = () => {
  const { user } = useAuth();

  if (user?.role !== 'SUPERADMIN') {
    return (
      <div className="bg-red-950 text-red-200 border-2 border-red-500 rounded-3xl p-8 text-center space-y-4">
        <Lock className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="font-cinzel text-xl font-black uppercase">Access Forbidden</h2>
        <p className="text-xs">Audit security logs are restricted exclusively to Superadmin accounts.</p>
      </div>
    );
  }

  const logs = [
    {
      id: '1',
      userName: 'Main SuperAdmin',
      role: 'SUPERADMIN',
      action: 'WEBSITE_SETTINGS_UPDATE',
      entity: 'WebsiteSettings',
      details: 'Updated festival countdown date to Sept 7, 2026',
      time: '2026-08-21 09:40 AM',
      ip: '127.0.0.1',
    },
    {
      id: '2',
      userName: 'Treasurer Admin',
      role: 'ADMIN',
      action: 'DONATION_RECORDED',
      entity: 'Donation',
      details: 'Recorded donation of Rs 25,000 (VPC-DON-2026-001)',
      time: '2026-08-21 08:15 AM',
      ip: '127.0.0.1',
    },
    {
      id: '3',
      userName: 'Treasurer Admin',
      role: 'ADMIN',
      action: 'EXPENSE_RECORDED',
      entity: 'Expense',
      details: 'Recorded expense of Rs 1,20,000 for Iron Pandal Structure',
      time: '2026-08-20 04:30 PM',
      ip: '127.0.0.1',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4A72C]/40 pb-3">
        <h2 className="font-cinzel text-lg sm:text-2xl font-black text-[#32070B] uppercase tracking-wider">
          Superadmin Security & Audit Trails
        </h2>
        <p className="text-[11px] sm:text-xs text-[#2A1710]/70 font-semibold">
          Immutable system log recording all admin logins, financial edits, expense approvals, and content modifications.
        </p>
      </div>

      <div className="bg-[#240407] border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 text-[#FFF7E8] space-y-3 sm:space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#D4A72C]/30 pb-2.5">
          <ShieldAlert className="w-4 h-4 text-[#F4B942]" />
          <h3 className="font-cinzel text-sm sm:text-base font-black text-[#F4B942] uppercase tracking-wider">
            Live System Activity Log
          </h3>
        </div>

        <div className="space-y-2.5">
          {logs.map((log) => (
            <div key={log.id} className="bg-[#170204] p-3 sm:p-4 rounded-2xl border border-[#D4A72C]/20 space-y-1">
              <div className="flex justify-between items-center text-[11px] sm:text-xs font-bold gap-2">
                <span className="text-[#F4B942] truncate">{log.action}</span>
                <span className="text-gray-400 text-[10px] shrink-0">{log.time}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#FFF7E8]/90 font-medium">{log.details}</p>
              <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1">
                <span className="truncate">By: {log.userName} ({log.role})</span>
                <span className="shrink-0">IP: {log.ip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
