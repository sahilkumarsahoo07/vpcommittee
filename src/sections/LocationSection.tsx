import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, Trophy, Users, HeartHandshake, Sparkles } from 'lucide-react';
import { COMMUNITY_STATS } from '../data/mockData';

export const LocationSection: React.FC = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Award': return Trophy;
      case 'Users': return Users;
      case 'HeartHandshake': return HeartHandshake;
      default: return Sparkles;
    }
  };

  return (
    <section ref={sectionRef} id="location" className="bg-[#FFF7E8] text-[#2A1710] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/20 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Row 1: FIND OUR PANDAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Address Info */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E87516] bg-[#5A0F16]/10 px-3.5 py-1 rounded-full border border-[#D4A72C]/30">
                PANDAL LOCATION
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#32070B]">
                FIND OUR PANDAL
              </h2>
            </div>

            <div className="bg-[#FFFDF7] border border-[#D4A72C]/40 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-5 h-5 animate-bounce" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-cinzel text-base font-bold text-[#32070B]">
                    Vighnaharta Main Pandal
                  </h4>
                  <p className="text-xs text-[#2A1710]/90 font-medium">
                    123, Ganesh Nagar, Central Avenue, Your City, State - 000001
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D4A72C]/20 flex flex-wrap items-center justify-between text-[11px] text-[#2A1710]/70 font-semibold gap-2">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#E87516]" /> Landmark: Near Shiv Temple
                </span>
                <span className="text-[#5A0F16]">Parking Available 🅿️</span>
              </div>
            </div>

            <div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/50 text-[#FFF7E8] hover:text-[#F4B942] font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all group"
              >
                <span>Get Directions</span>
                <Navigation className="w-3.5 h-3.5 text-[#F4B942] group-hover:rotate-45 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right: Embedded Live Google Map */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4A72C] shadow-xl h-72 sm:h-80 bg-[#2A1710]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d581.2730728433189!2d85.51460151541815!3d20.914095979420168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a18d1002ee40277%3A0x6b7ef8fc36e80d58!2sVighnaharta%20puja%20committee!5e1!3m2!1sen!2sin!4v1787291683928!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Vighnaharta Puja Committee Google Map Location"
                className="w-full h-full rounded-2xl filter contrast-105"
              />
            </div>
          </div>

        </div>

        {/* Row 2: OUR COMMUNITY */}
        <div className="space-y-6 pt-4 border-t border-[#D4A72C]/20">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E87516] bg-[#5A0F16]/10 px-3.5 py-1 rounded-full border border-[#D4A72C]/30">
              TOGETHER IN DEVOTION
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#32070B]">
              OUR COMMUNITY
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {COMMUNITY_STATS.map((stat) => {
              const IconComp = getIcon(stat.iconName);
              const currentVal = counts[stat.id] !== undefined ? counts[stat.id] : stat.value;

              return (
                <div
                  key={stat.id}
                  className="bg-[#FFFDF7] border-2 border-[#D4A72C]/40 rounded-2xl p-5 text-center shadow-lg hover:border-[#32070B] hover:scale-105 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#5A0F16] text-[#F4B942] flex items-center justify-center mx-auto mb-2 shadow-md group-hover:rotate-12 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="font-cinzel text-3xl sm:text-4xl font-black text-[#32070B] tracking-tight">
                    {currentVal}
                    <span className="text-[#E87516]">{stat.suffix}</span>
                  </div>

                  <p className="font-sans text-xs font-bold text-[#2A1710]/80 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
