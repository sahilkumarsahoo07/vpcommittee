import React from 'react';
import { Camera, HeartHandshake, Users, Bell } from 'lucide-react';

interface FeatureCardsProps {
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onOpenDonate, onOpenVolunteer }) => {
  const cards = [
    {
      title: 'Gallery',
      subtitle: 'Moments of Devotion',
      icon: Camera,
      btnText: 'View Gallery',
      action: () => {
        const el = document.getElementById('gallery');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      title: 'Donate',
      subtitle: 'Support the Celebration',
      icon: HeartHandshake,
      btnText: 'Donate Now',
      action: onOpenDonate,
    },
    {
      title: 'Join Us',
      subtitle: 'Be a Part of Our Mission',
      icon: Users,
      btnText: 'Join Now',
      action: onOpenVolunteer,
    },
    {
      title: 'Updates',
      subtitle: 'Latest News & Announcements',
      icon: Bell,
      btnText: 'View All',
      action: () => {
        const el = document.getElementById('announcements');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
  ];

  return (
    <section className="bg-[#1F070A] text-[#FFF7E8] py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-[#2A1710] border border-[#D4A72C]/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:border-[#F4B942] hover:scale-102 transition-all text-left space-y-4 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-[#FFF7E8] group-hover:text-[#F4B942] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#FFF7E8]/70 font-medium mt-1">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#D4A72C]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <button
                  onClick={card.action}
                  className="w-full py-2.5 rounded-xl bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/50 text-[#F4B942] font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  {card.btnText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
