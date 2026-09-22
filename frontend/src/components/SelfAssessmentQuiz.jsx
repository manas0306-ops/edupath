import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  BrainCircuit, Sparkles, CheckCircle2, XCircle, HelpCircle,
  Clock, ArrowRight, RotateCcw, Volume2, Square, Award,
  Check, ChevronDown, Filter, AlertTriangle, Loader2
} from 'lucide-react';

const TOPIC_OPTIONS = [
  { id: 'all', name: 'All Programming Topics', icon: '🌐' },
  { id: 'python', name: 'Python & Data Structures', icon: '🐍' },
  { id: 'sql', name: 'SQL & Database Engineering', icon: '💾' },
  { id: 'pytorch', name: 'PyTorch & Deep Learning', icon: '🔥' },
  { id: 'ml', name: 'Machine Learning Algorithms', icon: '🤖' },
  { id: 'fastapi', name: 'FastAPI & Microservices', icon: '⚡' }
];

const LANGUAGE_CHIPS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' }
];

export const SelfAssessmentQuiz = ({ initialTopic = 'all' }) => {
  const { t, language, isSpeaking, speak, stopSpeaking } = useTheme();

  // Mode: 'configure' | 'active' | 'review'
  const [quizState, setQuizState] = useState('configure');

  // Config settings
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isTimed, setIsTimed] = useState(false);

  // Active quiz state
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: option }
  const [showHint, setShowHint] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Review state
  const [evaluation, setEvaluation] = useState(null);
  const [activeReviewLangs, setActiveReviewLangs] = useState({}); // { [qId]: langCode }

  const timerRef = useRef(null);

  // Timer runner
  useEffect(() => {
    if (quizState === 'active') {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [quizState]);

  const handleStartQuiz = async () => {
    setLoading(true);
    setUserAnswers({});
    setCurrentIdx(0);
    setTimeElapsed(0);
    setShowHint(false);
    try {
      const token = localStorage.getItem('edupath_token');
      const res = await fetch('/api/practice/quiz/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty: difficulty,
          num_questions: numQuestions,
          timed: isTimed
        })
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
        setQuizState('active');
      }
    } catch (err) {
      console.error('Failed to create quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    const currentQ = questions[currentIdx];
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const token = localStorage.getItem('edupath_token');
      const res = await fetch('/api/practice/quiz/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          topic: selectedTopic,
          answers: userAnswers,
          time_taken_seconds: timeElapsed
        })
      });

      if (res.ok) {
        const evalData = await res.json();
        setEvaluation(evalData);
        // Initialize review languages to default app language
        const initialLangs = {};
        evalData.results.forEach((r) => {
          initialLangs[r.id] = language;
        });
        setActiveReviewLangs(initialLangs);
        setQuizState('review');
      }
    } catch (err) {
      console.error('Failed to evaluate quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- 1. CONFIGURATION SCREEN ---
  if (quizState === 'configure') {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-7 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20">
              <BrainCircuit className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {t('selfAssessmentQuiz')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate customized diagnostic evaluations with detailed multilingual explanations
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Topic Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {t('selectTopic')}
            </label>
            <div className="relative">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition cursor-pointer shadow-sm"
              >
                {TOPIC_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.icon} {opt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Difficulty Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition ${
                    difficulty === lvl
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {t('numQuestions')}
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumQuestions(num)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition ${
                    numQuestions === num
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Feature Highlights Pill Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="font-semibold">Includes full multilingual explanations across 7 languages</span>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            +25 XP per correct solution
          </span>
        </div>

        {/* Launch Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleStartQuiz}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-brand-500/25 flex items-center space-x-2 transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{t('startQuiz')}</span>
          </button>
        </div>

      </div>
    );
  }

  // --- 2. ACTIVE QUIZ RUNNER ---
  if (quizState === 'active') {
    const currentQ = questions[currentIdx];
    const progressPct = questions.length ? Math.round(((currentIdx + 1) / questions.length) * 100) : 0;
    const selectedAns = currentQ ? userAnswers[currentQ.id] : null;

    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
        
        {/* Quiz Top Runner Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-900/60">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              {currentQ?.topic.toUpperCase()} • {currentQ?.difficulty}
            </span>
          </div>

          {/* Live Timer */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            <span>{formatSeconds(timeElapsed)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        {/* Question & Code challenge body */}
        {currentQ && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {currentQ.code_snippet && (
              <div className="rounded-2xl overflow-hidden bg-slate-950 text-emerald-400 font-mono text-xs p-4 border border-slate-800 shadow-inner">
                <pre className="overflow-x-auto whitespace-pre-wrap">{currentQ.code_snippet}</pre>
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedAns === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs font-medium transition-all flex items-start space-x-3.5 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 font-bold ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-300 dark:border-slate-700 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Hint Drawer */}
            {currentQ.hint && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center space-x-1 text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
                </button>
                {showHint && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 leading-relaxed">
                    💡 {currentQ.hint}
                  </p>
                )}
              </div>
            )}

          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            onClick={() => {
              if (currentIdx > 0) setCurrentIdx((prev) => prev - 1);
            }}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Previous
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Submit Assessment</span>
            </button>
          )}
        </div>

      </div>
    );
  }

  // --- 3. SCORECARD & DETAILED REVIEW ---
  if (quizState === 'review' && evaluation) {
    const handleVoiceExplanation = (qId, text, langCode) => {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        speak(text, langCode);
      }
    };

    return (
      <div className="space-y-6 animate-fade-in">
        
        {/* Scorecard Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400">
              Diagnostic Assessment Results
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('quizScorecard')}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
              {evaluation.feedback}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                +{evaluation.xp_earned} XP Earned
              </span>
              <span className="text-xs text-slate-400">
                Time: {formatSeconds(evaluation.time_taken_seconds)}
              </span>
            </div>
          </div>

          {/* Radial Score Circle */}
          <div className="flex items-center space-x-6">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="9"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={evaluation.score_percentage >= 70 ? "stroke-emerald-500" : "stroke-amber-500"}
                  strokeWidth="9"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - evaluation.score_percentage / 100)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {Math.round(evaluation.score_percentage)}%
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  {evaluation.correct_count} / {evaluation.total_questions}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setQuizState('configure')}
                className="w-full px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('retakeQuiz')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Question-by-Question Review with Multilingual Explanations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 px-1">
            <HelpCircle className="w-4 h-4 text-brand-500" />
            <span>Comprehensive Question Review & Multilingual Explanations</span>
          </h3>

          <div className="space-y-4">
            {evaluation.results.map((resItem, idx) => {
              const activeLang = activeReviewLangs[resItem.id] || language;
              const explanationText = resItem.explanations?.[activeLang] || resItem.explanations?.en || '';

              return (
                <div
                  key={resItem.id}
                  className={`p-5 sm:p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm space-y-4 transition-all ${
                    resItem.is_correct
                      ? 'border-emerald-200 dark:border-emerald-900/40'
                      : 'border-rose-200 dark:border-rose-900/40'
                  }`}
                >
                  {/* Question Header & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                        resItem.is_correct
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {resItem.question}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center space-x-1 w-fit ${
                      resItem.is_correct
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300'
                    }`}>
                      {resItem.is_correct ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{resItem.is_correct ? 'Correct' : 'Needs Review'}</span>
                    </span>
                  </div>

                  {/* Code snippet if present */}
                  {resItem.code_snippet && (
                    <div className="rounded-xl overflow-hidden bg-slate-950 text-emerald-400 font-mono text-xs p-3.5 border border-slate-800">
                      <pre className="overflow-x-auto whitespace-pre-wrap">{resItem.code_snippet}</pre>
                    </div>
                  )}

                  {/* Answers Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className={`p-3 rounded-xl border ${
                      resItem.is_correct
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                    }`}>
                      <span className="font-bold text-[10px] uppercase block opacity-70">Your Answer</span>
                      <p className="font-semibold mt-0.5">{resItem.user_answer || '(No answer chosen)'}</p>
                    </div>

                    <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      <span className="font-bold text-[10px] uppercase block opacity-70 text-brand-600 dark:text-brand-400">Correct Solution</span>
                      <p className="font-semibold mt-0.5">{resItem.correct_answer}</p>
                    </div>
                  </div>

                  {/* Multilingual Explanation Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                          {t('multilingualExplanation')}
                        </span>
                      </div>

                      {/* Language Selector Chips */}
                      <div className="flex flex-wrap gap-1">
                        {LANGUAGE_CHIPS.map((chip) => (
                          <button
                            key={chip.code}
                            onClick={() => setActiveReviewLangs((prev) => ({ ...prev, [resItem.id]: chip.code }))}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 ${
                              activeLang === chip.code
                                ? 'bg-brand-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <span>{chip.flag}</span>
                            <span>{chip.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {explanationText}
                    </p>

                    <button
                      onClick={() => handleVoiceExplanation(resItem.id, explanationText, activeLang)}
                      className="text-[11px] font-bold text-brand-600 dark:text-brand-400 flex items-center space-x-1 hover:underline pt-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('readExplanationAloud')}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  return null;
};
