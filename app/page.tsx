'use client';

import React, { useState, useMemo } from 'react';

// --- Inline SVG Icons (No Lucide or external libraries required) ---
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Common stop words to ignore in keyword density calculations
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't",
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can',
  'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i',
  'if', 'in', 'into', 'is', 'it', "it's", 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
  'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [targetWords, setTargetWords] = useState<number>(500);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- Calculations ---
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const wordsArray = trimmed ? trimmed.split(/\s+/) : [];
    const wordCount = wordsArray.length;
    const charCount = text.length;
    const charNoSpacesCount = text.replace(/\s+/g, '').length;
    
    // Sentences calculation
    const sentences = trimmed ? (text.match(/[^.!?]+[.!?]+/g) || [trimmed]).length : 0;
    
    // Paragraphs calculation
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;

    // Time estimations
    const readTimeMinutes = Math.ceil(wordCount / 200); // Avg 200 wpm
    const speakTimeMinutes = Math.ceil(wordCount / 130); // Avg 130 wpm

    return {
      words: wordCount,
      characters: charCount,
      charactersNoSpaces: charNoSpacesCount,
      sentences,
      paragraphs,
      readTimeMinutes,
      speakTimeMinutes,
    };
  }, [text]);

  // --- Keyword Density Analysis ---
  const keywordDensity = useMemo(() => {
    if (!text.trim()) return [];
    
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !STOP_WORDS.has(word));

    const freqMap: Record<string, number> = {};
    words.forEach(word => {
      freqMap[word] = (freqMap[word] || 0) + 1;
    });

    const totalFiltered = words.length || 1;

    return Object.entries(freqMap)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / totalFiltered) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 keywords
  }, [text]);

  // --- Handlers ---
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpperCase = () => setText(text.toUpperCase());
  const handleLowerCase = () => setText(text.toLowerCase());
  const handleTitleCase = () => {
    setText(
      text.toLowerCase().replace(/(?:^|\s|-)\S/g, (match) => match.toUpperCase())
    );
  };
  const handleClear = () => setText('');

  const targetProgress = Math.min(100, Math.round((stats.words / (targetWords || 1)) * 100));

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Header */}
      <header className={`border-b ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/50'} backdrop-blur-md sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              WordCount
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${darkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              Free Tool by Mostafa ifleh
            </span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg border transition-colors ${
              darkMode
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Toggle Theme"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: 'Words', value: stats.words, color: 'text-blue-600' },
            { label: 'Characters', value: stats.characters, color: 'text-indigo-600' },
            { label: 'No Spaces', value: stats.charactersNoSpaces, color: 'text-purple-600' },
            { label: 'Sentences', value: stats.sentences, color: 'text-emerald-600' },
            { label: 'Paragraphs', value: stats.paragraphs, color: 'text-amber-600' },
            { label: 'Reading Time', value: `~${stats.readTimeMinutes}m`, color: 'text-rose-600' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-center transition-all ${
                darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="text-xs uppercase tracking-wider font-semibold opacity-60 mb-1">
                {item.label}
              </div>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Text Area Card */}
        <div className={`rounded-xl border shadow-sm p-4 space-y-4 ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={10}
            className={`w-full p-4 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono text-base ${
              darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
          />

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleUpperCase}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                }`}
              >
                UPPERCASE
              </button>
              <button
                onClick={handleLowerCase}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                }`}
              >
                lowercase
              </button>
              <button
                onClick={handleTitleCase}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                }`}
              >
                Title Case
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                disabled={!text}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleClear}
                disabled={!text}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md border text-rose-500 transition-colors ${
                  darkMode
                    ? 'border-slate-700 hover:bg-rose-950/30'
                    : 'border-slate-200 hover:bg-rose-50'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <TrashIcon />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Goal / Target Progress */}
          <div className={`p-5 rounded-xl border space-y-3 ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm uppercase tracking-wider opacity-70">Word Count Goal</h3>
              <div className="flex items-center space-x-2 text-sm">
                <span className="opacity-60">Target:</span>
                <input
                  type="number"
                  min="1"
                  value={targetWords}
                  onChange={(e) => setTargetWords(Number(e.target.value))}
                  className={`w-20 px-2 py-0.5 text-right rounded border focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span>{stats.words} / {targetWords} words</span>
                <span>{targetProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    targetProgress >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${targetProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Top Keyword Density */}
          <div className={`p-5 rounded-xl border space-y-3 ${darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200'}`}>
            <h3 className="font-semibold text-sm uppercase tracking-wider opacity-70">Top Keyword Density</h3>
            {keywordDensity.length === 0 ? (
              <p className="text-xs opacity-50 italic">Type some content to analyze keyword frequencies...</p>
            ) : (
              <div className="space-y-2">
                {keywordDensity.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-mono font-medium truncate max-w-[120px]">{item.word}</span>
                    <div className="flex items-center space-x-3">
                      <span className="opacity-60">{item.count}x</span>
                      <span className="font-semibold w-10 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}