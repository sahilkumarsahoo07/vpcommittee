import React, { useState, useEffect } from 'react';
import { ShieldCheck, Phone, Mail, Sparkles, Send } from 'lucide-react';
import { InstagramIcon } from '../components/SocialIcons';
import { useLanguage } from '../context/LanguageContext';
import { publicAPI } from '../services/api';
import { translateText, getLocalizedText, getMonogramInitial, toIndicDigits } from '../utils/translationHelper';

export interface HomepageMember {
  id: string;
  _id?: string;
  userId?: any;
  name: string;
  email?: string;
  phone?: string;
  displayPhone?: string;
  profilePhoto?: string;
  image?: string;
  galleryImage?: string;
  designation: string;
  roleType?: string;
  userRole?: string;
  bio?: string;
  instagram?: string;
  instagramId?: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
}

export const MembersSection: React.FC = () => {
  const { language } = useLanguage();
  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  const [members, setMembers] = useState<HomepageMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await publicAPI.getMembers();
        if (res.success && Array.isArray(res.data)) {
          const mapped: HomepageMember[] = res.data.map((item: any, idx: number) => {
            const u = item.userId;
            const resolvedName = item.name || (u && typeof u === 'object' ? u.name : null) || 'Committee Leader';
            const resolvedEmail = item.email !== undefined ? item.email : '';
            const resolvedPhone = item.displayPhone !== undefined ? item.displayPhone : (item.phone !== undefined ? item.phone : '');
            const resolvedPhoto = item.profilePhoto || item.image || (u && typeof u === 'object' ? u.profilePhoto : null) || '';
            const resolvedRole = (u && typeof u === 'object' ? u.role : null) || item.userRole || item.roleType || 'MEMBER';
            const resolvedInsta = item.instagram || item.instagramId || item.socialLinks?.instagram || '';

            return {
              id: item._id ? item._id.toString() : item.id ? item.id.toString() : String(idx),
              _id: item._id ? item._id.toString() : item.id,
              userId: u?._id || u?.id || u || item.userId,
              name: resolvedName,
              email: resolvedEmail,
              phone: resolvedPhone,
              displayPhone: item.displayPhone || resolvedPhone,
              profilePhoto: resolvedPhoto,
              image: resolvedPhoto,
              galleryImage: item.galleryImage || '',
              designation: item.designation || 'Committee Member',
              roleType: resolvedRole,
              userRole: resolvedRole,
              bio: item.bio || '',
              instagram: resolvedInsta,
              instagramId: resolvedInsta,
              displayOrder: Number(item.displayOrder) || idx + 1,
              isVisible: item.isVisible !== false && item.isActive !== false,
              isActive: item.isActive !== false && item.isVisible !== false,
            };
          });

          // Sort by display order
          mapped.sort((a, b) => a.displayOrder - b.displayOrder);
          setMembers(mapped);
        }
      } catch {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const visibleMembers = members.filter((m) => m.isVisible && m.isActive);

  // If loading is done and there are no visible members, don't show the section
  if (!loading && visibleMembers.length === 0) {
    return null;
  }

  return (
    <section
      id="members"
      className="relative bg-gradient-to-b from-[#FFFDF7] via-[#FFF8EB] to-[#FFF2D8] text-[#2A1710] py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-t-2 border-[#D4A72C]/40"
    >
      {/* Background Subtle Artworks */}
      <img
        src="/assets/3rdbgimage.png"
        alt="Lotus Decorative Left"
        className="absolute -left-16 -bottom-16 w-80 md:w-[420px] pointer-events-none opacity-20 object-contain mix-blend-multiply"
      />
      <img
        src="/assets/3rdbgimage.png"
        alt="Lotus Decorative Right"
        className="absolute -right-16 -top-16 w-80 md:w-[420px] pointer-events-none opacity-20 object-contain scale-x-[-1] scale-y-[-1] mix-blend-multiply"
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-14">
        {/* Section Header */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5A0F16]/10 border border-[#D4A72C]/50 text-[#5A0F16] shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#E87516]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] font-cinzel">
              {translateText('Official Organizers', language)}
            </span>
          </div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#5A0F16] tracking-tight uppercase ${fontClass}`}>
            {translateText('Our Leadership & Members', language)}
          </h2>

          <p className={`text-xs sm:text-sm text-[#2A1710]/80 font-medium leading-relaxed max-w-2xl mx-auto ${fontClass}`}>
            {language === 'hi'
              ? 'गणेश महोत्सव के सुचारू एवं सफल आयोजन हेतु समर्पित हमारे संस्थापक, पदाधिकारी एवं कार्यकारिणी सदस्य।'
              : language === 'or'
              ? 'ଗଣେଶ ମହୋତ୍ସବର ସୁଚାରୁ ପରିଚାଳନା ପାଇଁ ନିରନ୍ତର ସମର୍ପିତ ଆମର ପ୍ରତିଷ୍ଠାତା, କର୍ମକର୍ତ୍ତା ଓ କାର୍ଯ୍ୟକାରିଣୀ ସଦସ୍ୟ।'
              : 'Honoring the guiding committee leaders, founders, and executive members who oversee and organize the sacred Ganesh Mahotsav.'}
          </p>

          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="h-[1.5px] w-14 bg-gradient-to-r from-transparent to-[#D4A72C]" />
            <div className="w-2.5 h-2.5 rotate-45 bg-[#E87516] shadow-sm" />
            <div className="h-[1.5px] w-14 bg-gradient-to-l from-transparent to-[#D4A72C]" />
          </div>
        </div>

        {/* Member Cards Grid */}
        {loading ? (
          <div className="text-center py-16 text-[#5A0F16] font-cinzel font-bold text-sm">
            {language === 'hi'
              ? 'समिति पदाधिकारियों का विवरण लोड हो रहा है...'
              : language === 'or'
              ? 'କମିଟି ନେତୃତ୍ୱ ବିବରଣୀ ଲୋଡ୍ ହେଉଛି...'
              : 'Loading leadership & members...'}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
            {visibleMembers.map((m) => {
              const memberImage = m.profilePhoto || m.image;
              const memberName = getLocalizedText(m, 'name', language) || m.name || 'Committee Leader';
              const memberDesignation = translateText(m.designation || 'Committee Member', language);
              const memberBio = getLocalizedText(m, 'bio', language) || m.bio;
              const initialLetter = getMonogramInitial(m.name);
              const displayPhoneNum = m.displayPhone || m.phone;
              const instagramLink = m.instagram || m.instagramId;
              const emailAddress = m.email;

              // Check if any optional contact info exists
              const hasContactInfo = Boolean(
                (emailAddress && emailAddress.trim()) ||
                (displayPhoneNum && displayPhoneNum.trim()) ||
                (instagramLink && instagramLink.trim())
              );

              return (
                <div
                  key={m._id || m.id}
                  className="w-full max-w-[300px] sm:max-w-[320px] bg-[#1A0306] text-[#FFF7E8] rounded-3xl overflow-hidden border-2 border-[#D4A72C]/40 hover:border-[#F4B942] shadow-[0_15px_40px_rgba(20,2,4,0.35)] hover:shadow-[0_25px_60px_rgba(212,167,44,0.38)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between group relative text-left"
                >
                  {/* TOP CLEAN RECTANGLE PORTRAIT PHOTO */}
                  <div className="relative w-full h-[320px] sm:h-[350px] overflow-hidden bg-gradient-to-b from-[#38080E] via-[#200407] to-[#120204]">
                    {memberImage && memberImage !== '/assets/navlogo.png' ? (
                      <img
                        src={memberImage}
                        alt={m.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 brightness-[0.98] group-hover:brightness-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const fallback = (e.target as HTMLElement).nextElementSibling;
                          if (fallback) (fallback as HTMLElement).style.display = 'flex';
                        }}
                      />
                    ) : null}

                    {/* Monogram Sacred Medallion when no custom photo is uploaded */}
                    <div
                      style={{ display: memberImage && memberImage !== '/assets/navlogo.png' ? 'none' : 'flex' }}
                      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#4A0A10] via-[#2A050A] to-[#120204] relative p-6 text-center"
                    >
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#D4A72C] via-[#E87516] to-[#5A0F16] p-1.5 shadow-2xl">
                        <div className="w-full h-full rounded-full bg-[#180305] flex items-center justify-center border-2 border-[#F4B942]">
                          <span className="font-cinzel text-5xl font-black text-[#F4B942] drop-shadow-md">
                            {initialLetter}
                          </span>
                        </div>
                      </div>
                      <span className="mt-4 text-xs font-bold text-[#D4A72C]/80 uppercase tracking-widest font-cinzel flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#E87516]" />
                        Leadership Team
                      </span>
                    </div>

                    {/* Top Right Designation Tag */}
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#1A0306]/85 backdrop-blur-md text-[#F4B942] border border-[#F4B942]/60 shadow-lg ${fontClass}`}>
                        {memberDesignation}
                      </span>
                    </div>

                    {/* Gradient Fade along bottom edge of photo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0306] via-[#1A0306]/30 via-20% to-transparent pointer-events-none" />
                  </div>

                  {/* BOTTOM INFO PANEL */}
                  <div className="p-5 pt-3 space-y-3 flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      {/* Name */}
                      <h3 className={`font-black text-xl text-[#F4B942] group-hover:text-white transition-colors leading-tight font-cinzel line-clamp-1`}>
                        {memberName}
                      </h3>

                      {/* Designation Title */}
                      <span className={`text-xs font-bold uppercase tracking-widest text-[#E87516] block mt-0.5 ${fontClass}`}>
                        {memberDesignation}
                      </span>

                      {/* Bio (if provided) */}
                      {memberBio && memberBio.trim() ? (
                        <p className={`text-xs text-[#FFF7E8]/75 line-clamp-2 italic font-normal leading-relaxed pt-2 ${fontClass}`}>
                          "{memberBio.trim()}"
                        </p>
                      ) : null}
                    </div>

                    {/* SLEEK CONTACT ACTION ROW (100% Optional) */}
                    {hasContactInfo ? (
                      <div className="pt-3 border-t border-[#D4A72C]/25 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#D4A72C]/70 uppercase tracking-wider">
                          Contact
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Email */}
                          {emailAddress && emailAddress.trim() ? (
                            <a
                              href={`mailto:${emailAddress.trim()}`}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#5A0F16] border border-[#D4A72C]/40 hover:border-[#F4B942] flex items-center justify-center text-[#F4B942] shadow-sm hover:scale-110 transition-all"
                              title={`Email: ${emailAddress.trim()}`}
                            >
                              <Mail className="w-3.5 h-3.5 text-[#F4B942]" />
                            </a>
                          ) : null}

                          {/* Phone */}
                          {displayPhoneNum && displayPhoneNum.trim() ? (
                            <a
                              href={`tel:${displayPhoneNum.trim()}`}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#5A0F16] border border-[#D4A72C]/40 hover:border-[#F4B942] flex items-center justify-center text-[#F4B942] shadow-sm hover:scale-110 transition-all"
                              title={`Call: ${displayPhoneNum.trim()}`}
                            >
                              <Phone className="w-3.5 h-3.5 text-[#F4B942]" />
                            </a>
                          ) : null}

                          {/* Instagram */}
                          {instagramLink && instagramLink.trim() ? (
                            <a
                              href={
                                instagramLink.trim().startsWith('http')
                                  ? instagramLink.trim()
                                  : `https://instagram.com/${instagramLink.trim().replace('@', '')}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-pink-950 border border-pink-500/40 hover:border-pink-400 flex items-center justify-center text-pink-400 shadow-sm hover:scale-110 transition-all"
                              title={`Instagram: ${instagramLink.trim().replace('https://instagram.com/', '@')}`}
                            >
                              <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
