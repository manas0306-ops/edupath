import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { SelfAssessmentQuiz } from '../components/SelfAssessmentQuiz';
import {
  BrainCircuit, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  Zap, Award, Volume2, Square, Layers, HelpCircle
} from 'lucide-react';

const SKILLS_CATALOG = [
  { name: "PyTorch", category: "Deep Learning", difficulty: "Advanced", questionsCount: 4, icon: "🔥" },
  { name: "SQL", category: "Database & Analysis", difficulty: "Intermediate", questionsCount: 5, icon: "💾", isStruggle: true },
  { name: "Machine Learning", category: "Algorithms", difficulty: "Intermediate", questionsCount: 6, icon: "🤖" },
  { name: "Deep Learning", category: "Neural Networks", difficulty: "Advanced", questionsCount: 4, icon: "🧠" },
  { name: "Python", category: "Core Programming", difficulty: "Beginner", questionsCount: 8, icon: "🐍" },
  { name: "Docker", category: "Containerization", difficulty: "Intermediate", questionsCount: 3, icon: "🐳" },
];

export const PracticePage = ({ onLaunchPractice }) => {
  const { user } = useAuth();
  const { t, isBriefMode, isSpeaking, speak, stopSpeaking, toggleSpeak } = useTheme();

  // Sub-tab: 'flashcards' | 'quiz' | 'modules'
  const [activeSubTab, setActiveSubTab] = useState('flashcards');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Executive Briefing Card for Practice (when Make it brief is ON) */}
      {isBriefMode && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-brand-500/10 to-indigo-500/10 border-2 border-amber-500/40 dark:border-amber-500/30 shadow-lg space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t('briefSummaryTitle')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider">
                    {t('briefModeActive')}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('practiceEngineTitle')}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                  return;
                }
                const bullets = [
                  t('practiceEngineTitle'),
                  t('practiceEngineSubtitle'),
                  `${t('struggleAlert')}: SQL. ${t('struggleNotice')}`,
                  `Flashcards, self-assessment quizzes, and multilingual explanations active.`
                ];
                speak(bullets.join('. '));
              }}
              title={isSpeaking ? t('stopReading') : t('readBriefAloud')}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center space-x-2 shadow-sm ${
                isSpeaking
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700/60 hover:bg-amber-50 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-300'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{t('stopReading')}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('readBriefAloud')}</span>
                </>
              )}
            </button>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200">
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed font-semibold text-amber-800 dark:text-amber-300">
                {t('struggleAlert')}: SQL ({t('needsPractice')}).
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                Interactive Flashcards with 3D flip and multilingual explanations in 7 languages.
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                Self-Assessment Quizzes with customized topics, timers, and diagnostic scoring.
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('practiceEngineTitle')}
            </h1>
            <button
              onClick={() => toggleSpeak(`${t('practiceEngineTitle')}. ${t('practiceEngineSubtitle')}.`)}
              title={t('readAloud')}
              className="p-1 rounded-lg text-slate-400 hover:text-brand-500 transition"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('practiceEngineSubtitle')}
          </p>
        </div>

        {/* Sub-Tab Navigation Pill Bar */}
        <div className="flex items-center p-1.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl border border-slate-300/50 dark:border-slate-700/50 shadow-inner">
          <button
            onClick={() => setActiveSubTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'flashcards'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t('flashcardsTab')}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'quiz'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{t('quizTab')}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('modules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'modules'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('skillsTab')}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE FLASHCARDS */}
      {activeSubTab === 'flashcards' && (
        <div className="animate-fade-in">
          <FlashcardDeck />
        </div>
      )}

      {/* TAB 2: SELF-ASSESSMENT QUIZZES */}
      {activeSubTab === 'quiz' && (
        <div className="animate-fade-in">
          <SelfAssessmentQuiz />
        </div>
      )}

      {/* TAB 3: DIAGNOSTIC SKILL MODULES */}
      {activeSubTab === 'modules' && (
        <div className="space-y-6 animate-fade-in">
          {/* Adaptive Notice Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {t('struggleAlert')}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                {t('struggleNotice')}
              </p>
            </div>
          </div>

          {/* Skills Practice Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SKILLS_CATALOG.map((skill, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                  skill.isStruggle
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-800/60 ring-1 ring-amber-400/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{skill.icon}</span>
                    {skill.isStruggle && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300">
                        {t('needsPractice')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t(skill.category)}
                  </p>

                  <div className="flex items-center space-x-2 mt-4 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                      {t(skill.difficulty)}
                    </span>
                    <span>• {t('diagnosticTasksCount', { count: skill.questionsCount })}</span>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchPractice(skill.name)}
                  className="mt-6 w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm flex items-center justify-center space-x-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('startPracticeSession')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
