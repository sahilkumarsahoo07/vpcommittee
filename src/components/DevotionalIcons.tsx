import React from 'react';

export const OmIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M48.5 22.1c4.2 0 7.8 1.4 10.7 4.1 2.9 2.7 4.4 6.2 4.4 10.5 0 3.8-1.2 7.1-3.6 9.8-2.4 2.7-5.5 4.5-9.3 5.4 5.3 1.3 9.4 3.9 12.3 7.8 2.9 3.9 4.3 8.6 4.3 14.1 0 6.6-2.4 12.1-7.1 16.5-4.7 4.4-10.7 6.6-18 6.6-6.2 0-11.7-1.7-16.5-5-4.8-3.3-7.9-7.8-9.4-13.5l10.8-3.2c1 3.5 2.8 6.2 5.5 8.1 2.7 1.9 5.8 2.8 9.4 2.8 4.2 0 7.6-1.2 10.3-3.7 2.7-2.5 4-5.7 4-9.6 0-4-1.4-7.2-4.1-9.6-2.7-2.4-6.3-3.6-10.7-3.6h-4.8v-9.5h5.1c3.7 0 6.8-1 9.3-3 2.5-2 3.7-4.6 3.7-7.8 0-2.8-1-5-2.9-6.8-1.9-1.8-4.3-2.7-7.2-2.7-3 0-5.4.9-7.3 2.7-1.9 1.8-3.1 4.2-3.6 7.2l-10.8-2.4c1.1-5.4 3.9-9.7 8.4-12.9 4.5-3.2 9.9-4.8 16.2-4.8zm-1.8-17.1c3.3 0 6.2.7 8.8 2 2.6 1.3 4.6 3.2 6.1 5.6l-7.7 5.4c-1.8-2.6-4-3.9-6.7-3.9-2.1 0-3.8.7-5.2 2-1.4 1.3-2.1 3-2.1 5.1h-9.8c0-4.6 1.7-8.5 5-11.7 3.4-3.2 7.3-4.5 11.6-4.5zm25.9 8.2c1.7 0 3.1.6 4.3 1.8 1.2 1.2 1.8 2.6 1.8 4.3 0 1.7-.6 3.1-1.8 4.3-1.2 1.2-2.6 1.8-4.3 1.8-1.7 0-3.1-.6-4.3-1.8-1.2-1.2-1.8-2.6-1.8-4.3 0-1.7.6-3.1 1.8-4.3 1.2-1.2 2.6-1.8 4.3-1.8z"/>
  </svg>
);

export const DiyaIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "w-6 h-6", style }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    {/* Flame */}
    <path d="M50 10C50 10 38 30 38 42C38 49 43.3 54 50 54C56.7 54 62 49 62 42C62 30 50 10 50 10Z" fill="url(#flameGradient)" className="animate-flame" />
    <path d="M50 22C50 22 43 34 43 42C43 46 46 49 50 49C54 49 57 46 57 42C57 34 50 22 50 22Z" fill="#FFF7E8" />
    {/* Diya Base */}
    <path d="M20 58C20 58 15 78 50 78C85 78 80 58 80 58H20Z" fill="url(#diyaBaseGrad)" stroke="#F4B942" strokeWidth="2"/>
    <path d="M15 58C15 56 20 54 50 54C80 54 85 56 85 58C85 60 80 62 50 62C20 62 15 60 15 58Z" fill="#D4A72C" stroke="#FFF7E8" strokeWidth="1"/>
    {/* Stand */}
    <path d="M44 78H56V88H44V78Z" fill="#D4A72C"/>
    <path d="M30 88H70V94H30V88Z" fill="url(#diyaBaseGrad)" stroke="#F4B942" strokeWidth="1"/>
    <defs>
      <radialGradient id="flameGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF7E8" />
        <stop offset="40%" stopColor="#F4B942" />
        <stop offset="80%" stopColor="#E87516" />
        <stop offset="100%" stopColor="#5A0F16" />
      </radialGradient>
      <linearGradient id="diyaBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F4B942" />
        <stop offset="50%" stopColor="#D4A72C" />
        <stop offset="100%" stopColor="#5A0F16" />
      </linearGradient>
    </defs>
  </svg>
);

export const LotusIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 15C50 15 62 38 62 55C62 70 50 82 50 82C50 82 38 70 38 55C38 38 50 15 50 15Z" opacity="0.95"/>
    <path d="M50 30C50 30 70 45 74 62C78 78 62 85 62 85C62 85 54 75 50 65C46 75 38 85 38 85C38 85 22 78 26 62C30 45 50 30 50 30Z" opacity="0.85"/>
    <path d="M50 45C50 45 82 58 88 72C94 85 75 92 75 92C75 92 64 82 50 75C36 82 25 92 25 92C25 92 6 85 12 72C18 58 50 45 50 45Z" opacity="0.7"/>
  </svg>
);

export const KalashIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Coconut */}
    <path d="M50 12C42 22 42 32 50 36C58 32 58 22 50 12Z" fill="#2A1710" stroke="#D4A72C" strokeWidth="2"/>
    {/* Mango Leaves */}
    <path d="M30 35C40 28 50 36 50 36C50 36 36 42 30 35Z" fill="#E87516" />
    <path d="M70 35C60 28 50 36 50 36C50 36 64 42 70 35Z" fill="#E87516" />
    {/* Kalash Pot */}
    <path d="M34 38H66L70 45H30L34 38Z" fill="#D4A72C" />
    <path d="M26 45C26 45 18 68 50 84C82 68 74 45 74 45H26Z" fill="url(#kalashGrad)" stroke="#F4B942" strokeWidth="2"/>
    <circle cx="50" cy="62" r="8" fill="#5A0F16" stroke="#F4B942" strokeWidth="1.5"/>
    {/* Swastik / Om inside Kalash */}
    <path d="M50 56V68M44 62H56" stroke="#F4B942" strokeWidth="2"/>
    <defs>
      <linearGradient id="kalashGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F4B942" />
        <stop offset="50%" stopColor="#D4A72C" />
        <stop offset="100%" stopColor="#5A0F16" />
      </linearGradient>
    </defs>
  </svg>
);

export const BellIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 10V22M50 22C35 22 30 35 30 55C30 65 24 72 18 76H82C76 72 70 65 70 55C70 35 65 22 50 22Z" fill="url(#bellGrad)" stroke="#FFF7E8" strokeWidth="2"/>
    <circle cx="50" cy="84" r="8" fill="#F4B942" stroke="#2A1710" strokeWidth="2"/>
    <defs>
      <linearGradient id="bellGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F4B942" />
        <stop offset="100%" stopColor="#D4A72C" />
      </linearGradient>
    </defs>
  </svg>
);

export const FloralLineDivider: React.FC<{ className?: string }> = ({ className = "w-full my-4" }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4A72C]/40 to-[#D4A72C]"></div>
    <div className="text-[#D4A72C] flex items-center gap-1.5">
      <span className="text-xs">❖</span>
      <OmIcon className="w-5 h-5 text-[#F4B942]" />
      <span className="text-xs">❖</span>
    </div>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4A72C]/40 to-[#D4A72C]"></div>
  </div>
);

export const GarlandDivider: React.FC<{ className?: string }> = ({ className = "w-full" }) => (
  <div className={`flex justify-center items-center gap-2 overflow-hidden py-1 ${className}`}>
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#E87516] to-[#F4B942] shadow-sm animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
        <div className="w-2 h-2 rounded-full bg-[#FFF7E8]" />
      </div>
    ))}
  </div>
);
