import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const AboutSection: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  return (
    <section id="about" className="relative bg-[#FBE9CE] text-[#2A1710] py-14 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Multiple bgimage.png Mandalas with contrast(0.5) filter */}
      {/* 1. Left-Side Medium Mandala */}
      {/* <img
        src="/assets/bgimage.png"
        alt="Mandala Background Motif"
        style={{ filter: 'contrast(0.5)' }}
        className="absolute -left-24 top-12 w-80 h-80 pointer-events-none opacity-30 object-contain animate-mandala-slow"
      /> */}

      {/* 2. Left-Side Small Mandala */}
      {/* <img
        src="/assets/bgimage.png"
        alt="Mandala Background Motif"
        style={{ filter: 'contrast(0.5)' }}
        className="absolute left-10 bottom-8 w-44 h-44 pointer-events-none opacity-25 object-contain"
      /> */}

      {/* 3. Right-Side Large Mandala (Watermark behind Ganesha) */}
      {/* <img
        src="/assets/bgimage.png"
        alt="Mandala Background Motif"
        style={{ filter: 'contrast(0.5)' }}
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-[460px] h-[460px] pointer-events-none opacity-40 object-contain animate-mandala-reverse"
      /> */}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left Text Column */}
          <div className="space-y-4 sm:space-y-5 text-left">
            <span className={`inline-block text-xs sm:text-sm font-bold tracking-[0.2em] text-[#7B400B] uppercase ${fontClass}`}>
              {t.about.tag}
            </span>

            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3D0B10] leading-snug ${fontClass}`}>
              {t.about.title}
            </h2>

            <p className={`italic text-lg sm:text-xl font-semibold text-[#8B4513] ${language === 'en' ? 'font-cormorant' : fontClass}`}>
              "{t.about.quote}"
            </p>

            <p className={`text-sm sm:text-base text-[#4A2511] leading-relaxed max-w-xl ${fontClass}`}>
              {t.about.desc}
            </p>

            <div className="pt-2">
              <a
                href="#events"
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#3D0B10] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-[#FFF7E8] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:scale-105 transition-all group ${fontClass}`}
              >
                <span>{t.about.btn}</span>
                <ArrowRight className="w-4 h-4 text-[#F4B942] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Circular Ganesha Image with Spinning bgimage.png Halo Frame */}
          <div className="flex justify-center items-center relative">
            {/* Spinning bgimage.png directly behind Ganesha with contrast(0.5) filter */}
            <img
              src="/assets/bgimage.png"
              alt="Mandala Aura"
              style={{ filter: 'contrast(0.5)' }}
              className="absolute w-[360px] sm:w-[440px] md:w-[480px] h-[360px] sm:h-[440px] md:h-[480px] opacity-45 animate-mandala-slow pointer-events-none object-contain"
            />

            <div className="relative w-[270px] sm:w-[330px] md:w-[370px] h-[270px] sm:h-[330px] md:h-[370px] z-10">
              {/* Outer Decorative Dashed Ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-[#D4A72C]/50 animate-mandala-slow" />

              {/* Main Circular Gold Framed Image */}
              <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-tr from-[#D4A72C] via-[#F4B942] to-[#E87516] shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#FFF7E8] bg-[#32070B]">
                  <img
                    src="/assets/circular-ganesha.png"
                    alt="Lord Ganesha Devotional Art"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
