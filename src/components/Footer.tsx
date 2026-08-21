import React from 'react';
import { Phone, Mail, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { OmIcon } from './DevotionalIcons';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  return (
    <footer id="contact" className="bg-[#1A0305] text-[#FFF7E8] pt-14 pb-8 px-4 sm:px-6 lg:px-8 border-t-2 border-[#D4A72C]/40">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-left">
          {/* Col 1: Committee Brand */}
          <div className="space-y-4">
            <img
              src="/assets/navlogo.png"
              alt="Vighnaharta Puja Committee Logo"
              className="h-12 w-auto object-contain"
            />
            <p className={`text-xs text-[#F4B942] font-semibold tracking-wider uppercase ${fontClass}`}>
              {t.footer.slogan}
            </p>
            <p className={`text-xs text-[#FFF7E8]/70 leading-relaxed ${fontClass}`}>
              {t.footer.desc}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className={`text-sm font-bold text-[#F4B942] uppercase tracking-wider ${fontClass}`}>
              {t.footer.quickLinksTitle}
            </h4>
            <ul className="space-y-2 text-xs text-[#FFF7E8]/80 font-medium">
              <li>
                <a href="#hero" className={`hover:text-[#F4B942] transition-colors ${fontClass}`}>
                  {t.nav.home}
                </a>
              </li>
              <li>
                <a href="#about" className={`hover:text-[#F4B942] transition-colors ${fontClass}`}>
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#events" className={`hover:text-[#F4B942] transition-colors ${fontClass}`}>
                  {t.nav.events}
                </a>
              </li>
              <li>
                <a href="#gallery" className={`hover:text-[#F4B942] transition-colors ${fontClass}`}>
                  {t.nav.gallery}
                </a>
              </li>
              <li>
                <a href="#donate" className={`hover:text-[#F4B942] transition-colors ${fontClass}`}>
                  {t.nav.donate}
                </a>
              </li>
              <li>
                <a
                  href="/admin/login"
                  className={`hover:text-[#F4B942] transition-colors inline-flex items-center gap-1.5 text-[#F4B942]/90 hover:underline font-semibold ${fontClass}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F4B942]" />
                  {t.nav.adminLogin}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className={`text-sm font-bold text-[#F4B942] uppercase tracking-wider ${fontClass}`}>
              {t.footer.contactTitle}
            </h4>
            <div className="space-y-2.5 text-xs text-[#FFF7E8]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F4B942] flex-shrink-0 mt-0.5" />
                <span className={fontClass}>{t.footer.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F4B942] flex-shrink-0" />
                <a href="tel:+918327704042" className="font-medium hover:text-[#F4B942] transition-colors">+91 83277 04042</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F4B942] flex-shrink-0" />
                <a href="mailto:sahilkumarsahoo001@gmail.com" className="font-medium hover:text-[#F4B942] transition-colors">sahilkumarsahoo001@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Col 4: Scan to Donate QR */}
          <div className="space-y-3">
            <h4 className={`text-sm font-bold text-[#F4B942] uppercase tracking-wider ${fontClass}`}>
              {t.footer.scanDonateTitle}
            </h4>
            <div className="bg-white p-2.5 rounded-xl border border-[#D4A72C]/40 inline-block">
              <img
                src="/assets/upi-qr.png"
                alt="Scan to Donate via UPI"
                className="w-24 h-24 object-contain mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#D4A72C]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF7E8]/60">
          <div className="flex items-center gap-2">
            <OmIcon className="w-4 h-4 text-[#F4B942]" />
            <span className={fontClass}>{t.footer.rights}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="https://instagram.com/sahil_kumar_016"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-bold text-[#F4B942] hover:text-[#E87516] transition-colors group"
            >
              <span>{t.footer.madeWith}</span>
              <span className="text-[11px] text-[#FFF7E8]/60 font-medium group-hover:underline">(@sahil_kumar_016)</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline-block ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
