import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Compass, ArrowRight, Sparkles, BrainCircuit, Milestone,
  ShieldCheck, Zap, Bot, FileText, CheckCircle2, ChevronRight,
  TrendingUp, Award
} from 'lucide-react';

export const LandingPage = ({ onGetStarted, onExploreDemo }) => {
  const { t } = useTheme();
  const { loginDemo } = useAuth();

  const handleDemoClick = async () => {
    try {
      await loginDemo();
      if (onExploreDemo) onExploreDemo();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/20 to-sky-500/20 blur-[120px] -z-10 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-brand-200 dark:border-brand-800/80 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Autonomous Skill Gap & Career Acceleration Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Learn Smarter.<br />
            <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <span>{t('buildPathBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>{t('exploreDemoBtn')}</span>
            </button>
          </div>

          {/* Key Stat Badges */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            {[
              { label: "Role Precision", val: "99.2%", sub: "Target Benchmarking" },
              { label: "Adaptive Loops", val: "Dynamic", sub: "Struggle Detection" },
              { label: "Multilingual", val: "7 Languages", sub: "Full Localization" },
              { label: "AI Mentor", val: "24/7 Voice", sub: "Real Learner Context" },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
                <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{stat.val}</p>
                <p className="text-xs font-bold text-brand-600 dark:text-brand-400 mt-0.5">{stat.label}</p>
                <p className="text-[10px] text-slate-400">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineered for Real Career Outcomes
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Generic tutorials waste hundreds of hours. EduPath pinpoints exact missing skills and guides your transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Resume & Portfolio Parsing",
                desc: "Upload your PDF or DOCX resume. Our NLP pipeline instantly parses technical proficiencies and formats a reviewable profile.",
                color: "text-blue-500 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900"
              },
              {
                icon: BrainCircuit,
                title: "Categorized Skill Gap Engine",
                desc: "Classifies gaps into Beginner (unlearned), Intermediate (partial knowledge), and Advanced gaps with topological prerequisite ordering.",
                color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900"
              },
              {
                icon: Milestone,
                title: "Dynamic Weekly Roadmaps",
                desc: "Converts gaps into structured weekly milestones calibrated against your available study hours with curated documentation, videos, and labs.",
                color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900"
              },
              {
                icon: TrendingUp,
                title: "Adaptive Learning Engine",
                desc: "Struggling with a concept? EduPath detects weaknesses from diagnostic quizzes and automatically inserts targeted refresher modules.",
                color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900"
              },
              {
                icon: Bot,
                title: "Voice-Enabled AI Mentor",
                desc: "Ask questions naturally using voice speech-to-text. The mentor provides responses conditioned on your actual learning progress.",
                color: "text-purple-500 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900"
              },
              {
                icon: Award,
                title: "Portfolio & GitHub Mode",
                desc: "Turn newly acquired skills into real GitHub projects with auto-generated README templates and resume bullet points.",
                color: "text-rose-500 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900"
              }
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${f.color} mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-200">
            <Compass className="w-4 h-4 text-brand-500" />
            <span>EduPath AI Agent</span>
          </div>
          <p>© 2026 EduPath. Built with FastAPI, React 19, and Adaptive AI.</p>
        </div>
      </footer>
    </div>
  );
};
