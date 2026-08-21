import React, { useState, useEffect } from 'react';

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 8,
    hours: 14,
    minutes: 32,
    seconds: 18,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 8);
    targetDate.setHours(targetDate.getHours() + 14);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section id="countdown" className="bg-[#FFF7E8] text-[#2A1710] py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Title */}
        <div className="space-y-2">
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#32070B] tracking-wider uppercase">
            GANESH UTSAV 2026
          </h2>
          <div className="flex items-center justify-center gap-3 text-[#D4A72C]">
            <div className="h-[1px] w-16 bg-[#D4A72C]/40" />
            <span className="text-xs">❖ ॐ ❖</span>
            <div className="h-[1px] w-16 bg-[#D4A72C]/40" />
          </div>
        </div>

        {/* 4 Dark Maroon Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2 max-w-3xl mx-auto">
          {[
            { label: 'DAYS', value: formatNumber(timeLeft.days) },
            { label: 'HOURS', value: formatNumber(timeLeft.hours) },
            { label: 'MINUTES', value: formatNumber(timeLeft.minutes) },
            { label: 'SECONDS', value: formatNumber(timeLeft.seconds) },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#2A1710] border border-[#D4A72C]/50 rounded-2xl p-5 sm:p-6 text-center shadow-xl relative overflow-hidden group hover:border-[#F4B942] transition-all"
            >
              {/* Top Small Om Icon */}
              <div className="w-6 h-6 rounded-full bg-[#5A0F16] border border-[#D4A72C]/40 text-[#F4B942] flex items-center justify-center mx-auto mb-2 text-[10px] font-bold">
                ॐ
              </div>

              {/* Number */}
              <div className="font-cinzel text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFF7E8] via-[#F4B942] to-[#D4A72C] tracking-tight">
                {item.value}
              </div>

              {/* Label */}
              <div className="font-sans text-[11px] sm:text-xs font-bold text-[#F4B942] uppercase tracking-widest mt-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
