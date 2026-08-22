import React, { useState, useEffect } from 'react';
import { HeartHandshake, Award, Sparkles, X, Calendar, Tag, Trophy, User, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicAPI } from '../services/api';
import { translateText, getLocalizedText, getMonogramInitial, toIndicDigits } from '../utils/translationHelper';

export interface HomepageVolunteer {
  id: string;
  _id?: string;
  userId?: any;
  name: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  title: string;
  bio?: string;
  category: string;
  volunteerSince: string;
  achievements?: string;
  displayOrder: number;
  isVisible: boolean;
  userRole?: string;
}

export const BestVolunteersSection: React.FC = () => {
  const { language } = useLanguage();
  const [volunteers, setVolunteers] = useState<HomepageVolunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<HomepageVolunteer | null>(null);

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        const res = await publicAPI.getHomepageVolunteers();
        if (res?.success && Array.isArray(res.data)) {
          const visibleOnly = res.data.filter((v: any) => v.isVisible !== false);
          setVolunteers(visibleOnly);
        }
      } catch {
        setVolunteers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, []);

  if (!loading && volunteers.length === 0) {
    return null;
  }

  return (
    <section id="best-volunteers" className="py-16 sm:py-24 bg-[#1F0407] relative overflow-hidden border-t-2 border-b-2 border-[#D4A72C]/30">
      {/* Background Decorative Temple Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E87516]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5A0F16]/80 border border-[#F4B942]/50 text-[#F4B942] text-xs font-bold uppercase tracking-[0.2em] shadow-sm">
            <HeartHandshake className="w-4 h-4 text-[#E87516]" />
            <span className={fontClass}>{translateText('Seva Ratna & Recognition', language)}</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#F4B942] uppercase tracking-wider ${fontClass}`}>
            {translateText('Best Volunteers', language)}
          </h2>

          <p className={`text-xs sm:text-sm text-[#FFF7E8]/80 max-w-2xl mx-auto font-medium leading-relaxed ${fontClass}`}>
            {translateText(
              'Honoring our devoted volunteers and community heroes who selflessly serve with unwavering dedication throughout Ganesh Utsav celebrations.',
              language
            )}
          </p>

          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#D4A72C]" />
            <Sparkles className="w-4 h-4 text-[#E87516]" />
            <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#D4A72C]" />
          </div>
        </div>

        {/* Volunteers Grid */}
        {loading ? (
          <div className="text-center py-12 text-[#F4B942] font-cinzel font-bold text-sm">
            {language === 'hi'
              ? 'प्रमुख स्वयंसेवकों की सूची लोड हो रही है...'
              : language === 'or'
              ? 'ପ୍ରମୁଖ ସ୍ୱେଚ୍ଛାସେବୀ ତାଲିକା ଲୋଡ୍ ହେଉଛି...'
              : 'Loading featured volunteers...'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers.map((vol) => {
              const photo = vol.profilePhoto;
              const title = translateText(vol.title || 'Community Volunteer', language);
              const category = translateText(vol.category || 'Community Service', language);
              const since = vol.volunteerSince || '2026';
              const name = getLocalizedText(vol, 'name', language) || vol.name;
              const bio = getLocalizedText(vol, 'bio', language) || vol.bio;
              const initialLetter = getMonogramInitial(vol.name);

              return (
                <div
                  key={vol.id || vol._id}
                  className="bg-[#120204] text-[#FFF7E8] border-2 border-[#D4A72C]/40 hover:border-[#F4B942] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group text-left relative"
                >
                  {/* Top Accent Header */}
                  <div className="h-20 w-full bg-gradient-to-r from-[#3A060B] via-[#5A0F16] to-[#240407] relative overflow-hidden flex items-center justify-between px-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F4B942] uppercase tracking-wider bg-black/40 px-2.5 py-1 rounded-full border border-[#F4B942]/30 backdrop-blur-sm">
                      <Tag className="w-3 h-3 text-[#E87516]" />
                      <span className={fontClass}>{category}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-[#32070B] px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Calendar className="w-3 h-3" />
                      <span className={fontClass}>
                        {language === 'hi'
                          ? `${toIndicDigits(since, language)} से`
                          : language === 'or'
                          ? `${toIndicDigits(since, language)} ରୁ`
                          : `Since ${since}`}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 pt-0 space-y-3 flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      {/* Avatar with proper z-index elevation */}
                      <div className="-mt-10 mb-3 relative z-20 inline-block">
                        {photo ? (
                          <img
                            src={photo}
                            alt={vol.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F4B942] shadow-2xl bg-[#240407]"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                              const fallback = (e.target as HTMLElement).nextElementSibling;
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          style={{ display: photo ? 'none' : 'flex' }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5A0F16] via-[#32070B] to-[#180305] border-2 border-[#F4B942] items-center justify-center text-[#F4B942] font-black text-2xl shadow-2xl font-cinzel"
                        >
                          {initialLetter}
                        </div>
                      </div>

                      {/* Name & Title */}
                      <h4 className={`font-bold text-base text-[#F4B942] leading-tight line-clamp-1 ${fontClass}`}>
                        {name}
                      </h4>
                      <span className={`text-xs font-semibold text-[#E87516] block mt-0.5 tracking-wide ${fontClass}`}>
                        {title}
                      </span>

                      {/* Bio Snippet */}
                      {bio && (
                        <p className={`text-xs text-[#FFF7E8]/75 line-clamp-2 italic mt-2 font-normal leading-relaxed ${fontClass}`}>
                          "{bio}"
                        </p>
                      )}
                    </div>

                    {/* Card Footer Button */}
                    <div className="pt-3 border-t border-[#D4A72C]/20 flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase ${fontClass}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{translateText('Active Volunteer', language)}</span>
                      </div>

                      <button
                        onClick={() => setSelectedVolunteer(vol)}
                        className={`px-3 py-1.5 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/50 hover:bg-[#32070B] hover:border-[#F4B942] font-bold text-xs transition-all shadow-sm flex items-center gap-1 group-hover:translate-x-0.5 ${fontClass}`}
                      >
                        <span>{translateText('View Profile', language)}</span>
                        <span className="text-xs">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Volunteer Full Profile Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-[#1F0407] border-2 border-[#F4B942] rounded-3xl p-6 w-full max-w-lg text-[#FFF7E8] space-y-5 shadow-2xl relative my-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedVolunteer(null)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8] rounded-full hover:bg-[#32070B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b border-[#D4A72C]/30 pb-4">
              {selectedVolunteer.profilePhoto ? (
                <img
                  src={selectedVolunteer.profilePhoto}
                  alt={selectedVolunteer.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#F4B942] shadow-xl bg-[#240407] shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const fallback = (e.target as HTMLElement).nextElementSibling;
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                style={{ display: selectedVolunteer.profilePhoto ? 'none' : 'flex' }}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#5A0F16] border-2 border-[#F4B942] items-center justify-center text-[#F4B942] font-black text-3xl shadow-xl font-cinzel shrink-0"
              >
                {getMonogramInitial(selectedVolunteer.name)}
              </div>

              <div>
                <h3 className={`font-cinzel text-lg sm:text-xl font-black text-[#F4B942] leading-tight ${fontClass}`}>
                  {getLocalizedText(selectedVolunteer, 'name', language) || selectedVolunteer.name}
                </h3>
                <p className={`text-xs font-bold text-[#E87516] mt-0.5 ${fontClass}`}>
                  {translateText(selectedVolunteer.title || 'Community Volunteer', language)}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/40 ${fontClass}`}>
                    {translateText(selectedVolunteer.category || 'Community Service', language)}
                  </span>
                  <span className={`text-[10px] font-semibold text-[#FFF7E8]/70 ${fontClass}`}>
                    {language === 'hi'
                      ? `${toIndicDigits(selectedVolunteer.volunteerSince || '2026', language)} से`
                      : language === 'or'
                      ? `${toIndicDigits(selectedVolunteer.volunteerSince || '2026', language)} ରୁ`
                      : `Since ${selectedVolunteer.volunteerSince || '2026'}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Description / Bio */}
            {selectedVolunteer.bio && (
              <div className="space-y-1.5">
                <span className={`text-xs font-bold text-[#F4B942] uppercase tracking-wider flex items-center gap-1.5 ${fontClass}`}>
                  <User className="w-3.5 h-3.5 text-[#E87516]" />
                  <span>{translateText('About Volunteer & Seva', language)}</span>
                </span>
                <p className={`text-xs sm:text-sm text-[#FFF7E8]/85 leading-relaxed bg-[#120204] p-3.5 rounded-2xl border border-[#D4A72C]/30 italic ${fontClass}`}>
                  "{getLocalizedText(selectedVolunteer, 'bio', language) || selectedVolunteer.bio}"
                </p>
              </div>
            )}

            {/* Achievements */}
            {selectedVolunteer.achievements && (
              <div className="space-y-1.5">
                <span className={`text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 ${fontClass}`}>
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{translateText('Key Contributions & Achievements', language)}</span>
                </span>
                <p className={`text-xs sm:text-sm text-[#FFF7E8]/85 leading-relaxed bg-[#120204] p-3.5 rounded-2xl border border-amber-400/30 ${fontClass}`}>
                  {translateText(selectedVolunteer.achievements, language)}
                </p>
              </div>
            )}

            {/* Recognition Badge */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#5A0F16] to-[#32070B] border border-[#F4B942]/40 flex items-center gap-3">
              <Award className="w-6 h-6 text-[#F4B942] shrink-0" />
              <div className={`text-xs ${fontClass}`}>
                <span className="font-bold text-[#F4B942] block">
                  {translateText('Certified Festival Seva Volunteer', language)}
                </span>
                <span className="text-[11px] text-[#FFF7E8]/70">
                  {translateText('Recognized by Vighnaharta Puja Executive Committee', language)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedVolunteer(null)}
                className={`w-full py-2.5 rounded-xl bg-[#F4B942] text-[#32070B] font-black uppercase text-xs tracking-wider hover:brightness-110 transition-all shadow ${fontClass}`}
              >
                {translateText('Close Profile', language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
