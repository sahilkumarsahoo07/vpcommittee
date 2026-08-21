import React from 'react';
import { Camera, HeartHandshake, Users, Bell } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

interface FeatureCardsProps {
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onOpenDonate, onOpenVolunteer }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  const cards = [
    {
      id: 'gallery',
      title: t.featureCards.galleryTitle,
      subtitle: t.featureCards.gallerySubtitle,
      buttonText: t.featureCards.galleryBtn,
      icon: Camera,
      onClick: null as (() => void) | null,
      href: '#gallery',
    },
    {
      id: 'donate-card',
      title: t.featureCards.donateTitle,
      subtitle: t.featureCards.donateSubtitle,
      buttonText: t.featureCards.donateBtn,
      icon: HeartHandshake,
      onClick: onOpenDonate,
      href: '#donate',
    },
    {
      id: 'join',
      title: t.featureCards.joinTitle,
      subtitle: t.featureCards.joinSubtitle,
      buttonText: t.featureCards.joinBtn,
      icon: Users,
      onClick: onOpenVolunteer,
      href: '#volunteer',
    },
    {
      id: 'updates',
      title: t.featureCards.updatesTitle,
      subtitle: t.featureCards.updatesSubtitle,
      buttonText: t.featureCards.updatesBtn,
      icon: Bell,
      onClick: null,
      href: '#announcements',
    },
  ];

  return (
    <section className="relative bg-[#FFF7E8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Dark Maroon Container Box matching User Reference Screenshot */}
        <div className="bg-[#1A0306] rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_15px_40px_rgba(26,3,6,0.3)] border border-[#D4A72C]/40">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {cards.map((card) => {
              const IconComp = card.icon;
              const btnClass =
                `px-3.5 py-1.5 rounded-lg border border-[#D4A72C]/60 bg-[#1F0407] hover:bg-[#5A0F16] text-[#F4B942] hover:text-white text-[11px] sm:text-xs font-bold transition-all duration-200 inline-block shadow-sm ${fontClass}`;

              return (
                <div
                  key={card.id}
                  className="group relative rounded-xl bg-gradient-to-br from-[#3D0A11] via-[#2B060C] to-[#1F0407] border border-[#D4A72C]/30 hover:border-[#D4A72C]/80 p-4 sm:p-5 flex items-center justify-between text-left overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Circular Gold Watermark behind the Right Icon */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-[#D4A72C]/15 pointer-events-none flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border border-dashed border-[#D4A72C]/20" />
                  </div>

                  {/* Left Side: Title, Subtitle & Button */}
                  <div className="flex-1 min-w-0 pr-3 space-y-2 relative z-10">
                    <div>
                      <h4 className={`text-base sm:text-lg font-bold text-[#FFF7E8] leading-tight group-hover:text-[#F4B942] transition-colors ${fontClass}`}>
                        {card.title}
                      </h4>
                      <p className={`text-[11px] sm:text-xs text-[#FFF7E8]/70 font-medium leading-snug mt-1 ${fontClass}`}>
                        {card.subtitle}
                      </p>
                    </div>

                    <div className="pt-1">
                      {card.onClick ? (
                        <button onClick={card.onClick} className={btnClass}>
                          {card.buttonText}
                        </button>
                      ) : (
                        <a href={card.href} className={btnClass}>
                          {card.buttonText}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Large Gold Solid Icon */}
                  <div className="flex-shrink-0 relative z-10 text-[#F4B942] group-hover:scale-110 transition-transform duration-300">
                    <IconComp className="w-10 h-10 sm:w-12 sm:h-12 fill-[#F4B942]/20 stroke-[#F4B942] stroke-[1.8]" />
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
