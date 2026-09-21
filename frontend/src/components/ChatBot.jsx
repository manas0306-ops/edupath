import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Bot, Send, Mic, MicOff, Copy, Check, Sparkles, RefreshCw, Trash2, User,
  MessageSquare, ChevronDown, ChevronUp, Code2, Volume2
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "What should I learn today?",
  "Why am I weak in SQL Joins?",
  "Explain recursion like I'm a beginner.",
  "Give me 3 diagnostic PyTorch questions.",
  "Generate a project based on my current skills."
];

export const ChatBot = ({ isFloating = false }) => {
  const { language, t, toggleSpeak } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### 🌟 Welcome to your AI Learning Mentor!

Hello **${user?.name || 'Learner'}**! I am your personalized career advisor. I continuously analyze your target role (**${user?.profile?.target_role || 'AI/ML Engineer'}**), skill gaps, and recent quiz attempts.

How can I help accelerate your learning journey today? Click a starter prompt below or tap the microphone to speak!`,
      language: language
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isOpen, setIsOpen] = useState(!isFloating);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initialize Speech-to-Text via Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'ja' ? 'ja-JP' : 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(t('speechNotSupported'));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      language: language
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('edupath_token');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: query,
          language: language
        })
      });

      if (res.ok) {
        const assistantMsg = await res.json();
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: "I ran into a temporary hiccup processing your request. Please try again.",
            language: language
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-fresh',
        role: 'assistant',
        content: `Conversation restarted. What topic or concept would you like to explore?`,
        language: language
      }
    ]);
  };

  // Helper to format basic markdown (bold, code blocks, bullet points)
  const renderFormattedContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeLines = part.slice(3, -3).trim().split('\n');
        const lang = codeLines[0].match(/^[a-zA-Z0-9_-]+$/) ? codeLines.shift() : '';
        const codeText = codeLines.join('\n');
        return (
          <div key={index} className="my-2 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400">
              <span className="flex items-center space-x-1">
                <Code2 className="w-3.5 h-3.5" />
                <span>{lang || 'code'}</span>
              </span>
              <button
                onClick={() => copyToClipboard(codeText, `code-${index}`)}
                className="hover:text-white transition flex items-center space-x-1"
              >
                {copiedId === `code-${index}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === `code-${index}` ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 overflow-x-auto"><code>{codeText}</code></pre>
          </div>
        );
      } else {
        // Line-by-line formatting
        return (
          <div key={index} className="space-y-1">
            {part.split('\n').map((line, lIdx) => {
              if (line.startsWith('### ')) {
                return <h4 key={lIdx} className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2 mb-1">{line.slice(4)}</h4>;
              } else if (line.startsWith('> ')) {
                return <blockquote key={lIdx} className="border-l-2 border-brand-500 pl-2 italic text-xs text-slate-600 dark:text-slate-400 my-1">{line.slice(2)}</blockquote>;
              } else if (line.startsWith('- ') || line.startsWith('* ')) {
                return <li key={lIdx} className="ml-4 text-xs list-disc leading-relaxed">{line.slice(2)}</li>;
              } else if (line.trim() === '') {
                return <div key={lIdx} className="h-1"></div>;
              } else {
                return <p key={lIdx} className="text-xs leading-relaxed">{line}</p>;
              }
            })}
          </div>
        );
      }
    });
  };

  if (isFloating && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-500 text-white shadow-xl shadow-brand-500/30 hover:scale-105 transition-all flex items-center space-x-2 font-bold text-xs"
      >
        <Sparkles className="w-5 h-5" />
        <span>{t('askAiMentorBtn')}</span>
      </button>
    );
  }

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden ${
      isFloating ? 'fixed bottom-6 right-6 z-50 w-96 sm:w-[420px] h-[580px]' : 'w-full h-[640px]'
    }`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
              <span>EduPath AI Mentor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('Contextual Learning Assistant')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={clearChat}
            title="Reset Chat"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {isFloating && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                isUser ? 'bg-brand-600 text-white' : 'bg-sky-500/20 text-sky-500 dark:text-sky-300'
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-3.5 ${
                isUser
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/50'
              }`}>
                {renderFormattedContent(m.content)}
                {!isUser && (
                  <div className="mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => toggleSpeak(m.content)}
                      title={t('readAloud')}
                      className="p-1 rounded text-slate-400 hover:text-brand-500 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => copyMessage(m.content, m.id)}
                      title={t('copy')}
                      className="p-1 rounded text-slate-400 hover:text-brand-500 transition"
                    >
                      {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
            <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span className="italic animate-pulse">{t('Formulating personalized guidance...')}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-1.5 flex items-center space-x-1.5 overflow-x-auto border-t border-slate-100 dark:border-slate-800/60 no-scrollbar">
        {SUGGESTED_PROMPTS.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition"
          >
            {t(prompt)}
          </button>
        ))}
      </div>

      {/* Input Form & STT */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center space-x-2">
          {/* Speech-to-Text Button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Stop listening" : t('voiceInput')}
            className={`p-2 rounded-xl border transition ${
              isListening
                ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isListening ? t('listening') : t('askMentorPlaceholder')}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />

          {/* Send Button */}
          <button
            type="button"
            disabled={!input.trim() || loading}
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
