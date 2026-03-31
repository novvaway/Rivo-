import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');
  const [direction, setDirection] = useState('rtl');

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    setDirection(prev => prev === 'rtl' ? 'ltr' : 'rtl');
  };

  const t = (translations) => {
    return translations[language] || translations.ar || '';
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
