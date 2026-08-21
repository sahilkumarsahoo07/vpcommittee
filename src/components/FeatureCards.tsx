import React from 'react';
import { Camera, Heart, Users, Bell, ArrowRight } from 'lucide-react';

interface FeatureCardsProps {
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onOpenDonate, onOpenVolunteer }) => {
  const cards = [
    {
      title: 'Gallery',
      subtitle: 'Moments of Devotion',
      buttonText: 'View Gallery',
      href: '#gallery',
      icon: Camera,
      onClick: null,
    },
    {
      title: 'Donate',
      subtitle: 'Support the Celebration',
      buttonText: 'Donate Now',
      href: '#donate',
      icon: Heart,
      onClick: onOpenDonate,
    },
    {
      title: 'Join Us',
      subtitle: 'Be a Part of Our Mission',
      buttonText: 'Join Now',
      href: '#volunteer',
      icon: Users,
      onClick: onOpenVolunteer,
    },
    {
      title: 'Updates',
      subtitle: 'Latest News & Announcements',
      buttonText: 'View All',
      href: '#announcements',
      icon: Bell,
      onClick: null,
    },
  ];

  return (
    <section className="bg-[#32070B] py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-y-2 border-[#D4A72C]/40 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div
                key={idx}
                className="group relative bg-gradient-to-b from-[#5A0F16] to-[#32070B] border border-[#D4A72C]/40 hover:border-[#F4B942] rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between"
              >
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-full bg-[#32070B] border border-[#D4A72C] flex items-center justify-center text-[#F4B942] shadow-inner mb-4 group-hover:scale-110 group-hover:bg-[#5A0F16] transition-all">
                  <IconComp className="w-7 h-7" />
                </div>

                {/* Card Title & Subtitle */}
                <div className="space-y-1 mb-6">
                  <h4 className="font-cinzel text-xl font-bold text-[#FFF7E8] group-hover:text-[#F4B942] transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-[#FFF7E8]/70 font-medium">
                    {card.subtitle}
                  </p>
                </div>

                {/* Button Action */}
                {card.onClick ? (
                  <button
                    onClick={card.onClick}
                    className="w-full py-2.5 rounded-xl bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/50 hover:border-[#F4B942] text-[#F4B942] hover:text-[#FFF7E8] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{card.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <a
                    href={card.href}
                    className="w-full py-2.5 rounded-xl bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/50 hover:border-[#F4B942] text-[#F4B942] hover:text-[#FFF7E8] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{card.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}

                {/* Corner Accent Ornaments */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#D4A72C]/40" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#D4A72C]/40" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
