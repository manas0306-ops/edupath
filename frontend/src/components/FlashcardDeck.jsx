import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Layers, Shuffle, CheckCircle2, Star, ArrowLeft, ArrowRight,
  RotateCw, Volume2, Square, Sparkles, ChevronDown, BookOpen,
  Code2, Check, AlertCircle, HelpCircle, Loader2
} from 'lucide-react';

const LANGUAGE_CHIPS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' }
];

export const FlashcardDeck = () => {
  const { t, language, isSpeaking, speak, stopSpeaking } = useTheme();

  const [deckData, setDeckData] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [explanationLang, setExplanationLang] = useState(language);
  const [loading, setLoading] = useState(true);
  const [shuffling, setShuffling] = useState(false);

  // Sync default explanation language when app language changes
  useEffect(() => {
    setExplanationLang(language);
  }, [language]);

  const fetchFlashcards = async (topic = 'all') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('edupath_token');
      const res = await fetch(`/api/flashcards?topic=${encodeURIComponent(topic)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setDeckData(data);
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (err) {
      console.error('Failed to load flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards(selectedTopic);
  }, [selectedTopic]);

  const cards = deckData?.cards || [];
  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = useCallback(() => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const handleShuffle = () => {
    if (!deckData || cards.length <= 1) return;
    setShuffling(true);
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setDeckData({ ...deckData, cards: shuffled });
      setCurrentIndex(0);
      setShuffling(false);
    }, 250);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!currentCard) return;

    // Optimistic local update
    setDeckData((prev) => {
      if (!prev) return prev;
      const updatedCards = prev.cards.map((c) => {
        if (c.id === currentCard.id) {
          const isM = newStatus === 'mastered' ? !c.is_mastered : false;
          const isR = newStatus === 'review_later' ? !c.needs_review : false;
          return { ...c, is_mastered: isM, needs_review: isR };
        }
        return c;
      });
      return {
        ...prev,
        cards: updatedCards,
        mastered_count: updatedCards.filter((c) => c.is_mastered).length,
        review_count: updatedCards.filter((c) => c.needs_review).length
      };
    });

    try {
      const token = localStorage.getItem('edupath_token');
      await fetch(`/api/flashcards/${currentCard.id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          card_id: currentCard.id,
          status: newStatus
        })
      });
    } catch (err) {
      console.error('Error saving flashcard status:', err);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'm' || e.key === 'M') {
        handleStatusUpdate('mastered');
      } else if (e.key === 'r' || e.key === 'R') {
        handleStatusUpdate('review_later');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, currentCard]);

  // Audio speech narration
  const handleReadAloud = (e) => {
    if (e) e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    if (!currentCard) return;

    if (!isFlipped) {
      speak(currentCard.front_prompt);
    } else {
      const explanation = currentCard.explanations?.[explanationLang] || currentCard.explanations?.en || '';
      const textToRead = `${currentCard.back_answer}. ${t('keyTakeaway')}: ${currentCard.key_takeaway}. ${explanation}`;
      speak(textToRead, explanationLang);
    }
  };

  if (loading && !deckData) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center py-20 space-y-3 animate-pulse">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-xs text-slate-500 font-bold">Loading interactive flashcard deck...</p>
      </div>
    );
  }

  const currentExplanation =
    currentCard?.explanations?.[explanationLang] ||
    currentCard?.explanations?.en ||
    '';

  const progressPercent = cards.length
    ? Math.round(((currentIndex + 1) / cards.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* 1. Deck Controls & Topic Selector Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-brand-500 text-white shadow-md shadow-brand-500/20">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{t('flashcardsTab')}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  {cards.length} {t('cardsRemaining').toLowerCase() || 'cards'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active recall & spaced repetition with multilingual explanations
              </p>
            </div>
          </div>
        </div>

        {/* Topic dropdown & Shuffle */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[210px]">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition cursor-pointer shadow-sm"
            >
              {deckData?.available_topics?.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.icon} {topic.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleShuffle}
            title={t('shuffleDeck')}
            className={`p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition shadow-sm ${
              shuffling ? 'animate-spin text-brand-500' : ''
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Deck Progress Bar & Counter Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Card {cards.length > 0 ? currentIndex + 1 : 0} of {cards.length}
          </span>
          <div className="w-32 sm:w-48 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{deckData?.mastered_count || 0} {t('mastered')}</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-500 dark:text-amber-400 font-semibold">
            <Star className="w-4 h-4" />
            <span>{deckData?.review_count || 0} {t('reviewLater')}</span>
          </span>
        </div>
      </div>

      {/* 3. Interactive 3D Flip Card */}
      {currentCard ? (
        <div className="w-full flex flex-col items-center">
          <div
            onClick={handleFlip}
            className="w-full max-w-3xl min-h-[380px] sm:min-h-[420px] cursor-pointer select-none group [perspective:1000px]"
          >
            <div
              className={`relative w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl transition-transform duration-500 [transform-style:preserve-3d] shadow-xl border ${
                isFlipped
                  ? '[transform:rotateY(180deg)] border-brand-500/40'
                  : 'border-slate-200 dark:border-slate-800 hover:border-brand-400/60'
              }`}
            >
              
              {/* === FRONT OF CARD === */}
              <div
                className={`absolute inset-0 w-full h-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 flex flex-col justify-between [backface-visibility:hidden] ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                {/* Card Top Metadata */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-900/60">
                        {currentCard.topic.toUpperCase()} • {currentCard.subtopic}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {currentCard.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleReadAloud}
                        title={t('readExplanationAloud')}
                        className="p-2 rounded-xl text-slate-400 hover:text-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        {isSpeaking ? (
                          <Square className="w-4 h-4 text-red-500 animate-pulse fill-current" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Main Question / Concept */}
                  <div className="mt-6 space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {currentCard.front_prompt}
                    </h3>

                    {/* Code Snippet if present */}
                    {currentCard.code_snippet && (
                      <div className="rounded-2xl overflow-hidden bg-slate-950 text-emerald-400 font-mono text-xs p-4 border border-slate-800 shadow-inner">
                        <pre className="overflow-x-auto whitespace-pre-wrap">{currentCard.code_snippet}</pre>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Cue */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center space-x-1.5 text-slate-500">
                    <RotateCw className="w-3.5 h-3.5 text-brand-500 group-hover:rotate-180 transition-transform duration-500" />
                    <span>{t('clickToFlip')}</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    {currentCard.tags?.map((tag, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* === BACK OF CARD === */}
              <div
                className={`absolute inset-0 w-full h-full p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/20 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Top Bar on Back */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{t('chapterStatusCompleted')} / Solution</span>
                    </span>

                    <button
                      onClick={handleReadAloud}
                      title={t('readExplanationAloud')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      {isSpeaking ? (
                        <Square className="w-4 h-4 text-red-500 animate-pulse fill-current" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Core Answer */}
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                      {currentCard.back_answer}
                    </h4>
                  </div>

                  {/* Key Takeaway Banner */}
                  <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs">
                    <span className="font-black text-brand-600 dark:text-brand-400 uppercase tracking-wider text-[10px] block mb-0.5">
                      💡 {t('keyTakeaway')}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {currentCard.key_takeaway}
                    </p>
                  </div>

                  {/* Multilingual Explanations Section */}
                  <div className="space-y-2 pt-1" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {t('multilingualExplanation')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {LANGUAGE_CHIPS.find((l) => l.code === explanationLang)?.label}
                      </span>
                    </div>

                    {/* Language selector chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {LANGUAGE_CHIPS.map((chip) => (
                        <button
                          key={chip.code}
                          onClick={() => setExplanationLang(chip.code)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 ${
                            explanationLang === chip.code
                              ? 'bg-brand-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span>{chip.flag}</span>
                          <span>{chip.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Detailed explanation text */}
                    <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {currentExplanation}
                    </div>
                  </div>

                </div>

                {/* Back Footer Cue */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center space-x-1 text-slate-500">
                    <RotateCw className="w-3.5 h-3.5 text-brand-500" />
                    <span>{t('clickToFlip')}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Space to flip</span>
                </div>

              </div>

            </div>
          </div>

          {/* 4. Card Action Buttons (Bottom Controls) */}
          <div className="w-full max-w-3xl mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Status updates: Mastered vs Review Later */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStatusUpdate('mastered')}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 shadow-sm ${
                  currentCard.is_mastered
                    ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{currentCard.is_mastered ? t('mastered') : t('markMastered')} (M)</span>
              </button>

              <button
                onClick={() => handleStatusUpdate('review_later')}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 shadow-sm ${
                  currentCard.needs_review
                    ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>{t('reviewLater')} (R)</span>
              </button>
            </div>

            {/* Navigation: Prev, Flip, Next */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                title={t('prevCard')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleFlip}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition flex items-center space-x-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{t('flipCard')}</span>
              </button>

              <button
                onClick={handleNext}
                title={t('nextCard')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          No flashcards found for this topic.
        </div>
      )}

    </div>
  );
};
