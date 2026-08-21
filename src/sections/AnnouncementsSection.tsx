import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronRight, X, Sparkles } from 'lucide-react';
import type { AnnouncementItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { publicAPI } from '../services/api';
import { getLocalizedText } from '../utils/translationHelper';

interface ExtendedAnnouncementItem extends AnnouncementItem {
  title_hi?: string;
  content_hi?: string;
  title_or?: string;
  content_or?: string;
  imageUrl?: string;
}

export const AnnouncementsSection: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [announcements, setAnnouncements] = useState<ExtendedAnnouncementItem[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<ExtendedAnnouncementItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await publicAPI.getAnnouncements();
        if (res.success && Array.isArray(res.data)) {
          const mapped: ExtendedAnnouncementItem[] = res.data.map((item: any) => ({
            id: item._id || item.id,
            title: item.title,
            content: item.content || item.description || '',
            title_hi: item.title_hi,
            content_hi: item.content_hi || item.description_hi,
            title_or: item.title_or,
            content_or: item.content_or || item.description_or,
            imageUrl: item.imageUrl || item.image || '',
            date: item.publishDate ? new Date(item.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            timeAgo: item.priority === 'HIGH' || item.priority === 'URGENT' ? 'IMPORTANT' : 'ANNOUNCEMENT',
            isRedBadge: item.priority === 'HIGH' || item.priority === 'URGENT',
          }));
          setAnnouncements(mapped);
        }
      } catch {
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [language]);

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  return (
    <section id="announcements" className="bg-[#FFF7E8] text-[#2A1710] py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/15">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-left space-y-2">
          <span className={`text-sm font-bold tracking-[0.2em] text-[#5A0F16] uppercase ${fontClass}`}>
            {t.announcements.tag}
          </span>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#5A0F16] ${fontClass}`}>
            {t.announcements.title}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#5A0F16] font-cinzel font-bold text-sm">Loading latest announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 text-[#2A1710]/60 text-xs font-semibold">No active announcements.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {announcements.map((item) => {
              const displayTitle = getLocalizedText(item, 'title', language);
              const displayContent = getLocalizedText(item, 'content', language);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedAnnouncement(item)}
                  className="group bg-white border border-[#D4A72C]/30 hover:border-[#D4A72C] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between text-left overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.isRedBadge
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-[#D4A72C]/15 text-[#5A0F16] border border-[#D4A72C]/30'
                        }`}
                      >
                        <Bell className="w-3 h-3" />
                        {item.timeAgo}
                      </span>
                      <span className="text-[11px] text-[#2A1710]/60 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>

                    {item.imageUrl && (
                      <div className="rounded-xl overflow-hidden max-h-36 border border-[#D4A72C]/20 bg-[#170204]">
                        <img src={item.imageUrl} alt={displayTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}

                    <h3 className={`text-base font-bold text-[#5A0F16] group-hover:text-[#E87516] transition-colors line-clamp-2 ${fontClass}`}>
                      {displayTitle}
                    </h3>

                    <p className={`text-xs sm:text-sm text-[#2A1710]/75 line-clamp-3 leading-relaxed ${fontClass}`}>
                      {displayContent}
                    </p>
                  </div>

                  <div className={`flex items-center gap-1 text-xs font-bold text-[#E87516] mt-4 pt-3 border-t border-[#D4A72C]/15 group-hover:translate-x-1 transition-transform ${fontClass}`}>
                    <span>Read Announcement</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#FFF7E8] border-2 border-[#D4A72C] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 text-left">
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#5A0F16] text-[#F4B942] flex items-center justify-center hover:bg-[#32070B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E87516]" />
              <span className={`text-xs font-bold tracking-wider text-[#5A0F16] uppercase ${fontClass}`}>
                {t.announcements.modalTag}
              </span>
            </div>

            {selectedAnnouncement.imageUrl && (
              <div className="rounded-xl overflow-hidden max-h-48 border border-[#D4A72C]/30 bg-[#170204]">
                <img src={selectedAnnouncement.imageUrl} alt={getLocalizedText(selectedAnnouncement, 'title', language)} className="w-full h-full object-cover" />
              </div>
            )}

            <h3 className={`text-xl font-bold text-[#5A0F16] ${fontClass}`}>
              {getLocalizedText(selectedAnnouncement, 'title', language)}
            </h3>

            <div className="flex items-center gap-4 text-xs text-[#2A1710]/60 pb-2 border-b border-[#D4A72C]/20">
              <span>{selectedAnnouncement.date}</span>
              <span>•</span>
              <span>{selectedAnnouncement.timeAgo}</span>
            </div>

            <p className={`text-sm text-[#2A1710]/85 leading-relaxed ${fontClass}`}>
              {getLocalizedText(selectedAnnouncement, 'content', language)}
            </p>

            <button
              onClick={() => setSelectedAnnouncement(null)}
              className={`w-full py-2.5 rounded-xl bg-[#5A0F16] text-[#FFF7E8] font-bold text-xs uppercase tracking-wider hover:bg-[#32070B] transition-colors ${fontClass}`}
            >
              {t.announcements.closeBtn}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
