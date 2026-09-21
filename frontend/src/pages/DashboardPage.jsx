import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Flame, Zap, Compass, CheckCircle2, Circle, ArrowRight, AlertTriangle,
  Clock, TrendingUp, Sparkles, Brain, BookOpen, Layers, Volume2, Square
} from 'lucide-react';

export const DashboardPage = ({ onNavigate, onLaunchPractice }) => {
  const { user } = useAuth();
  const { t, isBriefMode, isSpeaking, speak, stopSpeaking, toggleSpeak } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('edupath_token');
        const res = await fetch('/api/reports/dashboard', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const toggleGoal = (index) => {
    if (!stats) return;
    const newGoals = [...stats.today_goals];
    newGoals[index].done = !newGoals[index].done;
    setStats({ ...stats, today_goals: newGoals });
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const role = user?.profile?.target_role || "AI/ML Engineer";
  const name = user?.name?.split(' ')[0] || "Learner";

  const handleSpeakBrief = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const bullets = [
      t('briefSummaryTitle'),
      `${t('targetCareerTrack')} ${t(role)}`,
      t('briefReadinessBullet', {
        pct: stats?.overall_progress_percentage || 28.5,
        count: stats?.skills_acquired_count || 6,
        remaining: stats?.remaining_gaps_count || 5
      }),
      stats?.struggle_topics && stats.struggle_topics.length > 0
        ? t('briefStruggleBullet', {
            topics: stats.struggle_topics.map(item => t(item)).join(', ')
          })
        : null,
      t('briefNextStepBullet', {
        step: t(stats?.recommended_next_step || 'Review PyTorch Autograd & Computational Graphs'),
        duration: t('35 mins')
      }),
      t('briefHoursBullet', {
        hours: stats?.total_learning_hours || 14.5,
        goal: 12
      }),
      stats?.ai_insights ? t('briefInsightBullet', { insight: t(stats.ai_insights) }) : null
    ].filter(Boolean);

    speak(bullets.join('. '));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Executive Briefing Card (Rendered prominently when 'Make it brief' is toggled ON) */}
      {isBriefMode && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-brand-500/10 to-indigo-500/10 border-2 border-amber-500/40 dark:border-amber-500/30 shadow-lg space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30 flex items-center justify-center">
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
                  {t('targetCareerTrack')} <span className="font-semibold text-brand-600 dark:text-brand-400">{t(role)}</span>
                </p>
              </div>
            </div>

            {/* Read Brief Aloud Button */}
            <button
              onClick={handleSpeakBrief}
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

          {/* Bullet points localized in selected language */}
          <ul className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200">
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                {t('briefReadinessBullet', {
                  pct: stats?.overall_progress_percentage || 28.5,
                  count: stats?.skills_acquired_count || 6,
                  remaining: stats?.remaining_gaps_count || 5
                })}
              </span>
            </li>

            {stats?.struggle_topics && stats.struggle_topics.length > 0 && (
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                <span className="leading-relaxed font-semibold text-amber-800 dark:text-amber-300">
                  {t('briefStruggleBullet', {
                    topics: stats.struggle_topics.map(item => t(item)).join(', ')
                  })}
                </span>
              </li>
            )}

            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                {t('briefNextStepBullet', {
                  step: t(stats?.recommended_next_step || 'Review PyTorch Autograd & Computational Graphs'),
                  duration: t('35 mins')
                })}
              </span>
            </li>

            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                {t('briefHoursBullet', {
                  hours: stats?.total_learning_hours || 14.5,
                  goal: 12
                })}
              </span>
            </li>

            {stats?.ai_insights && (
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></span>
                <span className="leading-relaxed italic text-slate-700 dark:text-slate-300">
                  {t('briefInsightBullet', {
                    insight: t(stats.ai_insights)
                  })}
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-brand-900/40 via-sky-900/20 to-indigo-900/30 border border-brand-300/30 dark:border-brand-800/50 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('goodDay', { name })}
            </h1>
            <button
              onClick={() => toggleSpeak(`${t('goodDay', { name })}. ${t('targetCareerTrack')} ${t(role)}.`)}
              title={t('readAloud')}
              className="p-1 rounded-lg text-slate-400 hover:text-brand-500 transition"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {t('targetCareerTrack')} <span className="font-bold text-brand-600 dark:text-brand-400">{t(role)}</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition flex items-center space-x-1.5"
          >
            <span>{t('resumeLearning')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Adaptive Struggle Detection Notification (if applicable) */}
      {stats?.struggle_topics && stats.struggle_topics.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-bold">{t('struggleAlert')}: {stats.struggle_topics.map(item => t(item)).join(', ')}</h4>
              <button
                onClick={() => toggleSpeak(`${t('struggleAlert')}: ${stats.struggle_topics.map(item => t(item)).join(', ')}. ${t('struggleNotice')}`)}
                title={t('readAloud')}
                className="p-0.5 rounded text-amber-600 dark:text-amber-300 hover:text-amber-800 transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('struggleNotice')}
            </p>
          </div>
          <button
            onClick={() => onLaunchPractice(stats.struggle_topics[0])}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition whitespace-nowrap"
          >
            {t('practiceTopic')}
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{t('overallReadiness')}</span>
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {stats?.overall_progress_percentage || 28.5}%
          </p>
          {/* Visual mini bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-brand-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats?.overall_progress_percentage || 28.5}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{t('skillsAcquired')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {stats?.skills_acquired_count || 6}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">{t('remainingGaps', { count: stats?.remaining_gaps_count || 5 })}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{t('quizAccuracy')}</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {stats?.practice_accuracy || 82.5}%
          </p>
          <p className="text-[10px] text-emerald-500 mt-1 font-semibold">{t('thisWeek')}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{t('studyHoursLogged')}</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {stats?.total_learning_hours || 14.5}h
          </p>
          <p className="text-[10px] text-slate-400 mt-1">{t('goalHours', { hours: 12 })}</p>
        </div>
      </div>

      {/* Main Split: Today's Learning + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Tasks & Roadmap Next Step */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-brand-500" />
                  <span>{t('todayGoals')}</span>
                </h3>
                <button
                  onClick={() => {
                    const goalTexts = stats?.today_goals?.map(g => `${t(g.title)} (${t(g.duration)})`).join('. ') || '';
                    toggleSpeak(`${t('todayGoals')}. ${goalTexts}. ${t('recommendedNextStep')}: ${t(stats?.recommended_next_step)}`);
                  }}
                  title={t('readAloud')}
                  className="p-1 rounded-lg text-slate-400 hover:text-brand-500 transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-slate-400">{t('clickToCheckOff')}</span>
            </div>

            <div className="space-y-3">
              {stats?.today_goals?.map((goal, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleGoal(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    goal.done
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {goal.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${goal.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {t(goal.title)}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {t(goal.duration)}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Action card */}
            <div className="mt-6 p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">{t('recommendedNextStep')}</p>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">{t(stats?.recommended_next_step)}</p>
              </div>
              <button
                onClick={() => onNavigate('roadmap')}
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition"
              >
                {t('goToModule')}
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Insights & Quick Links */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-sm text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>{t('aiLearningInsights')}</span>
              </div>
              <button
                onClick={() => toggleSpeak(`${t('aiLearningInsights')}. ${t(stats?.ai_insights)}`)}
                title={t('readAloud')}
                className="p-1 rounded-lg text-indigo-400 hover:text-white transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "{t(stats?.ai_insights)}"
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>{t('updatedAutomatically')}</span>
              <button
                onClick={() => onNavigate('mentor')}
                className="text-brand-400 hover:underline font-semibold"
              >
                {t('chatWithMentor')}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">{t('quickNavigation')}</h4>
            <button
              onClick={() => onNavigate('skill-gap')}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between transition"
            >
              <span className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-brand-500" />
                <span>{t('interactiveSkillGraph')}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between transition"
            >
              <span className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>{t('weeklyAiProgressReport')}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
