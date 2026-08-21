import React from 'react';
import { MapPin, Phone, Mail, QrCode, Heart, MessageCircle, Share2, Video, Globe } from 'lucide-react';
import { OmIcon } from './DevotionalIcons';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#2A1710] text-[#FFF7E8] pt-16 pb-24 md:pb-12 border-t-2 border-[#D4A72C]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 text-left">
          
          {/* Col 1: Brand Logo & Tagline */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#5A0F16] border-2 border-[#F4B942] text-[#F4B942] flex items-center justify-center shadow-lg">
                <OmIcon className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-xl font-bold tracking-wider text-[#FFF7E8]">
                  VIGHNAHARTA
                </span>
                <span className="text-xs font-semibold tracking-widest text-[#D4A72C] uppercase">
                  PUJA COMMITTEE
                </span>
              </div>
            </div>

            <p className="font-cormorant italic text-lg text-[#F4B942] font-semibold">
              Faith • Unity • Celebration
            </p>

            <p className="text-xs text-[#FFF7E8]/70 leading-relaxed max-w-sm">
              Organizing grand, safe, eco-friendly Ganesh Utsav celebrations filled with devotion, Vedic rituals, cultural programs, and community service.
            </p>

            {/* Social Icons Bar */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Globe, href: '#', label: 'Website' },
                { icon: Share2, href: '#', label: 'Share' },
                { icon: Video, href: '#', label: 'YouTube' },
                { icon: MessageCircle, href: '#', label: 'WhatsApp' },
              ].map((s, idx) => {
                const Icon = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full bg-[#5A0F16] border border-[#D4A72C]/40 text-[#F4B942] flex items-center justify-center hover:bg-[#F4B942] hover:text-[#32070B] hover:scale-110 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-[#F4B942] uppercase tracking-widest border-b border-[#D4A72C]/30 pb-2">
              QUICK LINKS
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-[#FFF7E8]/80 font-medium">
              {['Home', 'About', 'Events', 'Gallery', 'Donate', 'Join Us', 'Updates', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(' ', '')}`}
                    className="hover:text-[#F4B942] transition-colors flex items-center gap-1"
                  >
                    <span className="text-[#D4A72C]">›</span> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-[#F4B942] uppercase tracking-widest border-b border-[#D4A72C]/30 pb-2">
              CONTACT US
            </h4>
            <div className="space-y-2 text-xs text-[#FFF7E8]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E87516] flex-shrink-0 mt-0.5" />
                <span>123, Ganesh Nagar, Your City, State - 000001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E87516] flex-shrink-0" />
                <span>+91 12345 67890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E87516] flex-shrink-0" />
                <span>committee@email.com</span>
              </div>
            </div>
          </div>

          {/* Col 4: Scan To Donate UPI QR Code */}
          <div className="lg:col-span-2 space-y-3 text-center md:text-left">
            <h4 className="font-cinzel text-xs font-bold text-[#F4B942] uppercase tracking-widest border-b border-[#D4A72C]/30 pb-2">
              SCAN TO DONATE
            </h4>
            <div className="bg-[#FFF7E8] p-2.5 rounded-xl border border-[#D4A72C] inline-block shadow-md">
              {/* Generated QR Code Pattern */}
              <div className="w-24 h-24 bg-[#32070B] rounded flex flex-col items-center justify-center p-1 text-[#F4B942]">
                <QrCode className="w-16 h-16" />
                <span className="text-[9px] font-mono text-[#FFF7E8]">UPI QR</span>
              </div>
            </div>
            <p className="text-[10px] font-mono text-[#F4B942] tracking-wider">
              UPI ID: vighnaharta@upi
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#D4A72C]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF7E8]/60">
          <p>© 2026 Vighnaharta Puja Committee. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> by the community
          </p>
        </div>

      </div>
    </footer>
  );
};
