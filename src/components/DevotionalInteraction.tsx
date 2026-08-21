import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { OmIcon } from './DevotionalIcons';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const DevotionalInteraction: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  const triggerChant = () => {
    // Devotional Confetti Colors (Maroon, Saffron, Gold)
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.85 },
      colors: ['#F4B942', '#E87516', '#D4A72C', '#5A0F16', '#FFDF00'],
      shapes: ['star', 'circle'],
      scalar: 1.1,
    });

    setToastMessage(t.devotional.toastMsg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <>
      {/* Floating Devotional Chant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={triggerChant}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-[#5A0F16] via-[#32070B] to-[#5A0F16] border-2 border-[#F4B942] text-[#F4B942] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-2xl hover:scale-110 active:scale-95 transition-all group drop-shadow-[0_4px_15px_rgba(244,185,66,0.3)] ${fontClass}`}
        >
          <OmIcon className="w-5 h-5 text-[#F4B942] group-hover:rotate-12 transition-transform" />
          <span>{t.devotional.chantBtn}</span>
          <Sparkles className="w-4 h-4 text-[#F4B942] animate-pulse" />
        </button>
      </div>

      {/* Devotional Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm bg-[#32070B] border-2 border-[#F4B942] rounded-2xl p-4 shadow-2xl text-left animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#5A0F16] border border-[#F4B942] text-[#F4B942] flex items-center justify-center flex-shrink-0">
              <OmIcon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-bold text-[#F4B942] uppercase tracking-wider ${fontClass}`}>
                {t.devotional.toastShloka}
              </p>
              <p className={`text-xs text-[#FFF7E8]/90 font-medium mt-1 leading-relaxed ${fontClass}`}>
                {toastMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
