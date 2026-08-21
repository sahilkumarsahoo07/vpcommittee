import React from 'react';
import { Clock, MapPin, Sparkles, Navigation } from 'lucide-react';
import { FESTIVAL_EVENTS } from '../data/mockData';

export const FestivalTimeline: React.FC = () => {
  return (
    <section id="events" className="bg-[#FFF7E8] text-[#2A1710] py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative border-t border-[#D4A72C]/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Festival Schedule Vertical Timeline */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E87516] bg-[#5A0F16]/10 px-3.5 py-1 rounded-full border border-[#D4A72C]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DEVOTIONAL SCHEDULE</span>
              </div>
              <h3 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#5A0F16]">
                FESTIVAL SCHEDULE
              </h3>
            </div>

            {/* Vertical Timeline Items */}
            <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-[35px] sm:before:left-[43px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#5A0F16] before:via-[#D4A72C] before:to-[#5A0F16]">
              {FESTIVAL_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="group relative flex items-start gap-4 sm:gap-6 bg-[#FFFDF7] border border-[#D4A72C]/30 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl hover:border-[#D4A72C] transition-all duration-300"
                >
                  {/* Date Badge Pillar */}
                  <div className="flex-shrink-0 w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-[#5A0F16] border border-[#D4A72C] text-[#FFF7E8] flex flex-col items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <span className="font-cinzel text-xs font-extrabold text-[#F4B942] uppercase leading-none">
                      {event.dayMonth.split(' ')[1]}
                    </span>
                    <span className="font-cinzel text-lg sm:text-xl font-bold leading-none mt-1">
                      {event.dayMonth.split(' ')[0]}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#5A0F16] group-hover:text-[#E87516] transition-colors">
                        {event.title}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A0F16] bg-[#D4A72C]/20 px-2.5 py-0.5 rounded-full border border-[#D4A72C]/40">
                        <Clock className="w-3 h-3 text-[#E87516]" />
                        {event.time}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#2A1710]/80 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] text-[#E87516] font-medium pt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live Event Card (🔴 LIVE / TODAY MAHA AARTI) */}
          <div className="lg:col-span-5 text-left sticky top-28">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4A72C] group">
              {/* Background Diya Photo Overlay */}
              <div className="absolute inset-0 bg-[#32070B]">
                <img
                  src="/assets/maha-aarti.png"
                  alt="Maha Aarti Ceremony"
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#32070B] via-[#32070B]/80 to-transparent" />
              </div>

              {/* Card Foreground Content */}
              <div className="relative z-10 p-6 sm:p-8 space-y-6">
                
                {/* Live Pill Badge */}
                <div className="inline-flex items-center gap-2 bg-[#5A0F16] border border-[#F4B942] text-[#FFF7E8] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-red-400">🔴 LIVE / TODAY</span>
                </div>

                {/* Event Name */}
                <div className="space-y-1">
                  <h3 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#F4B942] tracking-wider uppercase">
                    MAHA AARTI
                  </h3>
                  <p className="text-lg font-semibold text-[#FFF7E8]">
                    Today • 7:30 PM
                  </p>
                </div>

                {/* Location Box */}
                <div className="flex items-center gap-3 bg-[#5A0F16]/80 backdrop-blur-md p-3.5 rounded-xl border border-[#D4A72C]/40 text-[#FFF7E8]">
                  <div className="w-10 h-10 rounded-lg bg-[#D4A72C] text-[#32070B] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#F4B942] uppercase font-bold tracking-wider block">Pandal Location</span>
                    <span className="text-sm font-semibold">📍 Vighnaharta Puja Pandal</span>
                  </div>
                </div>

                {/* Location Directions Button */}
                <div>
                  <a
                    href="#location"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] font-bold text-sm uppercase tracking-wider shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>View Location</span>
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
