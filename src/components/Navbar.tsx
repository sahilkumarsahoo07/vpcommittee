import React, { useState, useEffect } from 'react';
import { Menu, X, UserPlus, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  onOpenVolunteer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVolunteer }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.events, href: '#events' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.donate, href: '#donate' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#260508]/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.7)] py-2.5'
            : 'bg-gradient-to-b from-[#2A1710]/80 via-[#32070B]/40 to-transparent py-3 md:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            {/* Logo Image */}
            <a href="#hero" className="flex-shrink-0 group">
              <img
                src="/assets/navlogo.png"
                alt="Vighnaharta Puja Committee"
                className="h-10 sm:h-12 md:h-[3.25rem] w-auto object-contain group-hover:opacity-90 transition-opacity drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              />
            </a>

            {/* Desktop Center Nav */}
            <nav className="hidden lg:flex items-center gap-3 xl:gap-6 mx-auto px-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-xs xl:text-sm font-medium text-[#FFF7E8] hover:text-[#F4B942] transition-colors tracking-wide whitespace-nowrap ${fontClass}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Language Selector + Admin Login + Join Us + Mobile Menu */}
            <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
              <LanguageSelector />

              {/* Admin Portal Button */}
              <a
                href="/admin/login"
                className={`hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5A0F16]/90 border border-[#F4B942]/60 text-[#F4B942] hover:bg-[#7A151E] hover:border-[#F4B942] hover:scale-105 active:scale-95 transition-all items-center gap-1.5 shadow-md whitespace-nowrap ${fontClass}`}
                title="Committee Admin Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F4B942]" />
                <span>{t.nav.adminLogin}</span>
              </a>

              {/* Join Us Button */}
              <button
                onClick={onOpenVolunteer}
                className={`hidden md:inline-flex px-3.5 xl:px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] hover:shadow-lg hover:shadow-[#F4B942]/25 hover:scale-105 active:scale-95 transition-all items-center gap-1.5 whitespace-nowrap ${fontClass}`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                {t.nav.joinUs}
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
                aria-label="Toggle Navigation Menu"
                className="lg:hidden w-9 h-9 rounded-lg bg-[#5A0F16]/80 border border-[#D4A72C]/40 text-[#F4B942] flex items-center justify-center ml-1"
              >
                {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-[#32070B]/98 backdrop-blur-xl pt-24 px-6 pb-8 flex flex-col animate-fadeIn">
          <img
            src="/assets/navlogo.png"
            alt="Vighnaharta Puja Committee"
            className="h-12 w-auto mx-auto mb-4 object-contain"
          />
          <p className={`text-center text-lg text-[#F4B942] font-semibold mb-4 ${fontClass}`}>
            {t.hero.shloka}
          </p>
          <div className="h-px w-24 mx-auto bg-[#D4A72C]/30 mb-4" />
          <nav className="space-y-1 text-center flex-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileDrawerOpen(false)}
                className={`block text-lg text-[#FFF7E8] hover:text-[#F4B942] py-2.5 border-b border-[#D4A72C]/10 ${fontClass}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="space-y-2 mt-4">
            <a
              href="/admin/login"
              onClick={() => setIsMobileDrawerOpen(false)}
              className={`w-full py-3 rounded-xl bg-[#5A0F16] border border-[#F4B942]/60 text-[#F4B942] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${fontClass}`}
            >
              <ShieldCheck className="w-4 h-4" />
              {t.nav.adminLogin}
            </a>

            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onOpenVolunteer();
              }}
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] font-bold text-sm uppercase tracking-wider ${fontClass}`}
            >
              {t.nav.joinUs}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
