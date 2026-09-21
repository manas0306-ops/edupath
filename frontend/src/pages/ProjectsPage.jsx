import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FolderGit2, Copy, Check, ExternalLink, Sparkles, Layers,
  Code2, FileText, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';

export const ProjectsPage = () => {
  const { user } = useAuth();
  const { t } = useTheme();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedReadme, setExpandedReadme] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('edupath_token');
        const res = await fetch('/api/roadmap/projects', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReadme = (id) => {
    setExpandedReadme(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Portfolio & GitHub Generator
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Turn your acquired competencies into hiring-manager-ready GitHub projects with auto-generated READMEs and resume bullets.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                    {proj.difficulty} • {proj.estimated_duration}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {proj.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                  {proj.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {proj.problem_statement}
            </p>

            {/* Tech Stack Chips */}
            <div>
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tech Stack:</p>
              <div className="flex flex-wrap gap-1.5">
                {proj.tech_stack?.map((tech, i) => (
                  <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Bullet Section */}
            {proj.resume_bullet && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>Resume Bullet Suggestion</span>
                  </span>
                  <button
                    onClick={() => copyText(proj.resume_bullet, `bullet-${proj.id}`)}
                    className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center space-x-1"
                  >
                    {copiedId === `bullet-${proj.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === `bullet-${proj.id}` ? "Copied" : "Copy Bullet"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{proj.resume_bullet}"
                </p>
              </div>
            )}

            {/* GitHub README Preview Toggle */}
            {proj.github_readme && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleReadme(proj.id)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition"
                >
                  <span className="flex items-center space-x-2">
                    <FolderGit2 className="w-4 h-4 text-brand-500" />
                    <span>Generated GitHub README.md Structure</span>
                  </span>
                  {expandedReadme[proj.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedReadme[proj.id] && (
                  <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto relative">
                    <button
                      onClick={() => copyText(proj.github_readme, `readme-${proj.id}`)}
                      className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition flex items-center space-x-1"
                    >
                      {copiedId === `readme-${proj.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === `readme-${proj.id}` ? "Copied" : "Copy"}</span>
                    </button>
                    <pre>{proj.github_readme}</pre>
                  </div>
                )}
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
