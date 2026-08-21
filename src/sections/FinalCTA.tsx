import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { OmIcon, DiyaIcon } from '../components/DevotionalIcons';

interface FinalCTAProps {
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenDonate, onOpenVolunteer }) => {
  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#32070B] via-[#5A0F16] to-[#2A1710] text-[#FFF7E8] overflow-hidden text-center">
      {/* Background Mandala Watermark & Floating Diyas */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15">
        <div className="w-[600px] h-[600px] rounded-full border-4 border-dashed border-[#F4B942] animate-mandala-slow" />
      </div>

      {/* Floating Diya Icons */}
      <div className="absolute top-12 left-10 hidden md:block opacity-80">
        <DiyaIcon className="w-12 h-12 animate-float" />
      </div>
      <div className="absolute bottom-12 right-10 hidden md:block opacity-80">
        <DiyaIcon className="w-12 h-12 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {/* Om Emblem Badge */}
        <div className="w-16 h-16 rounded-full bg-[#5A0F16] border-2 border-[#F4B942] text-[#F4B942] flex items-center justify-center mx-auto shadow-2xl">
          <OmIcon className="w-10 h-10 animate-pulse" />
        </div>

        {/* Main Heading */}
        <div className="space-y-3">
          <h2 className="font-devanagari text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF7E8] via-[#F4B942] to-[#E87516] tracking-wide">
            GANPATI BAPPA MORYA 🙏
          </h2>
          <p className="font-cormorant italic text-2xl sm:text-3xl text-[#FFF7E8]/90 font-medium">
            Let us celebrate together in devotion, unity and joy.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <button
            onClick={onOpenVolunteer}
            className="px-8 py-4 rounded-xl font-bold text-sm md:text-base uppercase tracking-wider bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>Join Celebration</span>
            <Sparkles className="w-4 h-4 text-[#32070B]" />
          </button>

          <button
            onClick={() => onOpenDonate()}
            className="px-8 py-4 rounded-xl font-bold text-sm md:text-base uppercase tracking-wider bg-[#32070B]/90 border-2 border-[#D4A72C] text-[#FFF7E8] hover:border-[#F4B942] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 backdrop-blur-md"
          >
            <Heart className="w-4 h-4 text-[#F4B942] fill-current" />
            <span>Support Festival</span>
          </button>
        </div>
      </div>
    </section>
  );
};
