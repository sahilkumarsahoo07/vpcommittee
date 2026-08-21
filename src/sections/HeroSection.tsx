import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { DiyaIcon } from '../components/DevotionalIcons';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

interface HeroSectionProps {
  onOpenDonate: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDonate }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  return (
    <section id="hero" className="relative min-h-[92svh] md:min-h-[100svh] overflow-hidden bg-[#260508]">
      {/* Background Banner Image with Dual Vignette & Ambient Glow */}
      <div className="absolute inset-0">
        <img
          src="/assets/bannerimage.png"
          alt="Lord Ganesha - Vighnaharta Puja Committee"
          className="hero-banner-img w-full h-full object-cover"
        />
      </div>

      {/* Decorative Side Diyas with Flame Animations */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-12 pointer-events-none opacity-85">
        <div className="diya-glow-bg animate-float">
          <DiyaIcon className="w-12 h-12 text-[#F4B942]" />
        </div>
        <div className="w-[1px] h-32 bg-gradient-to-b from-[#F4B942]/60 via-[#D4A72C]/30 to-transparent" />
        <div className="diya-glow-bg animate-float" style={{ animationDelay: '1.5s' }}>
          <DiyaIcon className="w-10 h-10 text-[#F4B942]" />
        </div>
      </div>

      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-12 pointer-events-none opacity-85">
        <div className="diya-glow-bg animate-float" style={{ animationDelay: '0.8s' }}>
          <DiyaIcon className="w-12 h-12 text-[#F4B942]" />
        </div>
        <div className="w-[1px] h-32 bg-gradient-to-b from-[#F4B942]/60 via-[#D4A72C]/30 to-transparent" />
        <div className="diya-glow-bg animate-float" style={{ animationDelay: '2.2s' }}>
          <DiyaIcon className="w-10 h-10 text-[#F4B942]" />
        </div>
      </div>

      {/* Hero Main Content Box */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-32 md:pt-36 pb-36 md:pb-44 min-h-[92svh] md:min-h-[100svh] flex items-center">
        <div className="w-full max-w-2xl text-left space-y-6">
          {/* Royal Shloka Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5A0F16]/90 via-[#32070B] to-[#5A0F16]/90 border border-[#F4B942]/60 shadow-[0_0_20px_rgba(244,185,66,0.25)] backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#F4B942] animate-pulse" />
            <span className={`text-[#F4B942] font-bold text-sm sm:text-base tracking-widest ${fontClass}`}>
              {t.hero.shloka}
            </span>
            <Sparkles className="w-4 h-4 text-[#F4B942] animate-pulse" />
          </div>

          {/* Main Title */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.04em] text-[#FFF7E8] leading-[1.15] uppercase hero-title-glow drop-shadow-2xl ${language === 'hi' || language === 'or' ? fontClass : 'font-cinzel'}`}>
            {t.hero.titleLine1}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF7E8] via-[#F4B942] to-[#D4A72C]">
              {t.hero.titleLine2}
            </span>
          </h1>

          {/* Slogan */}
          <p className={`text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F4B942] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] ${fontClass}`}>
            {t.hero.slogan}
          </p>

          {/* Subtitle */}
          <p className={`italic text-lg sm:text-xl md:text-2xl text-[#FFF7E8]/90 tracking-wide font-medium max-w-xl leading-relaxed ${language === 'en' ? 'font-cormorant' : fontClass}`}>
            {t.hero.subtitle}
          </p>

          {/* Luxury CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <a
              href="#events"
              className={`btn-gold-premium px-8 py-4 rounded-xl font-extrabold text-sm uppercase tracking-[0.12em] text-[#32070B] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 ${fontClass}`}
            >
              <span>{t.hero.exploreBtn}</span>
              <span className="text-lg">❖</span>
            </a>

            <button
              onClick={onOpenDonate}
              className={`btn-outline-premium px-8 py-4 rounded-xl font-extrabold text-sm uppercase tracking-[0.12em] bg-[#32070B]/85 backdrop-blur-md border-2 border-[#F4B942] text-[#FFF7E8] hover:border-[#FFF7E8] hover:bg-[#5A0F16] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 shadow-xl ${fontClass}`}
            >
              <Heart className="w-4 h-4 text-[#F4B942] fill-[#F4B942] animate-pulse" />
              {t.hero.donateBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Royal Temple Arch Garland Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 z-20 leading-none">
        <svg
          viewBox="0 0 1440 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[85px] sm:h-[110px] md:h-[135px] block"
          preserveAspectRatio="none"
        >
          {/* Main Cream Section Background Fill */}
          <path
            d="M 0,35 C 220,105 380,105 560,45 C 760,-15 1040,105 1440,35 L 1440,140 L 0,140 Z"
            fill="#FFF7E8"
          />
          {/* Outer Deep Royal Brown Wave Border */}
          <path
            d="M 0,35 C 220,105 380,105 560,45 C 760,-15 1040,105 1440,35"
            stroke="#7B400B"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          {/* Glowing Inner Gold Foil Line */}
          <path
            d="M 0,35 C 220,105 380,105 560,45 C 760,-15 1040,105 1440,35"
            stroke="#F4B942"
            strokeWidth="2.5"
            strokeOpacity="0.9"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
};
