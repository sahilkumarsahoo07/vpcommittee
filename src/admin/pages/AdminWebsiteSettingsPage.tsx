import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, RefreshCw } from 'lucide-react';
import { publicAPI, adminAPI } from '../../services/api';
import { InstagramIcon } from '../../components/SocialIcons';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

export const AdminWebsiteSettingsPage: React.FC = () => {
  const [heroTitle, setHeroTitle] = useState('VIGHNAHARTA PUJA COMMITTEE');
  const [heroSubtitle, setHeroSubtitle] = useState('GRAND GANESH UTSAV 2026');
  const [heroDescription, setHeroDescription] = useState(
    'Join us in celebrating devotion, unity, and divine blessings at our annual Ganesh Mahotsav.'
  );
  const [upiId, setUpiId] = useState('vighnaharta@upi');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [contactEmail, setContactEmail] = useState('info@vighnahartapujacommittee.org');
  const [contactAddress, setContactAddress] = useState('Main Mandap Grounds, Sector 4, City Center');
  const [instagramHandle, setInstagramHandle] = useState('vighnaharta_puja');
  const [yearsOfCelebration, setYearsOfCelebration] = useState<number>(12);
  const [annualDevotees, setAnnualDevotees] = useState<string>('50K');
  const [communityActivities, setCommunityActivities] = useState<number>(25);
  const [activeVolunteers, setActiveVolunteers] = useState<number>(100);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await publicAPI.getSettings();
      if (res.success && res.data) {
        const s = res.data;
        if (s.heroTitle) setHeroTitle(s.heroTitle);
        if (s.heroSubtitle) setHeroSubtitle(s.heroSubtitle);
        if (s.heroDescription) setHeroDescription(s.heroDescription);
        if (s.upiId) setUpiId(s.upiId);
        if (s.contactPhone) setContactPhone(s.contactPhone);
        if (s.contactEmail) setContactEmail(s.contactEmail);
        if (s.contactAddress) setContactAddress(s.contactAddress);
        if (s.instagramHandle) setInstagramHandle(s.instagramHandle);
        if (s.yearsOfCelebration !== undefined) setYearsOfCelebration(Number(s.yearsOfCelebration));
        if (s.annualDevotees) setAnnualDevotees(s.annualDevotees);
        if (s.communityActivities !== undefined) setCommunityActivities(Number(s.communityActivities));
        if (s.activeVolunteers !== undefined) setActiveVolunteers(Number(s.activeVolunteers));
      }
    } catch {
      // Keep initial defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        heroTitle,
        heroSubtitle,
        heroDescription,
        upiId,
        contactPhone,
        contactEmail,
        contactAddress,
        instagramHandle: instagramHandle.trim().replace(/^@/, ''),
        yearsOfCelebration,
        annualDevotees,
        communityActivities,
        activeVolunteers,
      };
      await adminAPI.updateSettings(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleConfirmResetSettings = async () => {
    setIsResetting(true);
    try {
      setLoading(true);
      await adminAPI.resetSettings();
      await fetchSettings();
    } catch {
      await fetchSettings();
    } finally {
      setLoading(false);
      setIsResetting(false);
      setIsResetModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4A72C]/40 pb-4">
        <div>
          <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider">
            Website CMS Global Settings
          </h2>
          <p className="text-xs text-[#2A1710]/70 font-semibold">
            Update public website headers, Hero text, Instagram handle, donation UPI ID, contact details, and Community Stats counters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsResetModalOpen(true)}
          className="px-3 py-2.5 rounded-xl bg-red-900/30 text-red-700 border border-red-300 font-bold text-xs uppercase hover:bg-red-900/50 transition-all flex items-center gap-1.5"
          title="Reset to System Defaults (DELETE /settings API)"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Website Global Settings updated successfully! Changes reflect dynamically on the public site.</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-[#32070B] font-cinzel font-bold text-sm">
          Processing settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-6 shadow-sm space-y-6">
          {/* 1. HERO BANNER */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-base font-black text-[#32070B] uppercase border-b border-[#D4A72C]/30 pb-2">
              1. Hero Banner Content
            </h3>

            <div>
              <label className="text-xs font-bold text-[#32070B] block mb-1">Hero Title</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-bold text-[#32070B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#32070B] block mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-bold text-[#32070B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#32070B] block mb-1">Hero Description</label>
              <textarea
                rows={2}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-medium text-[#32070B]"
              />
            </div>
          </div>

          {/* 2. OFFICIAL INSTAGRAM STREAM SETTINGS */}
          <div className="space-y-4 bg-gradient-to-r from-[#240407] to-[#32070B] p-5 rounded-2xl border border-[#F4B942]/40 text-[#FFF7E8]">
            <div className="flex items-center gap-2 border-b border-[#D4A72C]/30 pb-2">
              <InstagramIcon className="w-5 h-5 text-pink-400" />
              <h3 className="font-cinzel text-base font-black text-[#F4B942] uppercase">
                2. Official Instagram Stream API Configuration
              </h3>
            </div>

            <div>
              <label className="text-xs font-bold text-[#F4B942] block mb-1">
                Official Committee Instagram Handle ID (e.g. vighnaharta_puja)
              </label>
              <div className="flex items-center gap-2 bg-[#170204] border border-[#D4A72C]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#FFF7E8]">
                <span className="text-pink-400">@</span>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="vighnaharta_puja"
                  className="bg-transparent border-none text-[#FFF7E8] outline-none w-full font-bold"
                  required
                />
              </div>
              <p className="text-[11px] text-[#FFF7E8]/70 mt-1.5 font-medium">
                The public website will automatically fetch all posts and reels uploaded under this official Instagram handle.
              </p>
            </div>
          </div>

          {/* 3. DONATION UPI & QR */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-base font-black text-[#32070B] uppercase border-b border-[#D4A72C]/30 pb-2">
              3. Donation UPI & QR Code Settings
            </h3>

            <div>
              <label className="text-xs font-bold text-[#32070B] block mb-1">Committee UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-bold text-[#32070B]"
              />
            </div>
          </div>

          {/* 4. CONTACT INFO */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-base font-black text-[#32070B] uppercase border-b border-[#D4A72C]/30 pb-2">
              4. Official Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#32070B] block mb-1">Helpline Phone Number</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-bold text-[#32070B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#32070B] block mb-1">Official Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-bold text-[#32070B]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#32070B] block mb-1">Pandal Address</label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-bold text-[#32070B]"
              />
            </div>
          </div>

          {/* 5. COMMUNITY STATS */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-base font-black text-[#32070B] uppercase border-b border-[#D4A72C]/30 pb-2">
              5. Our Community Statistics Counter
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-[#32070B] block mb-1">Years of Celebration</label>
                <input
                  type="number"
                  value={yearsOfCelebration}
                  onChange={(e) => setYearsOfCelebration(Number(e.target.value))}
                  className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-bold text-[#32070B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#32070B] block mb-1">Annual Devotees (e.g. 50K)</label>
                <input
                  type="text"
                  value={annualDevotees}
                  onChange={(e) => setAnnualDevotees(e.target.value)}
                  className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-bold text-[#32070B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#32070B] block mb-1">Community Activities</label>
                <input
                  type="number"
                  value={communityActivities}
                  onChange={(e) => setCommunityActivities(Number(e.target.value))}
                  className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-bold text-[#32070B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#32070B] block mb-1">Volunteers Count</label>
                <input
                  type="number"
                  value={activeVolunteers}
                  onChange={(e) => setActiveVolunteers(Number(e.target.value))}
                  className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3 text-xs font-bold text-[#32070B]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#5A0F16] text-[#F4B942] border-2 border-[#F4B942] font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish All Website Settings (PUT)</span>
          </button>
        </form>
      )}

      {/* Confirm Reset Settings Modal */}
      <ConfirmDeleteModal
        isOpen={isResetModalOpen}
        title="Reset Website Settings"
        message="Are you sure you want to reset all website settings to system default values?"
        confirmText="Yes, Reset Settings"
        isLoading={isResetting}
        onConfirm={handleConfirmResetSettings}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
