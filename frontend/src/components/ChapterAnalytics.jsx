import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  BookOpen, CheckCircle2, Clock, Award, Sparkles, Volume2, Square,
  BarChart3, GitFork, ArrowRight, RefreshCw, ChevronDown, Check,
  Layers, Zap, AlertCircle, ArrowUpRight, Filter
} from 'lucide-react';

export const ChapterAnalytics = () => {
  const { t, isSpeaking, speak, stopSpeaking } = useTheme();

  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');
  const [activeTab, setActiveTab] = useState('allCharts'); // 'allCharts' | 'flowchart' | 'ledger'
  const [chapterFilter, setChapterFilter] = useState('all'); // 'all' | 'completed' | 'left'
  const [loading, setLoading] = useState(true);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [hoveredLineIndex, setHoveredLineIndex] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [togglingChapterId, setTogglingChapterId] = useState(null);

  const fetchChapterAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('edupath_token');
      const res = await fetch('/api/reports/chapters', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Failed to load chapter analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterAnalytics();
  }, []);

  const currentSubject = useMemo(() => {
    if (!analyticsData || !analyticsData.subjects) return null;
    return (
      analyticsData.subjects.find((s) => s.id === selectedSubjectId) ||
      analyticsData.subjects[0]
    );
  }, [analyticsData, selectedSubjectId]);

  // Toggle chapter status with optimistic UI update
  const handleToggleChapter = async (subjectId, chapterId, e) => {
    if (e) e.stopPropagation();
    setTogglingChapterId(chapterId);

    // Optimistic UI state update
    setAnalyticsData((prev) => {
      if (!prev) return prev;
      const updatedSubjects = prev.subjects.map((sub) => {
        // If subject matches or updating "all" view
        const hasChapter = sub.chapters.some((c) => c.id === chapterId);
        if (!hasChapter) return sub;

        const updatedChapters = sub.chapters.map((c) => {
          if (c.id === chapterId) {
            const newStatus = c.status === 'completed' ? 'left' : 'completed';
            const newScore = newStatus === 'completed' ? (c.score || 85) : 0;
            return { ...c, status: newStatus, score: newScore };
          }
          return c;
        });

        const readCount = updatedChapters.filter((c) => c.status === 'completed').length;
        const leftCount = updatedChapters.length - readCount;
        const completionRate = updatedChapters.length
          ? Math.round((readCount / updatedChapters.length) * 1000) / 10
          : 0;

        const scores = updatedChapters.map((c) => c.score).filter((s) => s > 0);
        const avgScore = scores.length
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
          : 85;

        // Recalculate module distribution
        const moduleMap = {};
        updatedChapters.forEach((c) => {
          const modName = sub.id === 'all' ? (c.subject ? c.subject.split('&')[0].trim() : c.module) : c.module;
          if (!moduleMap[modName]) {
            moduleMap[modName] = { name: modName, chapters_read: 0, chapters_left: 0, total: 0 };
          }
          moduleMap[modName].total += 1;
          if (c.status === 'completed') moduleMap[modName].chapters_read += 1;
          else moduleMap[modName].chapters_left += 1;
        });

        return {
          ...sub,
          chapters: updatedChapters,
          chapters_read: readCount,
          chapters_left: leftCount,
          completion_rate: completionRate,
          avg_quiz_score: avgScore,
          modules: Object.values(moduleMap)
        };
      });

      return { ...prev, subjects: updatedSubjects };
    });

    try {
      const realSubId = subjectId === 'all'
        ? (currentSubject?.chapters.find((c) => c.id === chapterId)?.subject_id || 'ml')
        : subjectId;

      const token = localStorage.getItem('edupath_token');
      await fetch(`/api/reports/chapters/${realSubId}/${chapterId}/toggle`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (err) {
      console.error('Error toggling chapter:', err);
      // Re-fetch to sync if failed
      fetchChapterAnalytics();
    } finally {
      setTogglingChapterId(null);
    }
  };

  // Voice narration for Chapter Analytics
  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    if (!currentSubject) return;

    const subjectName = t(currentSubject.name) || currentSubject.name;
    const speechSummary = [
      `${t('visualChapterFlow')}: ${subjectName}.`,
      `${t('totalChapters')}: ${currentSubject.total_chapters}.`,
      `${t('chaptersRead')}: ${currentSubject.chapters_read}.`,
      `${t('chaptersLeft')}: ${currentSubject.chapters_left}.`,
      `${t('chapterCompletionRate')}: ${currentSubject.completion_rate}%.`,
      `${t('avgScore')}: ${currentSubject.avg_quiz_score}%.`
    ].join(' ');

    speak(speechSummary);
  };

  const filteredChapters = useMemo(() => {
    if (!currentSubject?.chapters) return [];
    if (chapterFilter === 'completed') {
      return currentSubject.chapters.filter((c) => c.status === 'completed');
    }
    if (chapterFilter === 'left') {
      return currentSubject.chapters.filter((c) => c.status !== 'completed');
    }
    return currentSubject.chapters;
  }, [currentSubject, chapterFilter]);

  if (loading && !analyticsData) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
      </div>
    );
  }

  if (!currentSubject) return null;

  // Calculation for Circular Progress Gauge
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentSubject.completion_rate / 100) * circumference;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-7">
      
      {/* 1. Header & Subject Dropdown Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{t('visualChapterFlow')}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {currentSubject.completion_rate}% {t('chapterStatusCompleted')}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('barChartComparison')}
              </p>
            </div>
          </div>
        </div>

        {/* Controls: Subject Selector + Read Aloud */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown for Subject Selection */}
          <div className="relative min-w-[240px]">
            <label htmlFor="subject-select" className="sr-only">
              {t('selectSubject')}
            </label>
            <div className="relative">
              <select
                id="subject-select"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full appearance-none pl-10 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition cursor-pointer shadow-sm"
              >
                {analyticsData?.subjects?.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.icon} {t(subj.name) || subj.name} ({subj.chapters_read}/{subj.total_chapters})
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-base">
                {currentSubject.icon}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Read Aloud Voice Button */}
          <button
            onClick={handleReadAloud}
            title={isSpeaking ? t('stopReading') : t('readChapterStats')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 shadow-sm ${
              isSpeaking
                ? 'bg-red-500 text-white border-red-500 animate-pulse'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{t('stopReading')}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-brand-500" />
                <span>{t('readChapterStats')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. KPI Scorecards & Circular Gauge */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        
        {/* Total Chapters */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">{t('totalChapters')}</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {currentSubject.total_chapters}
            </span>
            <span className="text-xs font-semibold text-slate-400">{t('totalChapters').toLowerCase()}</span>
          </div>
        </div>

        {/* Chapters Read */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">{t('chaptersRead')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {currentSubject.chapters_read}
            </span>
            <span className="text-xs font-bold text-emerald-500">
              ({currentSubject.completion_rate}%)
            </span>
          </div>
        </div>

        {/* Chapters Left */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">{t('chaptersLeft')}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {currentSubject.chapters_left}
            </span>
            <span className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70">
              {t('chapterStatusLeft')}
            </span>
          </div>
        </div>

        {/* Average Quiz Score */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">{t('avgScore')}</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {currentSubject.avg_quiz_score}%
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold">
              {currentSubject.avg_quiz_score >= 85 ? 'Mastery' : 'On Track'}
            </span>
          </div>
        </div>

        {/* Radial Completion Gauge */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-around gap-2">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 90 90">
              <circle
                cx="45"
                cy="45"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="45"
                cy="45"
                r={radius}
                className="stroke-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                {currentSubject.completion_rate}%
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">
                {t('chapterStatusCompleted')}
              </span>
            </div>
          </div>
          <div className="text-xs space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
              {t('chapterCompletionRate')}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {currentSubject.chapters_read} / {currentSubject.total_chapters} {t('chaptersRead').toLowerCase()}
            </p>
          </div>
        </div>

      </div>

      {/* 3. Navigation View Switcher (Tabs) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('allCharts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'allCharts'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t('viewAllCharts')}</span>
          </button>

          <button
            onClick={() => setActiveTab('flowchart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'flowchart'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>{t('viewFlowchart')}</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'ledger'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('viewChapterList')}</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
            <span>{t('chaptersRead')}</span>
          </span>
          <span className="flex items-center space-x-1.5 text-indigo-500 dark:text-indigo-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm"></span>
            <span>{t('chaptersLeft')}</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span>{t('avgScore')}</span>
          </span>
        </div>
      </div>

      {/* 4. Tab Content: VIEW 1 - OVERVIEW & CHARTS (Bar Graph + Line Graph) */}
      {(activeTab === 'allCharts' || activeTab === 'graphsOnly') && (
        <div className="space-y-6 animate-fade-in">
          
          {/* BAR GRAPH: Chapters Read vs Left (Module Distribution) */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <span>{t('barChartComparison')}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t(currentSubject.name) || currentSubject.name} — {currentSubject.chapters_read} {t('chapterStatusCompleted').toLowerCase()}, {currentSubject.chapters_left} {t('chapterStatusLeft').toLowerCase()}
                </p>
              </div>
            </div>

            {/* SVG Bar Chart Canvas */}
            <div className="w-full overflow-x-auto">
              {(() => {
                const modules = currentSubject.modules || [];
                const chartHeight = 220;
                const chartWidth = Math.max(540, modules.length * 110 + 60);
                const maxVal = Math.max(
                  ...modules.map((m) => Math.max(m.total, m.chapters_read + m.chapters_left)),
                  4
                );
                const plotHeight = 150;
                const plotYStart = 20;

                return (
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-auto select-none min-w-[500px]"
                  >
                    <defs>
                      <linearGradient id="barReadGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="barLeftGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                      const y = plotYStart + plotHeight * (1 - ratio);
                      const labelVal = Math.round(maxVal * ratio);
                      return (
                        <g key={i}>
                          <line
                            x1="40"
                            y1={y}
                            x2={chartWidth - 20}
                            y2={y}
                            stroke="currentColor"
                            className="text-slate-200 dark:text-slate-750"
                            strokeDasharray="3 3"
                            strokeWidth="1"
                          />
                          <text
                            x="32"
                            y={y + 3}
                            textAnchor="end"
                            className="text-[9px] fill-slate-400"
                          >
                            {labelVal}
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars for Each Module */}
                    {modules.map((mod, idx) => {
                      const barWidth = 26;
                      const groupSpacing = (chartWidth - 60) / modules.length;
                      const xGroup = 50 + idx * groupSpacing + groupSpacing / 2;

                      const readHeight = (mod.chapters_read / maxVal) * plotHeight;
                      const leftHeight = (mod.chapters_left / maxVal) * plotHeight;

                      const readY = plotYStart + plotHeight - readHeight;
                      const leftY = plotYStart + plotHeight - leftHeight;

                      const isHovered = hoveredBarIndex === idx;

                      return (
                        <g
                          key={idx}
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={() => setHoveredBarIndex(idx)}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                        >
                          {/* Hover highlight background */}
                          {isHovered && (
                            <rect
                              x={xGroup - barWidth * 1.5}
                              y={plotYStart}
                              width={barWidth * 3}
                              height={plotHeight}
                              className="fill-brand-500/5 dark:fill-brand-500/10 rounded-lg"
                            />
                          )}

                          {/* Read Bar (Emerald) */}
                          <rect
                            x={xGroup - barWidth - 2}
                            y={readY}
                            width={barWidth}
                            height={Math.max(readHeight, 2)}
                            rx="5"
                            fill="url(#barReadGrad)"
                            className={`transition-all duration-300 ${isHovered ? 'filter drop-shadow-md brightness-110' : ''}`}
                          />
                          {/* Value on top of read bar */}
                          {mod.chapters_read > 0 && (
                            <text
                              x={xGroup - barWidth / 2 - 2}
                              y={readY - 4}
                              textAnchor="middle"
                              className="text-[10px] font-bold fill-emerald-600 dark:fill-emerald-400"
                            >
                              {mod.chapters_read}
                            </text>
                          )}

                          {/* Left Bar (Indigo) */}
                          <rect
                            x={xGroup + 2}
                            y={leftY}
                            width={barWidth}
                            height={Math.max(leftHeight, 2)}
                            rx="5"
                            fill="url(#barLeftGrad)"
                            className={`transition-all duration-300 ${isHovered ? 'filter drop-shadow-md brightness-110' : ''}`}
                          />
                          {/* Value on top of left bar */}
                          {mod.chapters_left > 0 && (
                            <text
                              x={xGroup + barWidth / 2 + 2}
                              y={leftY - 4}
                              textAnchor="middle"
                              className="text-[10px] font-bold fill-indigo-500 dark:fill-indigo-400"
                            >
                              {mod.chapters_left}
                            </text>
                          )}

                          {/* X-axis Module label */}
                          <text
                            x={xGroup}
                            y={plotYStart + plotHeight + 18}
                            textAnchor="middle"
                            className={`text-[10px] font-semibold transition-colors ${
                              isHovered
                                ? 'fill-brand-600 dark:fill-brand-400 font-bold'
                                : 'fill-slate-600 dark:fill-slate-300'
                            }`}
                          >
                            {mod.name.length > 14 ? `${mod.name.slice(0, 13)}…` : mod.name}
                          </text>

                          {/* Tooltip on hover */}
                          {isHovered && (
                            <g transform={`translate(${xGroup}, ${plotYStart - 10})`}>
                              <rect
                                x="-55"
                                y="-24"
                                width="110"
                                height="22"
                                rx="6"
                                className="fill-slate-900 dark:fill-slate-100 shadow-xl"
                              />
                              <text
                                x="0"
                                y="-10"
                                textAnchor="middle"
                                className="text-[9px] font-bold fill-white dark:fill-slate-900"
                              >
                                {t('chaptersRead')}: {mod.chapters_read} | {t('chaptersLeft')}: {mod.chapters_left}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          </div>

          {/* LINE GRAPH: Study Velocity & Mastery Score Curve */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <TrendingUpIcon className="w-4 h-4 text-brand-500" />
                  <span>{t('velocityTrend')}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  7-Day Cumulative Chapters Finished (Blue Curve) vs. Average Quiz Mastery (Green Curve)
                </p>
              </div>
            </div>

            {/* SVG Line Chart Canvas */}
            <div className="w-full overflow-x-auto">
              {(() => {
                const trend = currentSubject.velocity_trend || [];
                const chartHeight = 220;
                const chartWidth = Math.max(540, trend.length * 80 + 60);
                const plotHeight = 150;
                const plotYStart = 20;

                const maxRead = Math.max(...trend.map((d) => d.read), currentSubject.chapters_read, 5);

                const getX = (i) => 50 + (i * (chartWidth - 90)) / (trend.length - 1 || 1);
                const getYRead = (val) => plotYStart + plotHeight - (val / maxRead) * plotHeight;
                const getYScore = (score) => plotYStart + plotHeight - (score / 100) * plotHeight;

                // Build path string for Read velocity
                const readPoints = trend.map((d, i) => `${getX(i)},${getYRead(d.read)}`);
                const readPath = trend.length > 1
                  ? `M ${readPoints[0]} ` +
                    trend.slice(1).map((d, i) => {
                      const prevX = getX(i);
                      const prevY = getYRead(trend[i].read);
                      const curX = getX(i + 1);
                      const curY = getYRead(d.read);
                      const midX = (prevX + curX) / 2;
                      return `C ${midX},${prevY} ${midX},${curY} ${curX},${curY}`;
                    }).join(' ')
                  : '';

                const readArea = `${readPath} L ${getX(trend.length - 1)},${plotYStart + plotHeight} L ${getX(0)},${plotYStart + plotHeight} Z`;

                // Build path string for Score curve
                const scorePoints = trend.map((d, i) => `${getX(i)},${getYScore(d.score)}`);
                const scorePath = trend.length > 1
                  ? `M ${scorePoints[0]} ` +
                    trend.slice(1).map((d, i) => {
                      const prevX = getX(i);
                      const prevY = getYScore(trend[i].score);
                      const curX = getX(i + 1);
                      const curY = getYScore(d.score);
                      const midX = (prevX + curX) / 2;
                      return `C ${midX},${prevY} ${midX},${curY} ${curX},${curY}`;
                    }).join(' ')
                  : '';

                return (
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-auto select-none min-w-[500px]"
                  >
                    <defs>
                      <linearGradient id="velocityAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                      const y = plotYStart + plotHeight * (1 - r);
                      return (
                        <g key={i}>
                          <line
                            x1="45"
                            y1={y}
                            x2={chartWidth - 25}
                            y2={y}
                            stroke="currentColor"
                            className="text-slate-200 dark:text-slate-750"
                            strokeDasharray="3 3"
                            strokeWidth="1"
                          />
                          {/* Score axis label (right) */}
                          <text
                            x={chartWidth - 20}
                            y={y + 3}
                            className="text-[9px] fill-slate-400 font-medium"
                          >
                            {Math.round(r * 100)}%
                          </text>
                          {/* Read axis label (left) */}
                          <text
                            x="38"
                            y={y + 3}
                            textAnchor="end"
                            className="text-[9px] fill-slate-400 font-medium"
                          >
                            {Math.round(r * maxRead)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Area under Velocity line */}
                    {trend.length > 1 && (
                      <path d={readArea} fill="url(#velocityAreaGrad)" />
                    )}

                    {/* Velocity Curve (Blue) */}
                    {trend.length > 1 && (
                      <path
                        d={readPath}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    )}

                    {/* Score Curve (Emerald) */}
                    {trend.length > 1 && (
                      <path
                        d={scorePath}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    )}

                    {/* Markers on each point */}
                    {trend.map((d, i) => {
                      const x = getX(i);
                      const yR = getYRead(d.read);
                      const yS = getYScore(d.score);
                      const isHovered = hoveredLineIndex === i;

                      return (
                        <g
                          key={i}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredLineIndex(i)}
                          onMouseLeave={() => setHoveredLineIndex(null)}
                        >
                          {/* Interactive vertical hover indicator line */}
                          {isHovered && (
                            <line
                              x1={x}
                              y1={plotYStart}
                              x2={x}
                              y2={plotYStart + plotHeight}
                              stroke="#6366f1"
                              strokeWidth="1.5"
                              strokeDasharray="2 2"
                            />
                          )}

                          {/* Velocity marker */}
                          <circle
                            cx={x}
                            cy={yR}
                            r={isHovered ? 6 : 4}
                            className="fill-blue-500 stroke-white dark:stroke-slate-900 stroke-2 transition-all"
                          />

                          {/* Score marker */}
                          <circle
                            cx={x}
                            cy={yS}
                            r={isHovered ? 6 : 4}
                            className="fill-emerald-500 stroke-white dark:stroke-slate-900 stroke-2 transition-all"
                          />

                          {/* Day label */}
                          <text
                            x={x}
                            y={plotYStart + plotHeight + 18}
                            textAnchor="middle"
                            className={`text-[10px] font-semibold transition-colors ${
                              isHovered
                                ? 'fill-brand-600 dark:fill-brand-400 font-bold'
                                : 'fill-slate-500 dark:fill-slate-400'
                            }`}
                          >
                            {d.day}
                          </text>

                          {/* Hover Tooltip Box */}
                          {isHovered && (
                            <g transform={`translate(${x}, ${Math.min(yR, yS) - 20})`}>
                              <rect
                                x="-60"
                                y="-32"
                                width="120"
                                height="30"
                                rx="6"
                                className="fill-slate-900 dark:fill-slate-100 shadow-xl"
                              />
                              <text
                                x="0"
                                y="-19"
                                textAnchor="middle"
                                className="text-[9px] font-black fill-white dark:fill-slate-900"
                              >
                                {d.day}: {d.read} {t('chaptersRead')}
                              </text>
                              <text
                                x="0"
                                y="-7"
                                textAnchor="middle"
                                className="text-[8px] font-semibold fill-emerald-400 dark:fill-emerald-700"
                              >
                                {t('avgScore')}: {d.score}%
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          </div>

        </div>
      )}

      {/* 5. Tab Content: VIEW 2 - CURRICULUM CHAPTER FLOWCHART */}
      {(activeTab === 'flowchart' || activeTab === 'allCharts') && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800/40 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-800 space-y-5 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <GitFork className="w-4 h-4 text-brand-500" />
                <span>{t('visualChapterFlow')}</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Sequential pipeline of chapters. Click any chapter node to toggle read status or inspect key concepts.
              </p>
            </div>

            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {currentSubject.chapters?.length || 0} sequential learning stages
            </span>
          </div>

          {/* Interactive Flowchart Pipeline Nodes */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentSubject.chapters?.map((ch, idx) => {
                const isCompleted = ch.status === 'completed';
                const isInProgress = ch.status === 'in_progress';
                const isToggling = togglingChapterId === ch.id;

                return (
                  <div
                    key={ch.id}
                    onClick={() => setSelectedNode(ch)}
                    className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md ${
                      isCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
                        : isInProgress
                        ? 'bg-sky-50/70 dark:bg-sky-950/20 border-sky-300 dark:border-sky-800 shadow-sky-500/5'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-750 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Node Header: Step Number & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : isInProgress
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {ch.module}
                        </span>
                      </div>

                      {/* Status pill */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                          : isInProgress
                          ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-300 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300'
                      }`}>
                        {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        <span>
                          {isCompleted
                            ? t('chapterStatusCompleted')
                            : isInProgress
                            ? t('chapterStatusInProgress')
                            : t('chapterStatusLeft')}
                        </span>
                      </span>
                    </div>

                    {/* Chapter Title */}
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                      {ch.title}
                    </h4>

                    {/* Key Concept */}
                    {ch.key_concept && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <span className="font-semibold text-brand-600 dark:text-brand-400">{t('keyConcept')}:</span> {ch.key_concept}
                      </p>
                    )}

                    {/* Footer: Duration, Score, and Mark Read/Left Action */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{t(ch.duration) || ch.duration}</span>
                        </span>
                        {ch.score > 0 && (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ★ {ch.score}%
                          </span>
                        )}
                      </div>

                      {/* Interactive Check / Uncheck Button */}
                      <button
                        onClick={(e) => handleToggleChapter(ch.subject_id || currentSubject.id, ch.id, e)}
                        disabled={isToggling}
                        title={isCompleted ? t('markAsUnread') : t('markAsRead')}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1 ${
                          isCompleted
                            ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600 shadow-sm'
                        }`}
                      >
                        {isToggling ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : isCompleted ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                            <span>{t('markAsUnread')}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t('markAsRead')}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Flow Arrow to Next Node on Large Screens */}
                    {idx < currentSubject.chapters.length - 1 && (
                      <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <span className="p-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-400 flex items-center justify-center">
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Focus Drawer */}
          {selectedNode && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-brand-200 dark:border-brand-900/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                    {selectedNode.module}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedNode.title}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('keyConcept')}: <strong className="text-slate-700 dark:text-slate-200">{selectedNode.key_concept}</strong> | {t('avgScore')}: <strong className="text-emerald-500">{selectedNode.score}%</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Close
                </button>
                <button
                  onClick={(e) => handleToggleChapter(selectedNode.subject_id || currentSubject.id, selectedNode.id, e)}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                >
                  {selectedNode.status === 'completed' ? t('markAsUnread') : t('markAsRead')}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 6. Tab Content: VIEW 3 - CHAPTER LEDGER & CHECKLIST */}
      {activeTab === 'ledger' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Filter className="w-3.5 h-3.5 text-brand-500" />
              <span>{t('viewChapterList')}</span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs">
              <button
                onClick={() => setChapterFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  chapterFilter === 'all'
                    ? 'bg-brand-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t('totalChapters')} ({currentSubject.total_chapters})
              </button>
              <button
                onClick={() => setChapterFilter('completed')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  chapterFilter === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {t('chaptersRead')} ({currentSubject.chapters_read})
              </button>
              <button
                onClick={() => setChapterFilter('left')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  chapterFilter === 'left'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400'
                }`}
              >
                {t('chaptersLeft')} ({currentSubject.chapters_left})
              </button>
            </div>
          </div>

          {/* Chapters Table List */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {filteredChapters.map((ch, idx) => {
              const isCompleted = ch.status === 'completed';
              return (
                <div
                  key={ch.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={(e) => handleToggleChapter(ch.subject_id || currentSubject.id, ch.id, e)}
                      title={isCompleted ? t('markAsUnread') : t('markAsRead')}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600 hover:border-brand-500'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {ch.module}
                        </span>
                        <h4 className={`text-xs font-bold ${
                          isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          {ch.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-brand-600 dark:text-brand-400">{t('keyConcept')}:</span> {ch.key_concept}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pl-9 sm:pl-0">
                    <div className="text-right text-xs">
                      <span className="text-[10px] text-slate-400 block">{t(ch.duration) || ch.duration}</span>
                      <span className={`font-bold ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {ch.score > 0 ? `${ch.score}%` : '—'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleToggleChapter(ch.subject_id || currentSubject.id, ch.id, e)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                        isCompleted
                          ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600'
                      }`}
                    >
                      {isCompleted ? t('markAsUnread') : t('markAsRead')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

// Internal mini icon for Line Graph
const TrendingUpIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);
