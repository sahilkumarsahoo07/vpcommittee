import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Award, Users, HeartHandshake, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { publicAPI } from '../services/api';

export const LocationCommunitySection: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [statsItems, setStatsItems] = useState([
    { id: 's1', value: 12, suffix: '+', iconName: 'Award', label: 'Years of Celebration' },
    { id: 's2', value: 50, suffix: 'K+', iconName: 'Users', label: 'Annual Devotees' },
    { id: 's3', value: 25, suffix: '+', iconName: 'HeartHandshake', label: 'Cultural Events' },
    { id: 's4', value: 100, suffix: '+', iconName: 'Sparkles', label: 'Active Volunteers' },
  ]);

  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMembers(true);
        const [membersRes, settingsRes] = await Promise.all([
          publicAPI.getMembers().catch(() => null),
          publicAPI.getSettings().catch(() => null),
        ]);

        if (membersRes?.success && Array.isArray(membersRes.data)) {
          setMembers(membersRes.data);
        }

        if (settingsRes?.success && settingsRes.data) {
          const s = settingsRes.data;
          const y = Number(s.yearsOfCelebration) || 12;
          const rawDevotees = String(s.annualDevotees || '50K');
          const dVal = parseInt(rawDevotees) || 50;
          const dSuffix = rawDevotees.replace(/[0-9]/g, '') || '+';
          const a = Number(s.communityActivities) || 25;
          const v = Number(s.activeVolunteers) || 100;

          setStatsItems([
            { id: 's1', value: y, suffix: '+', iconName: 'Award', label: 'Years of Celebration' },
            { id: 's2', value: dVal, suffix: dSuffix, iconName: 'Users', label: 'Annual Devotees' },
            { id: 's3', value: a, suffix: '+', iconName: 'HeartHandshake', label: 'Cultural Events' },
            { id: 's4', value: v, suffix: '+', iconName: 'Sparkles', label: 'Active Volunteers' },
          ]);
        }
      } catch {
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchData();
  }, []);

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          statsItems.forEach((stat) => {
            const duration = 2000;
            const steps = 40;
            const increment = stat.value / steps;
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setCounts((prev) => ({ ...prev, [stat.id]: Math.floor(current) }));
            }, duration / steps);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, statsItems]);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Award':
        return Award;
      case 'Users':
        return Users;
      case 'HeartHandshake':
        return HeartHandshake;
      default:
        return Sparkles;
    }
  };

  const getStatLabel = (statId: string, fallback: string) => {
    switch (statId) {
      case 's1':
        return t.location.stats.years;
      case 's2':
        return t.location.stats.devotees;
      case 's3':
        return t.location.stats.activities;
      case 's4':
        return t.location.stats.volunteers;
      default:
        return fallback;
    }
  };

  return (
    <section
      id="location"
      ref={sectionRef}
      className="bg-[#FFF7E8] text-[#2A1710] py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/15"
    >
      <div className="max-w-7xl mx-auto space-y-14 md:space-y-16">
        {/* Find Our Pandal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className={`text-sm font-bold tracking-[0.2em] text-[#5A0F16] uppercase ${fontClass}`}>
              {t.location.tag}
            </span>

            <div className="bg-white border border-[#D4A72C]/30 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#5A0F16] text-[#F4B942] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-base font-bold text-[#5A0F16] ${fontClass}`}>{t.location.pandalTitle}</h4>
                  <p className={`text-sm text-[#2A1710]/80 mt-0.5 ${fontClass}`}>
                    {t.location.address}
                  </p>
                </div>
              </div>
              <p className={`text-xs text-[#2A1710]/65 pl-[52px] ${fontClass}`}>{t.location.landmark}</p>
            </div>

            <a
              href="https://maps.google.com/?q=Vighnaharta+puja+committee+Kadua+Kamakhyanagar+Dhenkanal"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5A0F16] hover:bg-[#32070B] border border-[#D4A72C] text-[#FFF7E8] font-bold text-sm uppercase tracking-wider shadow-md hover:scale-105 transition-all group ${fontClass}`}
            >
              {t.location.directionsBtn}
              <Navigation className="w-4 h-4 text-[#F4B942] group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden border-2 border-[#D4A72C]/50 shadow-xl h-64 sm:h-72 lg:h-80 bg-[#2A1710]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d581.2730728433189!2d85.51460151541815!3d20.914095979420168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a18d1002ee40277%3A0x6b7ef8fc36e80d58!2sVighnaharta%20puja%20committee!5e1!3m2!1sen!2sin!4v1787291683928!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Vighnaharta Puja Committee Location"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Our Community Stats */}
        <div className="space-y-8">
          <h3 className={`text-2xl sm:text-3xl font-extrabold text-[#5A0F16] text-center uppercase tracking-wide ${fontClass}`}>
            {t.location.communityTitle}
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statsItems.map((stat) => {
              const IconComp = getIcon(stat.iconName);
              const currentVal = counts[stat.id] ?? stat.value;

              return (
                <div
                  key={stat.id}
                  className="bg-white border border-[#D4A72C]/30 rounded-xl p-5 sm:p-6 text-center shadow-sm hover:shadow-md hover:border-[#D4A72C]/60 transition-all"
                >
                  <div className="w-11 h-11 rounded-full bg-[#5A0F16] text-[#F4B942] flex items-center justify-center mx-auto mb-3">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-black text-[#5A0F16]">
                    {currentVal}
                    <span className="text-[#E87516]">{stat.suffix}</span>
                  </div>
                  <p className={`text-xs sm:text-sm font-semibold text-[#2A1710]/75 mt-1 uppercase tracking-wide ${fontClass}`}>
                    {getStatLabel(stat.id, stat.label)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Executive Panel / Committee Leadership Grid */}
          <div className="pt-6 space-y-6">
            <h4 className={`text-xl font-bold text-[#5A0F16] text-center uppercase tracking-wider ${fontClass}`}>
              Committee Executive Leadership
            </h4>

            {loadingMembers ? (
              <div className="text-center py-6 text-[#5A0F16] font-cinzel font-bold text-xs">Loading committee leaders...</div>
            ) : members.length === 0 ? (
              <div className="text-center py-6 text-[#2A1710]/60 text-xs">Executive directory updated regularly.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {members.map((m: any) => (
                  <div
                    key={m._id || m.id}
                    className="bg-white border-2 border-[#D4A72C]/30 hover:border-[#D4A72C] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all text-left flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[#5A0F16] text-[#F4B942] flex items-center justify-center font-bold font-cinzel text-lg flex-shrink-0 border border-[#D4A72C]">
                        {m.name ? m.name.charAt(0) : 'V'}
                      </div>
                      <div>
                        <h5 className={`font-bold text-sm text-[#5A0F16] leading-tight ${fontClass}`}>{m.name || 'Committee Leader'}</h5>
                        <span className={`text-[11px] text-[#E87516] font-bold block ${fontClass}`}>{m.designation || m.roleType || 'Executive Member'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#2A1710]/70 line-clamp-2 italic">{m.bio || 'Devoted member of Vighnaharta Committee.'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
