import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="bg-[#FFF7E8] text-[#2A1710] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Address Info & Get Directions */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E87516] bg-[#5A0F16]/10 px-3.5 py-1 rounded-full border border-[#D4A72C]/30">
                PANDAL LOCATION
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#5A0F16]">
                FIND OUR PANDAL
              </h2>
            </div>

            <div className="bg-[#FFFDF7] border-2 border-[#D4A72C]/40 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-6 h-6 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-cinzel text-lg font-bold text-[#5A0F16]">
                    Vighnaharta Main Pandal
                  </h4>
                  <p className="text-sm text-[#2A1710]/90 font-medium">
                    123, Ganesh Nagar, Central Avenue, Your City, State - 000001
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D4A72C]/20 flex flex-wrap items-center justify-between text-xs text-[#2A1710]/70 font-semibold gap-2">
                <span className="flex items-center gap-1">
                  <Compass className="w-4 h-4 text-[#E87516]" /> Landmark: Near Shiv Temple
                </span>
                <span className="text-[#5A0F16]">Parking Available 🅿️</span>
              </div>
            </div>

            <div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#5A0F16] hover:bg-[#32070B] border border-[#D4A72C] text-[#FFF7E8] hover:text-[#F4B942] font-bold text-sm uppercase tracking-wider shadow-xl hover:scale-105 transition-all group"
              >
                <span>Get Directions</span>
                <Navigation className="w-4 h-4 text-[#F4B942] group-hover:rotate-45 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Live Google Map Iframe */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4A72C] shadow-2xl h-80 sm:h-96 bg-[#2A1710] group">
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
      </div>
    </section>
  );
};
