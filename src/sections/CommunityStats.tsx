import React, { useState, useEffect, useRef } from 'react';
import { Award, Users, HeartHandshake, Sparkles } from 'lucide-react';
import { COMMUNITY_STATS } from '../data/mockData';

export const CommunityStats: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 0,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          COMMUNITY_STATS.forEach((stat) => {
            const duration = 2000;
            const steps = 40;
            const stepTime = duration / steps;
            const increment = stat.value / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setCounts((prev) => ({ ...prev, [stat.id]: Math.floor(current) }));
            }, stepTime);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Award': return Award;
      case 'Users': return Users;
      case 'HeartHandshake': return HeartHandshake;
      default: return Sparkles;
    }
  };

  return (
    <div ref={sectionRef} className="bg-[#FFF7E8] text-[#2A1710] py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/20">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E87516] bg-[#5A0F16]/10 px-3.5 py-1 rounded-full border border-[#D4A72C]/30">
            TOGETHER IN DEVOTION
          </span>
          <h3 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#5A0F16]">
            OUR COMMUNITY
          </h3>
        </div>

        {/* 4 Stat Badges Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {COMMUNITY_STATS.map((stat) => {
            const IconComp = getIcon(stat.iconName);
            const currentVal = counts[stat.id] !== undefined ? counts[stat.id] : stat.value;

            return (
              <div
                key={stat.id}
                className="bg-[#FFFDF7] border-2 border-[#D4A72C]/40 rounded-2xl p-5 sm:p-6 text-center shadow-lg hover:border-[#5A0F16] hover:scale-105 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#5A0F16] text-[#F4B942] flex items-center justify-center mx-auto mb-3 shadow-md group-hover:rotate-12 transition-transform">
                  <IconComp className="w-6 h-6" />
                </div>

                <div className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-[#5A0F16] tracking-tight">
                  {currentVal}
                  <span className="text-[#E87516]">{stat.suffix}</span>
                </div>

                <p className="font-sans text-xs sm:text-sm font-bold text-[#2A1710]/80 mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
