import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { translations, dynamicPhrases } from '../i18n/translations';

const ThemeContext = createContext();

const LANG_VOICE_MAP = {
  en: 'en-US',
  hi: 'hi-IN',
  pa: 'pa-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  ja: 'ja-JP'
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('edupath_theme') || 'dark';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('edupath_lang') || 'en';
  });

  const [isBriefMode, setIsBriefMode] = useState(() => {
    return localStorage.getItem('edupath_brief') === 'true';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const activeUtteranceRef = useRef(null);

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
    // Stop any ongoing speech if language changes
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem('edupath_brief', String(isBriefMode));
  }, [isBriefMode]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleBriefMode = () => {
    setIsBriefMode(prev => !prev);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
    setIsSpeaking(false);
  };

  const speak = (rawText, langOverride) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('SpeechSynthesis is not supported in this environment.');
      return;
    }

    // Cancel any current utterance
    window.speechSynthesis.cancel();

    if (!rawText) {
      setIsSpeaking(false);
      return;
    }

    // Clean text: strip markdown symbols, URLs, extra whitespace
    const cleanText = String(rawText)
      .replace(/<[^>]*>/g, '')
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      setIsSpeaking(false);
      return;
    }

    const targetLangCode = langOverride || LANG_VOICE_MAP[language] || 'en-US';
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLangCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best available voice matching the language
    const voices = window.speechSynthesis.getVoices() || [];
    let matchedVoice = voices.find(v => v.lang.toLowerCase() === targetLangCode.toLowerCase());
    if (!matchedVoice) {
      const prefix = targetLangCode.split('-')[0].toLowerCase();
      matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    }
    // Fallback for Punjabi (pa) to Hindi (hi) if pa-IN voice is absent on OS
    if (!matchedVoice && targetLangCode.startsWith('pa')) {
      matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi'));
    }
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      activeUtteranceRef.current = null;
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('Speech synthesis utterance error:', e);
      }
      activeUtteranceRef.current = null;
      setIsSpeaking(false);
    };

    activeUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeak = (text, langOverride) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text, langOverride);
    }
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
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      language,
      setLanguage,
      isBriefMode,
      toggleBriefMode,
      isSpeaking,
      speak,
      stopSpeaking,
      toggleSpeak,
      t
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);


