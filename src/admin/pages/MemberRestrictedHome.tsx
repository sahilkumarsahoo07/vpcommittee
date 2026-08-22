import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const MemberRestrictedHome: React.FC = () => {
  const { user } = useAuth();

  const moduleList = [
    { name: 'Financial Management', desc: 'Donations, Expenses & Budget tracking', key: 'FINANCE' },
    { name: 'Financial Reports', desc: 'PDF & Excel export generation', key: 'REPORTS' },
    { name: 'Leadership CMS', desc: 'Executive Committee Directory', key: 'CMS_MEMBERS' },
    { name: 'Festival Schedule', desc: 'Rituals & Event timeline management', key: 'CMS_EVENTS' },
    { name: 'Gallery & Media', desc: 'Photo uploads & press highlights', key: 'CMS_GALLERY' },
    { name: 'Announcements', desc: 'Public website bulletins & notifications', key: 'CMS_ANNOUNCEMENTS' },
    { name: 'Volunteer Roster', desc: 'Volunteer applications & shifts', key: 'CMS_VOLUNTEERS' },
    { name: 'Website Settings', desc: 'Global committee info & banner content', key: 'SETTINGS' },
  ];

  const userPerms = user?.permissions || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#32070B] via-[#4A0A10] to-[#240407] rounded-3xl p-6 sm:p-8 text-[#FFF7E8] border-2 border-[#D4A72C]/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5A0F16] border border-[#F4B942]/60 text-[#F4B942] text-[11px] font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Member Portal • Role: {user?.role}</span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-[#F4B942] tracking-wider uppercase">
            Jai Ganesh, {user?.name || 'Member'}!
          </h1>

          <p className="text-xs sm:text-sm text-[#FFF7E8]/80 leading-relaxed font-semibold">
            Welcome to the Vighnaharta Puja Committee Portal. Your account is active in the system.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MEMBER PROFILE CARD */}
        <div className="bg-[#1F0407] border-2 border-[#D4A72C]/40 rounded-3xl p-6 text-[#FFF7E8] space-y-6 shadow-xl relative">
          <div className="flex items-center gap-2 text-[#F4B942] text-xs font-bold uppercase tracking-wider border-b border-[#D4A72C]/30 pb-3">
            <User className="w-4 h-4 text-[#F4B942]" />
            <span>Member Profile Details</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-[#F4B942] shadow-md shadow-[#D4A72C]/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#32070B] border-2 border-[#F4B942] flex items-center justify-center text-[#F4B942] text-3xl font-black font-cinzel shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || 'M'}
                </div>
              )}
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-[9px] font-black uppercase">
                Active
              </span>
            </div>

            <div>
              <h3 className="font-cinzel text-lg font-bold text-[#F4B942]">{user?.name}</h3>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase tracking-wider">
                Role: {user?.role || 'MEMBER'}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs bg-[#120204] border border-[#D4A72C]/20 p-4 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4A72C] shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-[#FFF7E8]/50 block uppercase">Email</span>
                <span className="font-semibold text-[#FFF7E8]/90">{user?.email}</span>
              </div>
            </div>

            {user?.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#FFF7E8]/50 block uppercase">Phone</span>
                  <span className="font-semibold text-[#FFF7E8]/90">{user.phone}</span>
                </div>
              </div>
            )}

            {user?.address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-[#FFF7E8]/50 block uppercase">Address</span>
                  <span className="font-semibold text-[#FFF7E8]/90">{user.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ACCESS PERMISSION STATUS */}
        <div className="lg:col-span-2 bg-[#1F0407] border-2 border-[#D4A72C]/40 rounded-3xl p-6 text-[#FFF7E8] space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#D4A72C]/30 pb-3">
            <div className="flex items-center gap-2 text-[#F4B942] text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-[#F4B942]" />
              <span>Permission Status & Module Access</span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-black uppercase">
              {userPerms.length} Granted
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#120204] border border-[#D4A72C]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Zero Default Permissions Policy</span>
            </div>
            <p className="text-xs text-[#FFF7E8]/75 leading-relaxed">
              In accordance with Committee Security Policies, Member accounts are created with zero permissions by default. When the <b>Super Admin</b> grants you specific module access, the permitted tools and forms will automatically unlock in your portal.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#F4B942]">
              System Module Authorization Overview:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {moduleList.map((mod) => {
                const isGranted = userPerms.includes('ALL') || userPerms.includes(mod.key);

                return (
                  <div
                    key={mod.key}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                      isGranted
                        ? 'bg-[#15341E] border-emerald-500/50 text-emerald-200'
                        : 'bg-[#120204] border-[#D4A72C]/20 text-[#FFF7E8]/60'
                    }`}
                  >
                    <div>
                      <div className={`font-bold text-xs ${isGranted ? 'text-emerald-300' : 'text-[#FFF7E8]/80'}`}>
                        {mod.name}
                      </div>
                      <div className="text-[10px] opacity-70">{mod.desc}</div>
                    </div>

                    {isGranted ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        <CheckCircle className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-[#240407] px-2 py-0.5 rounded-full border border-gray-700">
                        <Lock className="w-3 h-3 text-red-400" />
                        <span>Restricted</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
