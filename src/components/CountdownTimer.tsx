import React, { useState, useEffect } from 'react';
import { OmIcon } from './DevotionalIcons';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const CountdownTimer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const targetDate = new Date('2026-08-25T08:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 8,
    hours: 14,
    minutes: 32,
    seconds: 18,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  const cards = [
    { label: t.countdown.days, value: String(timeLeft.days).padStart(2, '0') },
    { label: t.countdown.hours, value: String(timeLeft.hours).padStart(2, '0') },
    { label: t.countdown.minutes, value: String(timeLeft.minutes).padStart(2, '0') },
    { label: t.countdown.seconds, value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <section id="countdown" className="bg-[#FFF7E8] text-[#2A1710] py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden -mt-1">

      {/* 1bgimage.png Corner Half-Mandala Artwork (Pinned Flush to Screen Edges) */}
      {/* Right Corner Screen Alignment */}
      <img
        src="/assets/1bgimage.png"
        alt="Right Corner Mandala Motif"
        className="absolute -right-4 sm:-right-8 md:-right-34 top-1/2 -translate-y-1/2 h-[120%] max-h-[480px] w-auto pointer-events-none opacity-50 object-right object-contain"
      />

      {/* Left Corner Screen Alignment (Flipped) */}
      <img
        src="/assets/1bgimage.png"
        alt="Left Corner Mandala Motif"
        className="absolute -left-4 sm:-left-8 md:-left-34 top-1/2 -translate-y-1/2 h-[120%] max-h-[480px] w-auto pointer-events-none opacity-50 object-left object-contain scale-x-[-1]"
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Top Live Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5A0F16]/10 border border-[#D4A72C]/40 text-[#5A0F16] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#E87516] animate-ping" />
          <span className={`text-[11px] font-extrabold uppercase tracking-widest ${fontClass}`}>
            ✦ MAHOTSAV COUNTDOWN ✦
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.14em] text-[#3D0B10] uppercase ${fontClass}`}>
          {t.countdown.title}
        </h3>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 max-w-xs sm:max-w-md mx-auto my-3 md:my-5">
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#D4A72C] to-[#D4A72C]" />
          <div className="flex items-center gap-1.5 text-[#D4A72C]">
            <span className="text-xs">❖</span>
            <OmIcon className="w-5 h-5 text-[#D4A72C]" />
            <span className="text-xs">❖</span>
          </div>
          <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#D4A72C] to-[#D4A72C]" />
        </div>

        {/* 4 Royal Mandap 3D Floating Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-8 max-w-4xl mx-auto">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="relative royal-mandap-card rounded-2xl flex flex-col items-center justify-center pt-9 pb-6 px-4 min-h-[150px] sm:min-h-[175px] md:min-h-[190px]"
            >
              {/* Circular top-center badge with double gold ring */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-b from-[#5A0F16] via-[#32070B] to-[#1F0407] border-2 border-[#F4B942] text-[#F4B942] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                <OmIcon className="w-4 h-4 text-[#F4B942]" />
              </div>

              {/* Metallic 3D Gold Number */}
              <span className="royal-gold-number font-cinzel text-4xl sm:text-5xl md:text-[3.5rem] font-black leading-none tracking-wider mt-1">
                {card.value}
              </span>

              {/* Label */}
              <span className={`text-[10px] sm:text-xs font-black tracking-[0.22em] text-[#FFF7E8]/90 uppercase mt-3 sm:mt-4 ${fontClass}`}>
                {card.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
