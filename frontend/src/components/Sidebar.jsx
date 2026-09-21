import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  GitFork,
  Milestone,
  BrainCircuit,
  FolderGit2,
  BotMessageSquare,
  FileBarChart,
  Award
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { t } = useTheme();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'skill-gap', label: t('skillGap'), icon: GitFork },
    { id: 'roadmap', label: t('roadmap'), icon: Milestone },
    { id: 'practice', label: t('practice'), icon: BrainCircuit },
    { id: 'projects', label: t('projects'), icon: FolderGit2 },
    { id: 'mentor', label: t('aiMentor'), icon: BotMessageSquare },
    { id: 'reports', label: t('reports'), icon: FileBarChart },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block border-r border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Pro Badge Card */}
      <div className="mt-8 p-3.5 rounded-2xl bg-gradient-to-br from-brand-900/20 to-sky-900/10 border border-brand-200/50 dark:border-brand-800/40 text-left">
        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-bold text-xs mb-1">
          <Award className="w-4 h-4" />
          <span>Adaptive AI Active</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Dynamic curriculum adapts daily based on your quiz accuracy and problem-solving speed.
        </p>
      </div>
    </aside>
  );
};
