import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FileBarChart, CheckCircle2, TrendingUp, AlertTriangle, Sparkles,
  Calendar, Clock, Award, Printer, ArrowRight, Volume2, Square, Zap
} from 'lucide-react';

export const ReportsPage = () => {
  const { user } = useAuth();
  const { t, isBriefMode, isSpeaking, speak, stopSpeaking, toggleSpeak } = useTheme();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('edupath_token');
        const res = await fetch('/api/reports/weekly', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading && !report) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-64"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in print:p-0">
      
      {/* Executive Briefing Card for Reports (when Make it brief is ON) */}
      {isBriefMode && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-brand-500/10 to-indigo-500/10 border-2 border-amber-500/40 dark:border-amber-500/30 shadow-lg space-y-4 animate-fade-in print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t('briefReportsTitle')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider">
                    {t('briefModeActive')}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('targetCareerTrack')} <span className="font-semibold text-brand-600 dark:text-brand-400">{t(user?.profile?.target_role) || 'AI/ML Engineer'}</span>
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
                  t('briefReportsTitle'),
                  t('briefReportsBullet1', { accuracy: report?.practice_accuracy_percentage || 82.5 }),
                  t('briefHoursBullet', { hours: report?.learning_hours_logged || 11.5, goal: 12 }),
                  `${t('completedActivities')}: ${report?.completed_activities_count || 8}`,
                  t('briefReportsBullet2'),
                  report?.ai_summary ? t(report.ai_summary) : null
                ].filter(Boolean);
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
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                {t('briefReportsBullet1', { accuracy: report?.practice_accuracy_percentage || 82.5 })}
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                {t('briefHoursBullet', { hours: report?.learning_hours_logged || 11.5, goal: 12 })}
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                {t('completedActivities')}: <strong className="text-slate-900 dark:text-white">{report?.completed_activities_count || 8}</strong>
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed font-semibold text-amber-800 dark:text-amber-300">
                {t('briefReportsBullet2')}
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('reportsTitle')}
            </h1>
            <button
              onClick={() => toggleSpeak(`${t('reportsTitle')}. ${t('reportsSubtitle')}. ${report?.ai_summary ? t(report.ai_summary) : ''}`)}
              title={t('readAloud')}
              className="p-1 rounded-lg text-slate-400 hover:text-brand-500 transition"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('reportsSubtitle')}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm w-fit"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t('exportPrintReport')}</span>
        </button>
      </div>

      {/* Main Report Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        
        {/* Report Meta Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400">EduPath Synthesis</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{t(report?.report_title) || report?.report_title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('learner')}: <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.name}</span> • {t('targetCareerTrack')} <span className="font-semibold text-brand-600">{t(user?.profile?.target_role) || 'AI/ML Engineer'}</span></p>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-400">
            <p className="flex items-center sm:justify-end space-x-1 font-semibold text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-brand-500" />
              <span>{t('weeklyAiProgressReport')}</span>
            </p>
            <p className="text-[10px] mt-0.5">{t('adaptiveAiActive')}</p>
          </div>
        </div>

        {/* High-Level Numbers */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">{t('completedActivities')}</span>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{report?.completed_activities_count || 8}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">{t('diagnosticAccuracy')}</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">{report?.practice_accuracy_percentage || 82.5}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">{t('studyHoursLogged')}</span>
            <p className="text-2xl font-black text-brand-500 mt-1">{report?.learning_hours_logged || 11.5}h</p>
          </div>
        </div>

        {/* Categorized Progress Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Skills Acquired */}
          <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('skillsAcquired')}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {report?.skills_acquired?.map((s, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                  <span>{t(s)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Improving */}
          <div className="p-5 rounded-2xl bg-sky-50/40 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/60 space-y-3">
            <div className="flex items-center space-x-2 text-sky-700 dark:text-sky-400 font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
              <span>{t('skillsMasteredThisWeek')}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {report?.skills_improving?.map((s, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
                  <span>{t(s)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weak Areas Detected */}
          <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>{t('struggleFocusAreas')}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {report?.weak_areas?.map((s, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                  <span>{t(s)}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* AI Mentor Executive Summary */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>{t('aiLearningInsights')}</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
            "{t(report?.ai_summary)}"
          </p>
        </div>

        {/* Recommended Focus for Next Week */}
        <div className="p-5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/60 flex items-start space-x-3">
          <Award className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-brand-900 dark:text-brand-200">{t('recommendedNextStep')}</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">{t(report?.recommended_next_week)}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
