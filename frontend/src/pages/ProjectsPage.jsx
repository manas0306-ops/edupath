import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FolderGit2, Copy, Check, Sparkles, Layers,
  Code2, FileText, CheckCircle2, ChevronDown, ChevronUp,
  Plus, Edit3, X, Loader2, Award
} from 'lucide-react';

const SUGGESTED_PROJECTS = [
  { topic: "High-Throughput RAG Knowledge Agent", difficulty: "Advanced", skills: ["Python", "PyTorch", "FastAPI", "Docker"] },
  { topic: "Real-Time Event-Driven Microservices", difficulty: "Intermediate", skills: ["FastAPI", "Docker", "SQL", "Git"] },
  { topic: "Predictive Analytics & Churn Forecaster", difficulty: "Intermediate", skills: ["Python", "Pandas", "Scikit-learn", "NumPy"] }
];

export const ProjectsPage = () => {
  const { user } = useAuth();
  const { t } = useTheme();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedReadme, setExpandedReadme] = useState({});

  // Generate Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [genDifficulty, setGenDifficulty] = useState('Intermediate');
  const [generating, setGenerating] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editedBullet, setEditedBullet] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleGenerateProject = async (e) => {
    e?.preventDefault();
    if (!genTopic.trim()) return;
    setGenerating(true);
    try {
      const token = localStorage.getItem('edupath_token');
      const res = await fetch('/api/roadmap/projects/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          topic: genTopic,
          difficulty: genDifficulty
        })
      });
      if (res.ok) {
        await fetchProjects();
        setIsModalOpen(false);
        setGenTopic('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateStatus = async (projectId, newStatus) => {
    try {
      const token = localStorage.getItem('edupath_token');
      const res = await fetch(`/api/roadmap/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects(prev => prev.map(p => p.id === projectId ? updated : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBullet = async (projectId) => {
    setSavingEdit(true);
    try {
      const token = localStorage.getItem('edupath_token');
      const res = await fetch(`/api/roadmap/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ resume_bullet: editedBullet })
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects(prev => prev.map(p => p.id === projectId ? updated : p));
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Portfolio & GitHub Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Turn your acquired competencies into hiring-manager-ready GitHub projects with auto-generated READMEs and resume bullets.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-2 transition self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New AI Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {loading && projects.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading portfolio projects...</p>
          </div>
        ) : (
          projects.map((proj) => (
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
                    <button
                      onClick={() => handleUpdateStatus(proj.id, proj.status === 'Completed' ? 'In Progress' : 'Completed')}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                        proj.status === 'Completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {proj.status} (Click to toggle)
                    </button>
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

              {/* Resume Bullet Section with Inline Edit */}
              {proj.resume_bullet && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>Resume Bullet Suggestion</span>
                    </span>
                    <div className="flex items-center space-x-3">
                      {editingId === proj.id ? (
                        <button
                          disabled={savingEdit}
                          onClick={() => handleSaveBullet(proj.id)}
                          className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center space-x-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Save Bullet</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(proj.id);
                            setEditedBullet(proj.resume_bullet);
                          }}
                          className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        onClick={() => copyText(proj.resume_bullet, `bullet-${proj.id}`)}
                        className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center space-x-1"
                      >
                        {copiedId === `bullet-${proj.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === `bullet-${proj.id}` ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {editingId === proj.id ? (
                    <textarea
                      value={editedBullet}
                      onChange={(e) => setEditedBullet(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-brand-300 dark:border-brand-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      rows={3}
                    />
                  ) : (
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{proj.resume_bullet}"
                    </p>
                  )}
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
                      <pre className="whitespace-pre-wrap">{proj.github_readme}</pre>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Generate Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-brand-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Generate Custom Portfolio Project
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Topic / Scope
                </label>
                <input
                  type="text"
                  placeholder="e.g. Real-Time Distributed Notification Service"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Suggestions */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Popular Suggestions:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {SUGGESTED_PROJECTS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setGenTopic(s.topic);
                        setGenDifficulty(s.difficulty);
                      }}
                      className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 text-slate-600 dark:text-slate-300 transition"
                    >
                      {s.topic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setGenDifficulty(lvl)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        genDifficulty === lvl
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating || !genTopic.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white flex items-center space-x-1.5 shadow-md shadow-brand-500/20"
                >
                  {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{generating ? "Generating..." : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
