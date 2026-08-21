import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Navigation, Sparkles, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { OmIcon } from '../components/DevotionalIcons';
import { publicAPI } from '../services/api';
import { getLocalizedText } from '../utils/translationHelper';

export const FestivalTimeline: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await publicAPI.getEvents();
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((item: any) => ({
            id: item._id || item.id,
            title: item.title,
            title_hi: item.title_hi,
            title_or: item.title_or,
            description: item.description,
            description_hi: item.description_hi,
            description_or: item.description_or,
            dayMonth: item.date ? new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'SEPT 7',
            time: item.startTime ? `${item.startTime} - ${item.endTime}` : item.time || '10:00 AM',
            location: item.location || 'Central Mandap',
          }));
          setEvents(mapped);
        }
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [language]);

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  return (
    <section id="events" className="relative bg-[#FFF7E8] text-[#2A1710] py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Golden Lotus Corner Artworks */}
      <img
        src="/assets/2bgimage.png"
        alt="Golden Lotus Corner Bottom Left"
        className="absolute left-0 bottom-0 w-72 sm:w-96 md:w-[460px] pointer-events-none opacity-30 object-contain"
      />
      <img
        src="/assets/2bgimage.png"
        alt="Golden Lotus Corner Top Right"
        className="absolute right-0 top-0 w-72 sm:w-96 md:w-[460px] pointer-events-none opacity-30 object-contain scale-x-[-1] scale-y-[-1]"
      />

      {/* Background Rotating Mandala */}
      <img
        src="/assets/bgimage.png"
        alt="Mandala Aura"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] pointer-events-none opacity-10 object-contain animate-mandala-slow"
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5A0F16]/10 border border-[#D4A72C]/50 text-[#5A0F16] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#E87516]" />
            <span className={`text-xs font-black uppercase tracking-[0.25em] ${fontClass}`}>
              ✦ {t.timeline.tag} ✦
            </span>
          </div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#3D0B10] uppercase tracking-wider ${fontClass}`}>
            FESTIVAL SCHEDULE
          </h2>

          <div className="flex items-center justify-center gap-3 max-w-xs sm:max-w-md mx-auto pt-1">
            <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#D4A72C] to-[#D4A72C]" />
            <div className="flex items-center gap-1.5 text-[#D4A72C]">
              <span className="text-xs">❖</span>
              <OmIcon className="w-5 h-5 text-[#D4A72C]" />
              <span className="text-xs">❖</span>
            </div>
            <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#D4A72C] to-[#D4A72C]" />
          </div>
        </div>

        {/* Feature Hero Banner: LIVE / TODAY MAHA AARTI */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4A72C] bg-gradient-to-br from-[#32070B] via-[#4A0A10] to-[#240407] p-1 shadow-[0_15px_40px_rgba(50,7,11,0.25)] group">
          <div className="relative rounded-[22px] overflow-hidden p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
            
            {/* Background Image Layer */}
            <div className="absolute inset-0">
              <img
                src="/assets/maha-aarti.png"
                alt="Maha Aarti Ceremony"
                className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#240407] via-[#32070B]/90 to-[#240407]/60" />
            </div>

            {/* Left Content */}
            <div className="relative z-10 space-y-4 text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#5A0F16] border border-[#F4B942] text-[#FFF7E8] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                {t.timeline.liveBadge}
              </div>

              <h3 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#F4B942] tracking-wider uppercase drop-shadow-lg ${fontClass}`}>
                {t.timeline.liveTitle}
              </h3>

              <p className={`text-base sm:text-lg text-[#FFF7E8]/90 font-medium ${fontClass}`}>
                {t.timeline.liveTime} • Experience the divine evening musical Aarti with thousands of devotees chanting in chorus.
              </p>

              <div className={`flex items-center gap-2 text-xs sm:text-sm text-[#F4B942] font-bold ${fontClass}`}>
                <MapPin className="w-4 h-4 text-[#E87516]" />
                <span>{t.timeline.pandalName}</span>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="relative z-10 flex-shrink-0 w-full lg:w-auto">
              <a
                href="#location"
                className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] font-black text-sm uppercase tracking-widest shadow-[0_8px_25px_rgba(244,185,66,0.4)] hover:shadow-[0_12px_35px_rgba(244,185,66,0.6)] hover:scale-105 transition-all w-full lg:w-auto ${fontClass}`}
              >
                <Navigation className="w-5 h-5 fill-current" />
                <span>{t.timeline.viewLocBtn}</span>
              </a>
            </div>

          </div>
        </div>

        {/* 2-Column Staggered Royal Festival Event Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-[#5A0F16] font-cinzel font-bold text-sm">Loading festival schedule...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {events.map((event) => {
              const displayTitle = getLocalizedText(event, 'title', language);
              const displayDesc = getLocalizedText(event, 'description', language);

              return (
                <div
                  key={event.id}
                  className="group relative rounded-2xl bg-white/90 border-2 border-[#D4A72C]/40 hover:border-[#D4A72C] p-6 sm:p-7 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 text-left backdrop-blur-md overflow-hidden flex flex-col justify-between"
                >
                  <img
                    src="/assets/2bgimage.png"
                    alt="Lotus Watermark"
                    className="absolute -right-10 -bottom-10 w-44 h-44 pointer-events-none opacity-15 object-contain scale-x-[-1]"
                  />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#5A0F16] to-[#32070B] border border-[#D4A72C]/60 text-[#FFF7E8] shadow-sm">
                        <Calendar className="w-4 h-4 text-[#F4B942]" />
                        <span className={`text-xs font-black uppercase tracking-wider text-[#F4B942] ${fontClass}`}>
                          {event.dayMonth}
                        </span>
                      </div>

                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A0F16]/10 border border-[#D4A72C]/40 text-[#5A0F16] text-xs font-bold ${fontClass}`}>
                        <Clock className="w-3.5 h-3.5 text-[#E87516]" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <h4 className={`text-xl sm:text-2xl font-black text-[#3D0B10] group-hover:text-[#5A0F16] transition-colors ${fontClass}`}>
                      {displayTitle}
                    </h4>

                    <p className={`text-sm text-[#4A2511] leading-relaxed ${fontClass}`}>
                      {displayDesc}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[#D4A72C]/20 flex items-center justify-between gap-2 relative z-10">
                    <div className={`flex items-center gap-1.5 text-xs text-[#E87516] font-bold ${fontClass}`}>
                      <MapPin className="w-4 h-4 flex-shrink-0 text-[#E87516]" />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <span className="text-[#D4A72C] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      ❖ Devotional Ritual
                    </span>
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
