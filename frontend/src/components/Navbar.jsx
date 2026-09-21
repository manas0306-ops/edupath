import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Globe, Zap, Flame, User as UserIcon, LogOut, Compass } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export const Navbar = ({ onOpenAuth }) => {
  const { theme, toggleTheme, language, setLanguage, t } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-md shadow-brand-500/20 text-white">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
              {t('brand')}
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              AI Agent
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Gamification Stats (when authenticated) */}
          {isAuthenticated && user?.profile && (
            <div className="hidden md:flex items-center space-x-3 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
              <div className="flex items-center space-x-1 text-amber-500">
                <Flame className="w-4 h-4 fill-amber-500 animate-pulse-subtle" />
                <span>{user.profile.streak_days} {t('activeStreak')}</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex items-center space-x-1 text-brand-500">
                <Zap className="w-4 h-4 fill-brand-500" />
                <span>{user.profile.xp} XP</span>
              </div>
            </div>
          )}

          {/* Language Selector */}
          <div className="relative group">
            <button
              aria-label="Change Language"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{LANGUAGES.find(l => l.code === language)?.flag}</span>
              <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === language)?.label}</span>
            </button>
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 hidden group-hover:block transition-all z-50">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition ${
                    language === lang.code ? 'font-bold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/40' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 pl-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-tight text-slate-800 dark:text-slate-200">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.profile?.target_role || 'Learner'}</p>
                </div>
              </div>
              <button
                onClick={logout}
                title={t('logout')}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {t('login')}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-sm shadow-brand-600/30 transition"
              >
                {t('register')}
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
