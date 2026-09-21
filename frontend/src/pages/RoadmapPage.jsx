import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Milestone, CheckCircle2, Circle, Clock, ExternalLink, Sparkles,
  BookOpen, Video, FileCode, Award, ArrowRight, RefreshCw, Layers, Zap, Loader2,
  Volume2, Square
} from 'lucide-react';


export const RoadmapPage = ({ onLaunchPractice }) => {
  const { user } = useAuth();
  const { t, isBriefMode, isSpeaking, speak, stopSpeaking, toggleSpeak } = useTheme();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [hours, setHours] = useState(user?.profile?.weekly_hours || 10);
  const [updatingVelocity, setUpdatingVelocity] = useState(false);


  const token = localStorage.getItem('edupath_token');

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/roadmap', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleToggleItem = async (itemId) => {
    setTogglingId(itemId);
    try {
      const res = await fetch(`/api/roadmap/items/${itemId}/toggle`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        // Refresh roadmap
        await fetchRoadmap();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleUpdateVelocity = async (newHours) => {
    setHours(newHours);
    setUpdatingVelocity(true);
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ weekly_hours: newHours })
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingVelocity(false);
    }
  };


  const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return Video;
      case 'course': return Award;
      case 'repository': return FileCode;
      default: return BookOpen;
    }
  };

  if (loading && !roadmap) {
    return (
      <div className="p-8 space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-64"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Executive Briefing Card for Roadmap (when Make it brief is ON) */}
      {isBriefMode && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-brand-500/10 to-indigo-500/10 border-2 border-amber-500/40 dark:border-amber-500/30 shadow-lg space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t('briefRoadmapTitle')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider">
                    {t('briefModeActive')}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('targetCareerTrack')} <span className="font-semibold text-brand-600 dark:text-brand-400">{t(roadmap?.target_role || 'AI/ML Engineer')}</span>
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
                  t('briefRoadmapTitle'),
                  t('briefRoadmapBullet1'),
                  t('briefRoadmapBullet2', { hours: hours || 10 }),
                  `${t('roadmapCompletion')}: ${roadmap?.progress_percentage || 0}%`
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
              <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                {t('briefRoadmapBullet1')}
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                {t('briefRoadmapBullet2', { hours: hours || 10 })}
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
              <span className="leading-relaxed">
                {t('roadmapCompletion')}: <strong className="text-brand-600 dark:text-brand-400">{roadmap?.progress_percentage || 0}%</strong>
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t(roadmap?.title) || t('roadmapTitle')}
            </h1>
            <button
              onClick={() => toggleSpeak(`${t(roadmap?.title) || t('roadmapTitle')}. ${t('roadmapSubtitle', { role: t(roadmap?.target_role) })}`)}
              title={t('readAloud')}
              className="p-1 rounded-lg text-slate-400 hover:text-brand-500 transition"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('roadmapSubtitle', { role: t(roadmap?.target_role) })}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">{t('roadmapCompletion')}</span>
            <p className="text-base font-extrabold text-brand-600 dark:text-brand-400">{roadmap?.progress_percentage || 0}%</p>
          </div>
          <button
            onClick={fetchRoadmap}
            title="Refresh Roadmap"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Velocity & Weekly Study Hours Controller */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="p-2 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <Zap className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {t('velocityCalibration')}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('velocityDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {[5, 10, 15, 20, 30].map((h) => (
            <button
              key={h}
              disabled={updatingVelocity}
              onClick={() => handleUpdateVelocity(h)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                hours === h
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {h}h / wk
            </button>
          ))}
          {updatingVelocity && <Loader2 className="w-3.5 h-3.5 text-brand-500 animate-spin ml-2" />}
        </div>
      </div>

      {/* Weekly Items Timeline */}

      <div className="space-y-6">
        {roadmap?.items?.map((item) => {
          const isCompleted = item.status === 'completed';
          const isInProgress = item.status === 'in_progress';

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all duration-200 ${
                item.is_adaptive_addition
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80 ring-1 ring-amber-500/20'
                  : isCompleted
                  ? 'bg-white/60 dark:bg-slate-900/60 border-emerald-300/60 dark:border-emerald-900/40 opacity-90'
                  : isInProgress
                  ? 'bg-white dark:bg-slate-900 border-brand-400 dark:border-brand-600 shadow-md ring-2 ring-brand-500/10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Left Week Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      item.is_adaptive_addition
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                        : isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                    }`}>
                      {item.is_adaptive_addition ? t('adaptiveRevisionModule') : t('weekN', { n: item.week_number })}
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.estimated_hours}h</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t(item.title)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t(item.description)}
                  </p>

                  {/* Learning Objectives */}
                  {item.learning_objectives && item.learning_objectives.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Learning Objectives:</p>
                      <ul className="space-y-1">
                        {item.learning_objectives.map((obj, oIdx) => (
                          <li key={oIdx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></span>
                            <span>{t(obj)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Action Controls */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2">
                  <button
                    onClick={() => handleToggleItem(item.id)}
                    disabled={togglingId === item.id}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-slate-400" />}
                    <span>{isCompleted ? t('Completed') : t('markAsComplete')}</span>
                  </button>

                  <button
                    onClick={() => onLaunchPractice(item.skill_covered)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm flex items-center space-x-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('practiceQuiz')}</span>
                  </button>
                </div>

              </div>

              {/* Curated Resources Attached */}
              {item.resources && item.resources.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Curated Resources</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.resources.map((res) => {
                      const Icon = getResourceIcon(res.resource_type);
                      return (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-brand-300 transition group flex items-start space-x-3 text-left"
                        >
                          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-brand-600 dark:text-brand-400 flex-shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">{res.provider}</span>
                              <span className="text-[10px] text-slate-400">• {res.estimated_minutes}m</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-600 transition">
                              {res.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{res.recommendation_reason}</p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 transition flex-shrink-0 mt-1" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
