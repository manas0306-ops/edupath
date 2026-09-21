import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, HelpCircle, Sparkles, Loader2, Award, ArrowRight } from 'lucide-react';

export const PracticeModal = ({ skillName, isOpen, onClose, onAttemptCompleted }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!isOpen || !skillName) return;

    const fetchTasks = async () => {
      setLoading(true);
      setResult(null);
      setSelectedOption('');
      setShowHint(false);
      try {
        const token = localStorage.getItem('edupath_token');
        const res = await fetch(`/api/practice/${encodeURIComponent(skillName)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [isOpen, skillName]);

  if (!isOpen) return null;

  const currentTask = tasks[currentIdx];

  const handleSubmit = async () => {
    if (!selectedOption || !currentTask) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('edupath_token');
      const res = await fetch('/api/practice/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          task_id: currentTask.id,
          user_answer: selectedOption,
          time_taken_seconds: 35
        })
      });
      if (res.ok) {
        const evalResult = await res.json();
        setResult(evalResult);
        if (onAttemptCompleted) onAttemptCompleted(evalResult);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setResult(null);
    setSelectedOption('');
    setShowHint(false);
    if (currentIdx + 1 < tasks.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Diagnostic Assessment: {skillName}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Question {currentIdx + 1} of {tasks.length || 1}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              <p className="text-xs text-slate-500">Generating personalized challenge...</p>
            </div>
          ) : currentTask ? (
            <>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {currentTask.difficulty} • {currentTask.task_type.replace('_', ' ')}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {currentTask.title}
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {currentTask.question}
                </p>
              </div>

              {/* Code Snippet if present */}
              {currentTask.code_snippet && (
                <div className="rounded-xl overflow-hidden bg-slate-950 text-slate-100 text-xs font-mono p-4 border border-slate-800">
                  <pre className="overflow-x-auto">{currentTask.code_snippet}</pre>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2.5">
                {currentTask.options.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={i}
                      disabled={!!result}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hint Toggle */}
              {currentTask.hint && !result && (
                <div>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center space-x-1.5 text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
                  </button>
                  {showHint && (
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 bg-brand-50/50 dark:bg-brand-950/30 p-2.5 rounded-lg border border-brand-200 dark:border-brand-900">
                      💡 {currentTask.hint}
                    </p>
                  )}
                </div>
              )}

              {/* Result Feedback Card */}
              {result && (
                <div className={`p-4 rounded-2xl border animate-fade-in ${
                  result.is_correct
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 font-bold text-sm">
                      {result.is_correct ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span>Correct Solution!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-500" />
                          <span>Incorrect Answer</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 shadow-sm">
                      +{result.xp_earned} XP
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed opacity-90">{result.explanation}</p>

                  {/* Adaptive Engine trigger notification */}
                  {result.adaptive_action && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-2">
                      <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{result.adaptive_action}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-slate-400">
              No questions found for this topic.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {!result ? (
            <button
              disabled={!selectedOption || submitting}
              onClick={handleSubmit}
              className="text-xs font-bold px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white shadow-md shadow-brand-500/20 transition flex items-center space-x-1.5"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>Verify Answer</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="text-xs font-bold px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition flex items-center space-x-1.5"
            >
              <span>{currentIdx + 1 < tasks.length ? "Next Challenge" : "Done"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
