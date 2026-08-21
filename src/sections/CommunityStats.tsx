import React, { useState, useEffect, useRef } from 'react';
import { Award, Users, HeartHandshake, Sparkles } from 'lucide-react';
import { OmIcon } from '../components/DevotionalIcons';
import { publicAPI } from '../services/api';

export const CommunityStats: React.FC = () => {
  const [statsItems, setStatsItems] = useState([
    { id: 's1', value: 12, suffix: '+', iconName: 'Award', label: 'Years of Celebration' },
    { id: 's2', value: 50, suffix: 'K+', iconName: 'Users', label: 'Annual Devotees' },
    { id: 's3', value: 25, suffix: '+', iconName: 'HeartHandshake', label: 'Cultural Events' },
    { id: 's4', value: 100, suffix: '+', iconName: 'Sparkles', label: 'Active Volunteers' },
  ]);

  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 0,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await publicAPI.getSettings();
        if (res.success && res.data) {
          const s = res.data;
          const y = Number(s.yearsOfCelebration) || 12;
          const rawDevotees = String(s.annualDevotees || '50K');
          const dVal = parseInt(rawDevotees) || 50;
          const dSuffix = rawDevotees.replace(/[0-9]/g, '') || '+';
          const a = Number(s.communityActivities) || 25;
          const v = Number(s.activeVolunteers) || 100;

          setStatsItems([
            { id: 's1', value: y, suffix: '+', iconName: 'Award', label: 'Years of Celebration' },
            { id: 's2', value: dVal, suffix: dSuffix, iconName: 'Users', label: 'Annual Devotees' },
            { id: 's3', value: a, suffix: '+', iconName: 'HeartHandshake', label: 'Cultural Events' },
            { id: 's4', value: v, suffix: '+', iconName: 'Sparkles', label: 'Active Volunteers' },
          ]);
        }
      } catch {}
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          statsItems.forEach((stat) => {
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
  }, [hasAnimated, statsItems]);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Award': return Award;
      case 'Users': return Users;
      case 'HeartHandshake': return HeartHandshake;
      default: return Sparkles;
    }
  };

  return (
    <div ref={sectionRef} className="relative bg-[#FFF7E8] text-[#2A1710] py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* 3rdbgimage.png Golden Lotus Corner Artworks */}
      <img
        src="/assets/3rdbgimage.png"
        alt="Golden Lotus Left Corner"
        className="absolute left-0 bottom-0 w-64 sm:w-80 md:w-[420px] pointer-events-none opacity-30 object-contain mix-blend-multiply"
      />
      <img
        src="/assets/3rdbgimage.png"
        alt="Golden Lotus Right Corner"
        className="absolute right-0 top-0 w-64 sm:w-80 md:w-[420px] pointer-events-none opacity-30 object-contain scale-x-[-1] scale-y-[-1] mix-blend-multiply"
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5A0F16]/10 border border-[#D4A72C]/50 text-[#5A0F16] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E87516]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] font-cinzel">
              ✦ TOGETHER IN DEVOTION ✦
            </span>
          </div>

          <h3 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-[#3D0B10] uppercase tracking-wider">
            OUR COMMUNITY
          </h3>

          <div className="flex items-center justify-center gap-3 max-w-xs sm:max-w-md mx-auto pt-1">
            <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#D4A72C] to-[#D4A72C]" />
            <div className="flex items-center gap-1.5 text-[#D4A72C]">
              <span className="text-xs">❖</span>
              <OmIcon className="w-4 h-4 text-[#D4A72C]" />
              <span className="text-xs">❖</span>
            </div>
            <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#D4A72C] to-[#D4A72C]" />
          </div>
        </div>

        {/* Unique Temple Arch Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statsItems.map((stat) => {
            const IconComp = getIcon(stat.iconName);
            const currentVal = counts[stat.id] !== undefined ? counts[stat.id] : stat.value;

            return (
              <div
                key={stat.id}
                className="group relative rounded-t-[100px] rounded-b-2xl bg-gradient-to-b from-[#4A0A10] via-[#32070B] to-[#1A0306] border-2 border-[#D4A72C]/60 hover:border-[#F4B942] pt-8 pb-7 px-6 text-center shadow-[0_15px_40px_rgba(50,7,11,0.3)] hover:shadow-[0_20px_50px_rgba(212,167,44,0.4)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-between"
              >
                {/* Decorative Dashed Arch Outline inside */}
                <div className="absolute top-2 left-2 right-2 bottom-2 rounded-t-[90px] rounded-b-xl border border-dashed border-[#D4A72C]/30 pointer-events-none" />

                {/* Top Icon Badge in Arch Dome */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#240407] to-[#150204] border-2 border-[#F4B942] text-[#F4B942] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10">
                  <IconComp className="w-7 h-7 stroke-[2.2]" />
                </div>

                {/* Main Animated Number */}
                <div className="my-4 relative z-10">
                  <div className="font-cinzel text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFF7E8] via-[#F4B942] to-[#D4A72C] tracking-tight group-hover:scale-105 transition-transform">
                    {currentVal}
                    <span className="text-[#E87516] ml-0.5">{stat.suffix}</span>
                  </div>
                </div>

                {/* Label at Bottom of Arch */}
                <p className="font-cinzel text-xs sm:text-sm font-black text-[#FFF7E8]/90 uppercase tracking-widest leading-relaxed relative z-10">
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
