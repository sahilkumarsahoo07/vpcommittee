import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, AlertTriangle, Sparkles, EyeOff } from 'lucide-react';
import { publicAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { getLocalizedText } from '../utils/translationHelper';

interface PopupAnnouncement {
  id: string;
  title: string;
  content: string;
  title_hi?: string;
  content_hi?: string;
  title_or?: string;
  content_or?: string;
  category: string;
  priority: string;
  imageUrl?: string;
  showPopup: boolean;
  popupDurationDays: number;
  popupUntil?: string;
  publishDate?: string;
}

export const AnnouncementPopup: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  const [activePopup, setActivePopup] = useState<PopupAnnouncement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAnnouncements = async () => {
      try {
        const res = await publicAPI.getAnnouncements();
        if (res.success && Array.isArray(res.data)) {
          const popups = res.data.filter((item: any) => {
            const hasPopupFlag = item.showPopup === true || item.priority === 'URGENT';
            if (!hasPopupFlag) return false;

            const id = item._id || item.id;
            const dismissed = localStorage.getItem(`dismissed_popup_${id}`);
            if (dismissed) {
              const dismissTime = parseInt(dismissed, 10);
              if (Date.now() - dismissTime < 24 * 60 * 60 * 1000) {
                return false;
              }
            }

            if (item.popupUntil) {
              const expiry = new Date(item.popupUntil).getTime();
              if (Date.now() > expiry) return false;
            } else if (item.publishDate && item.popupDurationDays) {
              const pubTime = new Date(item.publishDate).getTime();
              const maxDuration = item.popupDurationDays * 24 * 60 * 60 * 1000;
              if (Date.now() - pubTime > maxDuration) return false;
            }

            return true;
          });

          if (popups.length > 0) {
            const latest = popups[0];
            setActivePopup({
              id: latest._id || latest.id,
              title: latest.title,
              content: latest.content || latest.description || '',
              title_hi: latest.title_hi,
              content_hi: latest.content_hi || latest.description_hi,
              title_or: latest.title_or,
              content_or: latest.content_or || latest.description_or,
              category: latest.category || 'General',
              priority: latest.priority || 'HIGH',
              imageUrl: latest.imageUrl || latest.image || '',
              showPopup: true,
              popupDurationDays: latest.popupDurationDays || 3,
              popupUntil: latest.popupUntil,
              publishDate: latest.publishDate,
            });
            setTimeout(() => setIsVisible(true), 600);
          }
        }
      } catch (err) {
        console.error('Failed to load popup announcements:', err);
      }
    };

    checkAnnouncements();
  }, []);

  if (!activePopup || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDontShowAgain = () => {
    if (activePopup) {
      localStorage.setItem(`dismissed_popup_${activePopup.id}`, Date.now().toString());
    }
    setIsVisible(false);
  };

  // Multi-Language Title & Content Selection
  const getLocalizedTitle = () => {
    return getLocalizedText(activePopup, 'title', language);
  };

  const getLocalizedContent = () => {
    return getLocalizedText(activePopup, 'content', language);
  };

  const getCreatedTimeAgo = () => {
    if (!activePopup.publishDate) return t.announcements.postedJustNow;
    const pub = new Date(activePopup.publishDate).getTime();
    const diffHours = Math.floor((Date.now() - pub) / (1000 * 60 * 60));
    if (diffHours < 1) return t.announcements.postedJustNow;
    if (diffHours < 24) return `${diffHours} ${t.announcements.postedHoursAgo}`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ${t.announcements.postedDaysAgo}`;
  };

  const categoryName = t.announcements.categories[activePopup.category] || activePopup.category;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#240407] via-[#32070B] to-[#170204] border-2 border-[#F4B942] rounded-3xl p-6 sm:p-7 shadow-2xl text-[#FFF7E8] space-y-5 overflow-hidden transform transition-transform duration-300 scale-100">
        
        {/* Top Decorative Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4A72C] via-[#F4B942] to-[#E87516]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#5A0F16] text-[#F4B942] hover:bg-[#F4B942] hover:text-[#32070B] border border-[#F4B942]/60 flex items-center justify-center transition-all shadow-md group z-10"
          title={t.announcements.closeBtn}
        >
          <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Header Badges */}
        <div className="flex items-center flex-wrap gap-2 pr-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A0F16] border border-[#F4B942] text-[#F4B942] text-[11px] font-black uppercase tracking-widest shadow-sm">
            <Bell className="w-3.5 h-3.5 text-[#E87516] animate-bounce" />
            <span className={fontClass}>{t.announcements.modalTag || 'Important Announcement'}</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E87516]/20 border border-[#E87516]/60 text-[#F4B942] text-[10px] font-extrabold uppercase">
            <AlertTriangle className="w-3 h-3 text-[#E87516]" />
            <span className={fontClass}>{categoryName}</span>
          </div>
        </div>

        {/* Optional Image Display */}
        {activePopup.imageUrl && (
          <div className="rounded-2xl overflow-hidden border-2 border-[#D4A72C]/40 shadow-lg max-h-56 bg-[#170204] relative group">
            <img
              src={activePopup.imageUrl}
              alt={getLocalizedTitle()}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#240407]/80 via-transparent to-transparent" />
          </div>
        )}

        {/* Content Body */}
        <div className="space-y-3">
          <h3 className={`text-xl sm:text-2xl font-black text-[#F4B942] leading-tight tracking-wide ${fontClass}`}>
            {getLocalizedTitle()}
          </h3>

          <p className={`text-xs sm:text-sm text-[#FFF7E8]/90 leading-relaxed font-medium bg-[#170204]/60 p-3.5 rounded-2xl border border-[#D4A72C]/20 max-h-40 overflow-y-auto ${fontClass}`}>
            {getLocalizedContent()}
          </p>
        </div>

        {/* Time Info & Expiry Indicator */}
        <div className="flex items-center justify-between text-[11px] text-[#FFF7E8]/70 border-t border-[#D4A72C]/30 pt-3">
          <div className={`flex items-center gap-1.5 font-semibold text-[#D4A72C] ${fontClass}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{getCreatedTimeAgo()}</span>
          </div>

          <div className={`flex items-center gap-1 text-[#E87516] font-bold ${fontClass}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activePopup.popupDurationDays} {t.announcements.days} {t.announcements.activeFor}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            onClick={handleClose}
            className={`w-full sm:flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#5A0F16] to-[#32070B] text-[#FFF7E8] font-black text-xs uppercase tracking-wider border border-[#F4B942] hover:bg-[#F4B942] hover:text-[#32070B] transition-all shadow-md ${fontClass}`}
          >
            {t.announcements.closeBtn || 'Close'}
          </button>

          <button
            onClick={handleDontShowAgain}
            className={`w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#170204] border border-[#D4A72C]/30 text-[#FFF7E8]/70 hover:text-[#FFF7E8] font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-colors ${fontClass}`}
            title="Dismiss popup for 24 hours"
          >
            <EyeOff className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>{t.announcements.dontShowAgain || "Don't show again today"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
