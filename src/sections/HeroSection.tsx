import React from 'react';
import { Heart } from 'lucide-react';

interface HeroSectionProps {
  onOpenDonate: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDonate }) => {
  return (
    <section id="hero" className="relative min-h-[90vh] md:min-h-screen pt-28 pb-16 md:pb-24 overflow-hidden flex flex-col justify-between bg-[#1F070A] text-[#FFF7E8]">
      {/* Subtle Background Temple Lights / Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F4B942]/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#E87516]/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(#D4A72C_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 text-left space-y-5">
            
            {/* Top Devanagari Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#32070B]/80 border border-[#D4A72C]/40 backdrop-blur-md">
              <span className="font-devanagari text-[#F4B942] font-bold tracking-wider text-sm sm:text-base">
                ॥ श्री गणेशाय नमः ॥
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-1">
              <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wider text-[#FFF7E8] leading-tight">
                VIGHNAHARTA
              </h1>
              <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-[#FFF7E8] leading-tight">
                PUJA COMMITTEE
              </h2>
            </div>

            {/* Devanagari Callout */}
            <div>
              <span className="font-devanagari text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F4B942] via-[#E87516] to-[#F4B942]">
                गणपति बप्पा मोरया!
              </span>
            </div>

            {/* Subtitle */}
            <p className="font-cormorant italic text-xl sm:text-2xl text-[#FFF7E8]/90 font-medium">
              Celebrating Faith, Unity & Tradition
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#events"
                className="px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#1F070A] shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Explore Celebration
              </a>

              <button
                onClick={onOpenDonate}
                className="px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-transparent border-2 border-[#D4A72C] text-[#FFF7E8] hover:bg-[#5A0F16]/50 hover:border-[#F4B942] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-[#F4B942]" />
                <span>Donate Now</span>
              </button>
            </div>
          </div>

          {/* Right Column: Lord Ganesha Artwork */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative z-10 w-full max-w-[420px]">
              <img
                src="/assets/main-ganesha.png"
                alt="Lord Ganesha Idol - Vighnaharta Puja Committee"
                className="w-full h-auto object-contain drop-shadow-2xl hover:scale-102 transition-transform duration-700 mx-auto"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Smooth Curved Cream Divider (Exact S-Curve arch transition to cream section) */}
      <div className="relative w-full leading-none z-20 -mb-1 bg-[#FFF7E8]">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 md:h-24 text-[#FFF7E8] block"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C480,100 960,100 1440,0 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};
