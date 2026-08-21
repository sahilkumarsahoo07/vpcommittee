import React from 'react';
import { ChevronRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="bg-[#FFF7E8] text-[#2A1710] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Story Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E87516] bg-[#5A0F16]/10 px-3.5 py-1 rounded-full border border-[#D4A72C]/30">
                OUR STORY
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#32070B] leading-tight">
                Vighnaharta Puja Committee
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#2A1710]/90 font-medium leading-relaxed">
              <p className="font-cormorant italic text-lg sm:text-xl text-[#5A0F16] font-semibold">
                "A celebration created by the community, for the community."
              </p>
              <p>
                Every year we come together to celebrate Lord Ganesha with devotion, culture, music and togetherness. Founded on the ideals of unity, service, and preserving rich Indian Vedic heritage, Vighnaharta Puja Committee brings families and devotees together to experience the divine presence of Bappa.
              </p>
            </div>

            <div>
              <a
                href="#events"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/50 text-[#FFF7E8] hover:text-[#F4B942] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 transition-all group"
              >
                <span>Our Story</span>
                <ChevronRight className="w-4 h-4 text-[#F4B942] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Circular Framed Lord Ganesha Artwork */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-72 sm:w-96 h-72 sm:h-96 flex items-center justify-center">
              
              {/* Outer Dashed Golden Circle Frame */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4A72C]/60 animate-mandala-slow" />
              
              {/* Inner Decorative Glow & Gold Border */}
              <div className="w-[88%] h-[88%] rounded-full p-2.5 bg-gradient-to-tr from-[#D4A72C] via-[#F4B942] to-[#E87516] shadow-2xl relative group">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#FFF7E8] bg-[#32070B]">
                  <img
                    src="/assets/circular-ganesha.png"
                    alt="Vighnaharta Lord Ganesha Story Artwork"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Small Om Badge on Ring */}
                <div className="absolute -bottom-2 right-6 w-10 h-10 rounded-full bg-[#32070B] border-2 border-[#D4A72C] text-[#F4B942] flex items-center justify-center font-bold text-sm shadow-xl">
                  ॐ
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
