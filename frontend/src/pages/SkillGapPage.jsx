import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SkillGraph } from '../components/SkillGraph';
import {
  UploadCloud, CheckCircle2, AlertCircle, Sparkles, Loader2, ArrowRight,
  Plus, Trash2, Edit3, Layers, BookOpen, Clock, Zap, Target, Compass, X
} from 'lucide-react';

export const SkillGapPage = ({ onLaunchPractice }) => {
  const { user } = useAuth();
  const { t } = useTheme();

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(user?.profile?.target_role || "AI/ML Engineer");
  const [gapData, setGapData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Career Explorer state
  const [isCareerOpen, setIsCareerOpen] = useState(false);
  const [careerList, setCareerList] = useState([]);
  const [careerLoading, setCareerLoading] = useState(false);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadText, setUploadText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [customSkillInput, setCustomSkillInput] = useState('');


  const token = localStorage.getItem('edupath_token');

  // Load roles and gap data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Roles
        const roleRes = await fetch('/api/skills/roles');
        if (roleRes.ok) {
          const roleList = await roleRes.json();
          setRoles(roleList);
        }

        // 2. Gap analysis for selected role
        const gapRes = await fetch('/api/skills/gap-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify({ target_role: selectedRole })
        });
        if (gapRes.ok) {
          const gData = await gapRes.json();
          setGapData(gData);
        }

        // 3. Graph data
        const graphRes = await fetch(`/api/skills/graph?target_role=${encodeURIComponent(selectedRole)}`, {
          headers
        });
        if (graphRes.ok) {
          const grData = await graphRes.json();
          setGraphData(grData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedRole, token]);

  const handleRoleChange = (roleTitle) => {
    setSelectedRole(roleTitle);
  };

  const fetchCareerExplorer = async () => {
    setIsCareerOpen(true);
    setCareerLoading(true);
    try {
      const res = await fetch('/api/skills/compare-roles', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setCareerList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCareerLoading(false);
    }
  };


  const handleUploadSubmit = async () => {
    if (!uploadFile && !uploadText.trim()) return;
    setParsing(true);
    try {
      const formData = new FormData();
      if (uploadFile) formData.append('file', uploadFile);
      if (uploadText.trim()) formData.append('raw_text', uploadText);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setExtractedData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setParsing(false);
    }
  };

  const handleConfirmSkills = async () => {
    if (!extractedData) return;
    setLoading(true);
    try {
      const res = await fetch('/api/skills/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          skills: extractedData.technical_skills,
          target_role: selectedRole
        })
      });
      if (res.ok) {
        setIsUploadOpen(false);
        setExtractedData(null);
        // Refresh gap data
        const gapRes = await fetch('/api/skills/gap-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ target_role: selectedRole })
        });
        if (gapRes.ok) setGapData(await gapRes.json());

        const graphRes = await fetch(`/api/skills/graph?target_role=${encodeURIComponent(selectedRole)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (graphRes.ok) setGraphData(await graphRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCustomSkill = () => {
    if (!customSkillInput.trim() || !extractedData) return;
    const newSkill = {
      name: customSkillInput.trim(),
      category: "Technical",
      proficiency: "Intermediate",
      confidence: 0.9
    };
    setExtractedData({
      ...extractedData,
      technical_skills: [...extractedData.technical_skills, newSkill]
    });
    setCustomSkillInput('');
  };

  const removeSkill = (index) => {
    if (!extractedData) return;
    const updated = [...extractedData.technical_skills];
    updated.splice(index, 1);
    setExtractedData({ ...extractedData, technical_skills: updated });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Controls & Upload CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('skillGapEngine')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('skillGapSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchCareerExplorer}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center space-x-2 shadow-sm"
          >
            <Compass className="w-4 h-4 text-brand-500" />
            <span>{t('careerExplorerBtn')}</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition flex items-center space-x-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t('uploadResume')}</span>
          </button>
        </div>
      </div>

      {/* Role Picker Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {roles.map((r) => {
          const isActive = selectedRole === r.title;
          return (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.title)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {t(r.title) || r.title}
            </button>
          );
        })}
      </div>

      {/* Readiness Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300">
            {t('currentTarget')}
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {gapData?.readiness_percentage || 0}% {t('matchReadiness')} • {t(selectedRole) || selectedRole}
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            {gapData?.mastered_skills?.length || 0} {t('masteredSkills').toLowerCase()} • {gapData?.total_estimated_hours || 0}h
          </p>
        </div>

        <div className="w-32 h-32 flex-shrink-0 relative flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200 dark:text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-brand-500"
              strokeDasharray={`${gapData?.readiness_percentage || 0}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {gapData?.readiness_percentage || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Skill Dependency Graph */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-brand-500" />
          <span>Interactive Skill Dependency Map</span>
        </h3>
        <SkillGraph graphData={graphData} onSelectSkill={(skill) => onLaunchPractice(skill)} />
      </div>

      {/* Categorized Gap Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Missing Advanced Gaps */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Missing & Advanced Requirements ({gapData?.missing_skills?.length || 0})</span>
            </h4>
            <span className="text-[10px] text-slate-400">High Impact</span>
          </div>

          <div className="space-y-2.5">
            {gapData?.missing_skills?.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.skill_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">
                      {(item.gap_type || "Gap").split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Est. {item.estimated_hours} hrs • Difficulty: {item.difficulty}
                  </p>
                </div>
                <button
                  onClick={() => onLaunchPractice(item.skill_name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 transition"
                  title="Test Skill"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Partial & Intermediate Gaps */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Partial Knowledge Gaps ({gapData?.partial_skills?.length || 0})</span>
            </h4>
            <span className="text-[10px] text-slate-400">Prerequisites Met</span>
          </div>

          <div className="space-y-2.5">
            {gapData?.partial_skills?.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.skill_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold">
                      Intermediate
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Est. {item.estimated_hours} hrs • Prereq: {item.dependencies.join(', ') || 'None'}
                  </p>
                </div>
                <button
                  onClick={() => onLaunchPractice(item.skill_name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 transition"
                  title="Test Skill"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Resume Upload & Review Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <UploadCloud className="w-4 h-4 text-brand-500" />
                <span>Resume & Document Skill Extraction</span>
              </h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {!extractedData ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-brand-500 transition">
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Upload your PDF, DOCX, or Text Resume
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Maximum file size: 10 MB</p>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="mt-4 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 dark:file:bg-brand-950 dark:file:text-brand-300 hover:file:bg-brand-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Or paste portfolio / project descriptions:
                  </label>
                  <textarea
                    rows={4}
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                    placeholder="e.g. Developed scalable REST APIs using Python, FastAPI, and PostgreSQL. Built deep learning classification models with PyTorch..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsUploadOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={(!uploadFile && !uploadText.trim()) || parsing}
                    onClick={handleUploadSubmit}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-brand-500/20"
                  >
                    {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{parsing ? "Analyzing Document..." : "Extract Skills"}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Review & Confirm Skills Screen */
              <div className="space-y-5 animate-fade-in">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300">
                  ✓ Successfully extracted skills! Please review, edit, or add missing competencies before saving.
                </div>

                {/* Extracted Skills Chips */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Detected Technical Skills ({extractedData.technical_skills.length}):
                  </h4>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {extractedData.technical_skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200/80 dark:border-slate-700"
                      >
                        <span>{skill.name}</span>
                        <span className="text-[10px] text-slate-400">({skill.proficiency})</span>
                        <button
                          onClick={() => removeSkill(idx)}
                          className="hover:text-rose-500 transition pl-1 text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Custom Skill */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                    placeholder="Add any missing skill (e.g. Docker, PyTorch)..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs outline-none"
                  />
                  <button
                    onClick={addCustomSkill}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setExtractedData(null)}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    ← Upload different file
                  </button>
                  <button
                    onClick={handleConfirmSkills}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Update Gap Engine</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Career Explorer & Role Comparator Modal */}
      {isCareerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                  <Compass className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Industry Career Explorer & Cross-Role Benchmark
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Compare your current competencies against 5 high-demand tech roles simultaneously.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCareerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {careerLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                  <p className="text-xs text-slate-400">Evaluating your skills against all industry roles...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerList.map((comp) => {
                    const isCurrent = selectedRole === comp.role_title;
                    return (
                      <div
                        key={comp.role_id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-300 dark:border-brand-700 ring-2 ring-brand-500/20'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                  {comp.role_title}
                                </h4>
                                {isCurrent && (
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white">
                                    Current Target
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                                {comp.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[10px]">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                              💰 {comp.average_salary}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold">
                              📈 {comp.demand}
                            </span>
                          </div>

                          {/* Readiness Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                              <span className="text-slate-600 dark:text-slate-400">Match Readiness</span>
                              <span className={comp.readiness_percentage >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                                {comp.readiness_percentage}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  comp.readiness_percentage >= 60 ? 'bg-emerald-500' : comp.readiness_percentage >= 35 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${comp.readiness_percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">
                              {comp.matched_skills_count} of {comp.total_required_skills} skills mastered • Est. {comp.estimated_weeks_to_ready} weeks
                            </p>
                          </div>

                          {/* Skills Pills */}
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Missing Gaps:</p>
                            <div className="flex flex-wrap gap-1">
                              {comp.missing_skills.slice(0, 4).map((sk, idx) => (
                                <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {sk}
                                </span>
                              ))}
                              {comp.missing_skills.length > 4 && (
                                <span className="text-[9px] text-slate-400">+{comp.missing_skills.length - 4} more</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          disabled={isCurrent}
                          onClick={() => {
                            handleRoleChange(comp.role_title);
                            setIsCareerOpen(false);
                          }}
                          className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                            isCurrent
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
                          }`}
                        >
                          <span>{isCurrent ? "Active Target Role" : "Select As Target Track"}</span>
                          {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
              <button
                onClick={() => setIsCareerOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Close Explorer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

