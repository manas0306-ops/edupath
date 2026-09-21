import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, dynamicPhrases } from '../i18n/translations';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('edupath_theme') || 'dark';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('edupath_lang') || 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('edupath_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('edupath_lang', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const t = (key, params) => {
    if (!key) return '';
    const langObj = translations[language] || translations.en;
    const dynObj = dynamicPhrases[language] || {};

    let template = langObj[key] 
      || dynObj[key] 
      || translations.en[key] 
      || (dynamicPhrases.en && dynamicPhrases.en[key]) 
      || null;

    if (!template && typeof key === 'string') {
      // 1. Duration in minutes: e.g. "35 mins", "20 mins", "45 mins"
      const minsMatch = key.match(/^(\d+)\s*mins?$/i);
      if (minsMatch) {
        const m = minsMatch[1];
        if (language === 'hi') return `${m} मिनट`;
        if (language === 'pa') return `${m} ਮਿੰਟ`;
        if (language === 'es' || language === 'fr') return `${m} min`;
        if (language === 'de') return `${m} Min.`;
        if (language === 'ja') return `${m}分`;
        return `${m} mins`;
      }

      // 2. Goal hours: e.g. "Goal: 12h / week"
      const goalMatch = key.match(/^Goal:\s*(\d+)h\s*\/\s*week$/i);
      if (goalMatch) {
        return t('goalHours', { hours: goalMatch[1] });
      }

      // 3. Remaining gaps: e.g. "5 remaining gaps"
      const gapsMatch = key.match(/^(\d+)\s+remaining\s+gaps?$/i);
      if (gapsMatch) {
        return t('remainingGaps', { count: gapsMatch[1] });
      }

      // 4. Percentage increase this week: e.g. "↑ 18% this week"
      const weekMatch = key.match(/^[↑↑]\s*(\d+)%\s*this week$/i);
      if (weekMatch) {
        return t('thisWeek');
      }

      template = key;
    }

    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([k, v]) => {
        template = template.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return template;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, language, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

