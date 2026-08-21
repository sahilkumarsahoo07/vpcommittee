import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, type Language } from '../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languagesList: { code: Language; name: string; nativeName: string; flag: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🪔' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  ];

  const currentLang = languagesList.find((l) => l.code === language) || languagesList[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5A0F16]/90 hover:bg-[#5A0F16] border border-[#D4A72C]/60 text-[#F4B942] text-xs font-bold shadow-md transition-all hover:scale-105"
      >
        <Globe className="w-3.5 h-3.5 text-[#F4B942]" />
        <span className="font-semibold">{currentLang.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#32070B] border border-[#D4A72C] shadow-2xl z-50 py-1.5 backdrop-blur-md animate-fadeIn">
          {languagesList.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${language === lang.code
                ? 'bg-[#5A0F16] text-[#F4B942] font-bold border-l-2 border-[#F4B942]'
                : 'text-[#FFF7E8]/90 hover:bg-[#5A0F16]/60 hover:text-[#F4B942]'
                }`}
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </div>
              {language === lang.code && <span className="text-[10px] text-[#F4B942]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
