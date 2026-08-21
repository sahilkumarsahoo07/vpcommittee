import React from 'react';
import { FESTIVAL_EVENTS } from '../data/mockData';

export const FestivalTimeline: React.FC = () => {
  return (
    <section id="events" className="bg-[#FFF7E8] text-[#2A1710] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/20 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-left space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E87516] bg-[#5A0F16]/10 px-3.5 py-1 rounded-full border border-[#D4A72C]/30">
            DEVOTIONAL SCHEDULE
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#32070B]">
            FESTIVAL SCHEDULE
          </h2>
        </div>

        {/* Main Grid: Left Timeline, Right Live Event Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Timeline List */}
          <div className="lg:col-span-6 space-y-4">
            {FESTIVAL_EVENTS.map((event) => (
              <div
                key={event.id}
                className="bg-[#FFFDF7] border border-[#D4A72C]/40 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl hover:border-[#32070B] transition-all flex items-center justify-between gap-4 text-left group"
              >
                <div className="flex items-center gap-4">
                  {/* Dark Maroon Date Badge */}
                  <div className="w-14 h-14 rounded-xl bg-[#2A1710] border border-[#D4A72C]/40 text-[#FFF7E8] flex flex-col items-center justify-center flex-shrink-0 shadow-md group-hover:bg-[#5A0F16] transition-colors">
                    <span className="text-xs font-bold text-[#F4B942] uppercase leading-none">
                      {event.date.split(' ')[0]}
                    </span>
                    <span className="font-cinzel text-lg font-black leading-none mt-0.5">
                      {event.date.split(' ')[1]}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#32070B] group-hover:text-[#E87516] transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-xs text-[#2A1710]/70 line-clamp-1 font-medium">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Time Badge */}
                <div className="px-3 py-1 rounded-full bg-[#FFF7E8] border border-[#D4A72C]/40 text-[11px] font-bold text-[#5A0F16] whitespace-nowrap flex-shrink-0">
                  {event.time}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: 🔴 LIVE / TODAY MAHA AARTI Featured Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4A72C] shadow-2xl bg-[#2A1710] text-[#FFF7E8] h-full min-h-[380px] flex flex-col justify-between p-6 sm:p-8 group">
              
              {/* Background Diya Imagery */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/assets/pandal-maha-aarti.png"
                  alt="Maha Aarti Pandal Celebration"
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F070A] via-[#1F070A]/60 to-transparent" />
              </div>

              {/* Top Tag: LIVE / TODAY */}
              <div className="relative z-10 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#F4B942] bg-[#32070B]/80 px-3 py-1 rounded-full border border-[#D4A72C]/40">
                  🔴 LIVE / TODAY
                </span>
              </div>

              {/* Middle Event Details */}
              <div className="relative z-10 space-y-2 text-left my-auto pt-8">
                <h3 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF7E8] via-[#F4B942] to-[#E87516] tracking-wider">
                  MAHA AARTI
                </h3>
                <p className="font-sans text-base sm:text-lg font-bold text-[#FFF7E8]/90">
                  Today • 7:30 PM
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-[#F4B942] font-semibold bg-[#32070B]/80 px-3 py-1 rounded-lg border border-[#D4A72C]/30">
                  <span>📍 Vighnaharta Puja Pandal</span>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="relative z-10 pt-4">
                <a
                  href="#location"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#1F070A] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2"
                >
                  <span>View Location</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
