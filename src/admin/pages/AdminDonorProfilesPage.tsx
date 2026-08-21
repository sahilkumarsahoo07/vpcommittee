import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  UserPlus,
  Search,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Phone,
  Target,
  CheckCircle,
  AlertCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

interface MemberProfile {
  id: string;
  name: string;
  role: string;
  category: string;
  phone?: string;
  targetAmount?: number;
  paidAmount?: number;
  bio?: string;
  image?: string;
}

export const AdminDonorProfilesPage: React.FC = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Donor Profile Modal State (Create / Edit)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<MemberProfile | null>(null);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileTarget, setProfileTarget] = useState('');

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState<MemberProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load profiles from backend API
  const loadProfiles = async () => {
    setLoading(true);
    try {
      const [membersRes, donationsRes] = await Promise.all([
        adminAPI.getMembers().catch(() => null),
        adminAPI.getDonations().catch(() => null),
      ]);

      const membersList = membersRes?.success && Array.isArray(membersRes.data) ? membersRes.data : [];
      const donationsList = donationsRes?.success && Array.isArray(donationsRes.data) ? donationsRes.data : [];

      // Compute total paid per member
      const paidMap: Record<string, number> = {};
      donationsList.forEach((d: any) => {
        const name = (d.donorName || d.name || '').trim();
        if (name) {
          paidMap[name] = (paidMap[name] || 0) + (Number(d.amount) || 0);
        }
      });

      const mapped: MemberProfile[] = membersList.map((m: any) => {
        const mName = m.name || m.title || 'Anonymous Donor';
        return {
          id: m._id || m.id,
          name: mName,
          role: m.role || 'Contributor',
          category: m.category || 'Executive',
          phone: m.phone || '+91 98765 43210',
          targetAmount: Number(m.targetAmount) || 25000,
          paidAmount: paidMap[mName] || 0,
          bio: m.bio || 'Record-keeping donor profile',
          image: m.image,
        };
      });

      setProfiles(mapped);
    } catch (err) {
      console.error('Failed to load donor profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone && p.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Open Create Profile Modal
  const handleOpenAdd = () => {
    setEditingProfile(null);
    setProfileName('');
    setProfilePhone('');
    setProfileTarget('25000');
    setShowProfileModal(true);
  };

  // Open Edit Profile Modal
  const handleOpenEdit = (profile: MemberProfile) => {
    setEditingProfile(profile);
    setProfileName(profile.name);
    setProfilePhone(profile.phone || '');
    setProfileTarget(String(profile.targetAmount || 25000));
    setShowProfileModal(true);
  };

  // Save Donor Profile (POST / PUT REST API)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    try {
      const payload = {
        name: profileName.trim(),
        role: editingProfile ? editingProfile.role : 'Contributor / Donor',
        category: editingProfile ? editingProfile.category : 'Executive',
        phone: profilePhone.trim() || '+91 98765 43210',
        targetAmount: Number(profileTarget) || 25000,
        bio: `${profileName.trim()} record-keeping profile for treasury ledger tracking`,
      };

      if (editingProfile) {
        await adminAPI.updateMember(editingProfile.id, payload);
      } else {
        await adminAPI.createMember(payload);
      }

      setShowProfileModal(false);
      await loadProfiles();
    } catch (err) {
      console.error('Failed to save donor profile:', err);
      alert('Error saving donor profile. Please try again.');
    }
  };

  // Delete Donor Profile (DELETE REST API)
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminAPI.deleteMember(deleteTarget.id);
      setDeleteTarget(null);
      await loadProfiles();
    } catch (err) {
      console.error('Failed to delete donor profile:', err);
      alert('Error deleting donor profile.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadSingleDonorPDF = async (donorName: string) => {
    try {
      await adminAPI.exportDonorPDF(donorName);
    } catch {
      alert(`Failed to download PDF for ${donorName}`);
    }
  };

  // Shortcut to record money for selected profile
  const handleRecordMoneyFor = (profile: MemberProfile) => {
    navigate('/admin/donations', {
      state: { prefillDonorName: profile.name, prefillPhone: profile.phone },
    });
  };

  // Metrics
  const totalProfilesCount = profiles.length;
  const totalTargetAmount = profiles.reduce((sum, p) => sum + (p.targetAmount || 0), 0);
  const totalCollectedAmount = profiles.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  const totalOutstandingDue = Math.max(0, totalTargetAmount - totalCollectedAmount);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#240407] border-2 border-[#D4A72C] rounded-3xl p-6 shadow-xl text-[#FFF7E8] relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 bg-[#F4B942]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F4B942]/20 text-[#F4B942] border border-[#F4B942]/40 text-[10px] font-black uppercase tracking-wider">
                Full REST API Directory (GET, POST, PUT, DELETE)
              </span>
            </div>
            <h1 className="font-cinzel text-2xl md:text-3xl font-black text-[#F4B942] uppercase tracking-wider flex items-center gap-2">
              <UserPlus className="w-7 h-7 text-[#F4B942]" />
              <span>Committee Member & Contributor Profiles</span>
            </h1>
            <p className="text-xs text-[#FFF7E8]/80 max-w-2xl mt-1">
              Directory of committee members, executive office bearers, and key contributors to track pledged contribution targets and donation receipts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/admin/donations')}
              className="px-4 py-2.5 rounded-2xl bg-[#170204] border border-[#D4A72C]/40 text-[#FFF7E8] text-xs font-bold uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-2 shadow"
            >
              <DollarSign className="w-4 h-4 text-[#F4B942]" />
              <span>Go to Donations Register</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-2xl bg-[#F4B942] text-[#32070B] font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add New Donor Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#240407] border-2 border-[#D4A72C]/40 rounded-3xl p-5 text-[#FFF7E8] shadow-md">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F4B942] block mb-1">
            Total Donor Profiles
          </span>
          <div className="font-cinzel text-3xl font-black text-white flex items-center gap-2">
            <User className="w-6 h-6 text-[#F4B942]" />
            <span>{totalProfilesCount} Donors</span>
          </div>
        </div>

        <div className="bg-[#240407] border-2 border-[#D4A72C]/40 rounded-3xl p-5 text-[#FFF7E8] shadow-md">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block mb-1">
            Total Pledged Target
          </span>
          <div className="font-cinzel text-3xl font-black text-amber-300">
            ₹{totalTargetAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-[#240407] border-2 border-[#D4A72C]/40 rounded-3xl p-5 text-[#FFF7E8] shadow-md">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block mb-1">
            Total Money Collected
          </span>
          <div className="font-cinzel text-3xl font-black text-emerald-400">
            ₹{totalCollectedAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-[#240407] border-2 border-[#D4A72C]/40 rounded-3xl p-5 text-[#FFF7E8] shadow-md">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-300 block mb-1">
            Remaining Pledged Due
          </span>
          <div className="font-cinzel text-3xl font-black text-rose-300">
            ₹{totalOutstandingDue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2A1710]/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search donor profiles by name or phone..."
            className="w-full bg-[#FFF7E8] border border-[#D4A72C]/60 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#32070B] placeholder-[#2A1710]/50 focus:outline-none focus:border-[#5A0F16]"
          />
        </div>

        <div className="text-xs font-bold text-[#5A0F16]">
          Showing <span className="text-[#E87516]">{filteredProfiles.length}</span> of {totalProfilesCount} Profiles
        </div>
      </div>

      {/* DONOR PROFILES GRID */}
      {loading ? (
        <div className="bg-[#240407] border-2 border-[#D4A72C]/30 rounded-3xl p-12 text-center text-[#FFF7E8]/70 font-cinzel">
          Loading donor profiles directory...
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="bg-[#240407] border-2 border-[#D4A72C]/30 rounded-3xl p-12 text-center text-[#FFF7E8]/70">
          <p className="font-cinzel text-base font-bold text-[#F4B942]">No donor profiles found.</p>
          <p className="text-xs mt-1">Click "+ Add New Donor Profile" above to create record-keeping entries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfiles.map((p) => {
            const due = Math.max(0, (p.targetAmount || 0) - (p.paidAmount || 0));

            return (
              <div
                key={p.id}
                className="bg-[#240407] border-2 border-[#D4A72C]/40 rounded-3xl p-5 text-[#FFF7E8] space-y-4 shadow-lg hover:border-[#F4B942] transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-[#D4A72C]/20 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#5A0F16] border border-[#F4B942] flex items-center justify-center font-cinzel font-black text-[#F4B942] text-sm">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#FFF7E8]">{p.name}</h3>
                        <span className="text-[10px] text-[#F4B942] uppercase font-bold block">
                          {p.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownloadSingleDonorPDF(p.name)}
                        className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 transition-colors"
                        title="Download Donor PDF Statement"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 transition-colors"
                        title="Edit Donor Profile (PUT API)"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 transition-colors"
                        title="Delete Donor Profile (DELETE API)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs pt-3">
                    <div className="flex items-center justify-between text-[#FFF7E8]/80">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Phone className="w-3 h-3 text-[#F4B942]" /> Phone:
                      </span>
                      <span className="font-mono text-xs text-[#FFF7E8] font-bold">
                        {p.phone || 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#FFF7E8]/80">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Target className="w-3 h-3 text-amber-400" /> Target Pledged:
                      </span>
                      <span className="font-bold text-amber-300">
                        ₹{(p.targetAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#FFF7E8]/80">
                      <span className="flex items-center gap-1 text-[11px]">
                        <DollarSign className="w-3 h-3 text-emerald-400" /> Total Paid:
                      </span>
                      <span className="font-bold text-emerald-400">
                        ₹{(p.paidAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#D4A72C]/20">
                      <span className="text-[10px] uppercase font-bold text-[#FFF7E8]/60">
                        Status:
                      </span>
                      {due > 0 ? (
                        <span className="text-amber-400 text-[11px] font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>₹{due.toLocaleString('en-IN')} Due</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Pledge Completed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleRecordMoneyFor(p)}
                    className="w-full py-2.5 rounded-xl bg-[#5A0F16] border border-[#F4B942]/60 text-[#F4B942] text-xs font-black uppercase tracking-wider hover:bg-[#F4B942] hover:text-[#32070B] transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>+ Record Money for {p.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT DONOR PROFILE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#F4B942] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D4A72C]/30 pb-3">
              <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase flex items-center gap-2">
                <User className="w-5 h-5 text-[#F4B942]" />
                <span>{editingProfile ? 'Edit Donor Profile' : 'Add New Donor Profile'}</span>
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-[#FFF7E8]/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#170204] border border-[#D4A72C]/30 p-3 rounded-2xl text-xs text-[#FFF7E8]/80 space-y-1">
              <span className="font-bold text-[#F4B942] block">ℹ️ What is a Record-Keeping Profile?</span>
              <span>
                Creates or updates a persistent donor profile in MongoDB for ledger collections. <b>It does NOT grant login credentials for website access.</b>
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                  Donor / Member Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Subhashish Behera"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                  Pledged Target Amount (₹) (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={profileTarget}
                  onChange={(e) => setProfileTarget(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#170204] border border-[#D4A72C]/30 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#F4B942] text-[#32070B] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 hover:brightness-110 shadow"
                >
                  <span>{editingProfile ? 'Update Donor Profile' : 'Save Donor Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (DELETE REST API) */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Donor Profile"
        itemTitle={deleteTarget?.name}
        message={`Are you sure you want to delete donor profile for "${deleteTarget?.name}"?`}
        confirmText="Yes, Delete Profile"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
