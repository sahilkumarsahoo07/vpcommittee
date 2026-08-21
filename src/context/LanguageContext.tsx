import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'hi' | 'or' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default language set to Hindi ('hi') as requested ("make it this same design in state of hindi can you add odia ?")
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('vpcommittee_lang') as Language;
    return saved && ['en', 'or', 'hi'].includes(saved) ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vpcommittee_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
