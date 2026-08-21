import React, { useState, useEffect } from 'react';
import { FloralLineDivider, OmIcon } from './DevotionalIcons';

export const CountdownTimer: React.FC = () => {
  // Target Date: Ganesh Chaturthi 2026 (Aug 25, 2026 08:00:00)
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
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const cards = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <section id="countdown" className="bg-[#FFF7E8] text-[#2A1710] py-12 md:py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Watermark Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4A72C_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {/* Title Heading */}
        <h3 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest text-[#5A0F16] uppercase">
          GANESH UTSAV 2026
        </h3>
        
        <div className="max-w-md mx-auto my-3">
          <FloralLineDivider />
        </div>

        {/* 4 Countdown Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8 max-w-4xl mx-auto">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group relative bg-[#32070B] border-2 border-[#D4A72C] rounded-2xl p-4 sm:p-6 text-center shadow-xl hover:border-[#F4B942] hover:scale-105 transition-all duration-300 flex flex-col items-center justify-between"
            >
              {/* Top Decorative Icon */}
              <div className="w-8 h-8 rounded-full bg-[#5A0F16] border border-[#D4A72C]/50 flex items-center justify-center text-[#F4B942] mb-2 group-hover:rotate-12 transition-transform">
                <OmIcon className="w-4 h-4" />
              </div>

              {/* Number Value */}
              <span className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-black text-[#F4B942] tracking-wider leading-none my-1">
                {card.value}
              </span>

              {/* Unit Label */}
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-widest text-[#FFF7E8]/80 uppercase mt-2">
                {card.label}
              </span>

              {/* Subtle Gold Corner Accents */}
              <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#D4A72C]" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#D4A72C]" />
              <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#D4A72C]" />
              <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#D4A72C]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
