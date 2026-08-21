import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Home, Calendar, Image as ImageIcon, Sparkles, UserPlus } from 'lucide-react';
import { OmIcon } from './DevotionalIcons';

interface NavbarProps {
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDonate, onOpenVolunteer }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Events', href: '#events' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Donate', href: '#donate' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Main Top Header Navbar (Desktop & Mobile Top) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#32070B]/95 backdrop-blur-md border-b border-[#D4A72C]/30 shadow-2xl py-3'
            : 'bg-gradient-to-b from-[#2A1710]/90 via-[#32070B]/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A72C] to-[#E87516] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#32070B] flex items-center justify-center text-[#F4B942]">
                <OmIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-cinzel text-lg md:text-xl font-bold tracking-wider text-[#FFF7E8] group-hover:text-[#F4B942] transition-colors leading-none">
                VIGHNAHARTA
              </span>
              <span className="text-[10px] md:text-xs font-semibold tracking-widest text-[#D4A72C] uppercase leading-tight">
                PUJA COMMITTEE
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#FFF7E8]/90 hover:text-[#F4B942] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#F4B942] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenVolunteer}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] hover:shadow-lg hover:shadow-[#F4B942]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Join Us
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden w-10 h-10 rounded-lg bg-[#5A0F16]/80 border border-[#D4A72C]/40 text-[#F4B942] flex items-center justify-center"
          >
            {isMobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu Modal */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#32070B]/95 backdrop-blur-xl pt-24 px-6 flex flex-col justify-between pb-28 animate-fadeIn">
          <div className="space-y-4 text-center">
            <p className="font-devanagari text-lg text-[#F4B942] font-semibold">॥ श्री गणेशाय नमः ॥</p>
            <div className="h-[1px] w-24 mx-auto bg-[#D4A72C]/30 my-2"></div>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="block text-xl font-cinzel text-[#FFF7E8] hover:text-[#F4B942] py-2 border-b border-[#D4A72C]/10"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="space-y-3 pt-6">
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onOpenDonate();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#32070B] font-bold text-base flex items-center justify-center gap-2 shadow-lg"
            >
              <Heart className="w-5 h-5 fill-current" />
              Donate Now
            </button>
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onOpenVolunteer();
              }}
              className="w-full py-3.5 rounded-xl bg-[#5A0F16] border border-[#D4A72C] text-[#FFF7E8] font-bold text-base flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-[#F4B942]" />
              Become a Volunteer
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Mobile Bottom Navigation Bar (Section 5 Requirement) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#32070B]/95 border-t border-[#D4A72C]/30 backdrop-blur-lg px-2 py-2 shadow-2xl">
        <div className="grid grid-cols-5 items-center text-center">
          <a href="#hero" className="flex flex-col items-center gap-0.5 text-[#FFF7E8]/80 hover:text-[#F4B942] py-1">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </a>
          <a href="#events" className="flex flex-col items-center gap-0.5 text-[#FFF7E8]/80 hover:text-[#F4B942] py-1">
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-medium">Events</span>
          </a>
          
          {/* Highlighted Mobile Donate Action */}
          <button
            onClick={onOpenDonate}
            className="flex flex-col items-center justify-center -mt-5"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4A72C] via-[#F4B942] to-[#E87516] border-2 border-[#FFF7E8] text-[#32070B] flex items-center justify-center shadow-xl animate-bounce">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="text-[10px] font-bold text-[#F4B942] mt-0.5">Donate</span>
          </button>

          <a href="#gallery" className="flex flex-col items-center gap-0.5 text-[#FFF7E8]/80 hover:text-[#F4B942] py-1">
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Gallery</span>
          </a>
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="flex flex-col items-center gap-0.5 text-[#FFF7E8]/80 hover:text-[#F4B942] py-1"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
};
