import React from 'react';
import { Sparkles, Heart, ChevronDown } from 'lucide-react';
import { GarlandDivider } from '../components/DevotionalIcons';

interface HeroSectionProps {
  onOpenDonate: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDonate }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] md:min-h-screen pt-28 pb-20 md:pb-28 overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#2A1710] via-[#32070B] to-[#5A0F16]">
      {/* Background Decorative Gold Light Rays & Flares */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F4B942]/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#E87516]/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        {/* Subtle Arch Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4A72C_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      {/* Main Hero Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Devotional Titles & Action Buttons */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top Devanagari Blessing Tagline */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#5A0F16]/80 border border-[#D4A72C]/40 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#F4B942] animate-ping" />
              <span className="font-devanagari text-[#F4B942] font-bold tracking-wider text-base md:text-lg">
                ॥ श्री गणेशाय नमः ॥
              </span>
            </div>

            {/* Main Header Title */}
            <div className="space-y-2">
              <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-gold-shine leading-tight uppercase">
                VIGHNAHARTA
              </h1>
              <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-widest text-[#FFF7E8] leading-tight uppercase">
                PUJA COMMITTEE
              </h2>
            </div>

            {/* Devanagari Callout: Ganpati Bappa Morya */}
            <div className="py-2">
              <div className="inline-block relative">
                <span className="font-devanagari text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F4B942] via-[#E87516] to-[#FFF7E8] drop-shadow-md">
                  गणपती बप्पा मोरया!
                </span>
                <div className="h-[2px] w-full bg-gradient-to-r from-[#F4B942] via-[#E87516] to-transparent mt-1" />
              </div>
            </div>

            {/* Tagline */}
            <p className="font-cormorant italic text-xl md:text-2xl text-[#FFF7E8]/90 tracking-wide font-medium">
              Celebrating Faith, Unity & Tradition
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#events"
                className="px-8 py-3.5 rounded-xl font-bold text-sm md:text-base uppercase tracking-wider bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] shadow-xl hover:shadow-[#F4B942]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
              >
                <span>Explore Celebration</span>
                <Sparkles className="w-4 h-4 text-[#32070B] group-hover:rotate-45 transition-transform" />
              </a>

              <button
                onClick={onOpenDonate}
                className="px-8 py-3.5 rounded-xl font-bold text-sm md:text-base uppercase tracking-wider bg-[#32070B]/80 hover:bg-[#5A0F16] border-2 border-[#D4A72C] text-[#FFF7E8] hover:border-[#F4B942] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 backdrop-blur-md group"
              >
                <Heart className="w-4 h-4 text-[#F4B942] group-hover:scale-125 transition-transform fill-current" />
                <span>Donate Now</span>
              </button>
            </div>
          </div>

          {/* Right Column: Seated Lord Ganesha Idol Display */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Glowing Golden Aura Disk Background */}
            <div className="absolute w-[280px] sm:w-[380px] md:w-[450px] h-[280px] sm:h-[380px] md:h-[450px] rounded-full bg-gradient-to-tr from-[#E87516]/40 via-[#F4B942]/30 to-[#5A0F16]/20 blur-2xl animate-pulse-glow pointer-events-none" />
            
            {/* Main Lord Ganesha Artwork Container */}
            <div className="relative z-10 group">
              <div className="relative rounded-3xl overflow-hidden p-2 border-2 border-[#D4A72C]/40 bg-gradient-to-b from-[#5A0F16]/60 to-[#2A1710]/90 backdrop-blur-md shadow-2xl">
                <img
                  src="/assets/main-ganesha.png"
                  alt="Lord Ganesha Idol - Vighnaharta Puja Committee"
                  className="w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] h-auto object-contain rounded-2xl group-hover:scale-102 transition-transform duration-700 filter drop-shadow-2xl"
                />
              </div>

              {/* Decorative Marigold & Om Floating Badges */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-[#D4A72C] border-2 border-[#FFF7E8] flex items-center justify-center text-[#32070B] font-bold text-xs shadow-lg animate-float">
                ॐ
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-1.5 rounded-full bg-[#5A0F16] border border-[#F4B942] text-[#F4B942] text-xs font-devanagari font-bold shadow-lg">
                ॥ ॐ गं गणपतये नमः ॥
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Bottom Marigold Garland */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 my-4 opacity-80">
        <GarlandDivider />
      </div>

      {/* Smooth Curved Cream Divider Transition (Matching Reference Image) */}
      <div className="relative w-full leading-none z-20 -mb-1 bg-[#FFF7E8]">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 md:h-20 text-[#FFF7E8] block"
        >
          <path
            d="M0,32 C320,96 720,120 1440,32 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
        <a
          href="#countdown"
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#D4A72C] text-[#32070B] flex items-center justify-center shadow-lg border-2 border-[#FFF7E8] hover:scale-110 transition-transform cursor-pointer"
          aria-label="Scroll to Countdown"
        >
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
