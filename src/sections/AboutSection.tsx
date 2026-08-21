import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { OmIcon } from '../components/DevotionalIcons';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="bg-[#FFF7E8] text-[#2A1710] py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-[#D4A72C]/20">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Story Button */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E87516] bg-[#5A0F16]/10 px-3.5 py-1 rounded-full border border-[#D4A72C]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OUR STORY</span>
            </div>

            {/* Heading */}
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#5A0F16] leading-tight">
              Vighnaharta Puja Committee
            </h2>

            {/* Subtitle Highlight */}
            <p className="font-cormorant italic text-2xl font-bold text-[#E87516]">
              "A celebration created by the community, for the community."
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-[#2A1710]/90 leading-relaxed font-normal">
              Every year we come together to celebrate Lord Ganesha with devotion, culture, music and togetherness. Founded on the ideals of unity, service, and preserving rich Indian Vedic heritage, Vighnaharta Puja Committee brings families and devotees together to experience the divine presence of Bappa.
            </p>

            {/* Story CTA Button */}
            <div className="pt-2">
              <a
                href="#events"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#5A0F16] hover:bg-[#32070B] border border-[#D4A72C] text-[#FFF7E8] hover:text-[#F4B942] font-bold text-sm tracking-wider uppercase shadow-xl hover:scale-105 transition-all group"
              >
                <span>Our Story</span>
                <ArrowRight className="w-4 h-4 text-[#F4B942] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Circular Ornamental Ganesha Image Artwork */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            
            {/* Spinning Outer Gold Mandala Frame SVG Ring */}
            <div className="absolute w-[320px] sm:w-[420px] md:w-[460px] h-[320px] sm:h-[420px] md:h-[460px] rounded-full border-2 border-dashed border-[#D4A72C]/50 animate-mandala-slow pointer-events-none" />
            
            <div className="absolute w-[340px] sm:w-[440px] md:w-[480px] h-[340px] sm:h-[440px] md:h-[480px] rounded-full border border-dotted border-[#E87516]/40 animate-mandala-reverse pointer-events-none" />

            {/* Circular Image Container */}
            <div className="relative z-10 w-[260px] sm:w-[340px] md:w-[380px] h-[260px] sm:h-[340px] md:h-[380px] rounded-full p-3 bg-gradient-to-tr from-[#D4A72C] via-[#F4B942] to-[#E87516] shadow-2xl group hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#FFF7E8] bg-[#32070B] relative">
                <img
                  src="/assets/circular-ganesha.png"
                  alt="Lord Ganesha Devotional Art"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Floating Om Badge Accent */}
              <div className="absolute -bottom-2 right-4 w-12 h-12 rounded-full bg-[#5A0F16] border-2 border-[#F4B942] text-[#F4B942] flex items-center justify-center shadow-lg font-bold">
                <OmIcon className="w-6 h-6 animate-pulse" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
