import React, { useState } from 'react';
import { Search, Flame, Sparkles, Shield, ArrowRight, AlertCircle, Award, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ onAnalyze, isLoading, error }) {
  const [username, setUsername] = useState('');

  const sampleUsers = [
    { label: 'octocat', desc: 'GitHub Mascot', tag: 'Classic' },
    { label: 'torvalds', desc: 'Linux & Git Creator', tag: 'Legend' },
    { label: 'shadcn', desc: 'UI Architect', tag: 'Modern' },
    { label: 'gaearon', desc: 'React Core', tag: 'Architect' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || isLoading) return;
    onAnalyze(username.trim());
  };

  const handleSelectSample = (sampleName) => {
    setUsername(sampleName);
    onAnalyze(sampleName);
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-600/15 via-red-600/10 to-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-400 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>PromptWars Hackathon • 8-Hour MVP Edition</span>
        </div>

        {/* PRD Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 leading-tight">
          Your GitHub deserves <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
            the truth.
          </span>
        </h1>

        {/* PRD Subheading */}
        <p className="text-lg sm:text-2xl text-slate-300 font-medium max-w-2xl mx-auto mb-8 sm:mb-10">
          Get roasted. Get rescued. <span className="text-emerald-400 font-semibold">Get recruiter-ready.</span>
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-6">
          <div className="relative flex items-center p-1.5 rounded-2xl bg-slate-900/90 border-2 border-slate-700/80 hover:border-orange-500/50 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/20 shadow-2xl transition-all">
            <div className="pl-3.5 text-slate-500 flex items-center gap-1 font-mono text-sm select-none">
              <span>github.com/</span>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              disabled={isLoading}
              className="w-full bg-transparent px-2 py-3 text-base sm:text-lg text-white placeholder-slate-500 font-medium focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Alert Display */}
        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-left flex items-start gap-3 text-rose-200 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-rose-300">Analysis Halted</p>
              <p className="text-rose-200/90 mt-0.5">{error}</p>
            </div>
          </div>  
        )}

        {/* Quick Demo Preset Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            Try a demo:
          </span>
          {sampleUsers.map((u) => (
            <button
              key={u.label}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectSample(u.label)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 transition-colors"
            >
              <span className="text-orange-400">@</span>
              <span>{u.label}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-sans">
                {u.tag}
              </span>
            </button>
          ))}
        </div>

        {/* 3 Pillars Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-xl glass-panel">
            <div className="flex items-center gap-2.5 text-orange-400 font-semibold text-sm mb-1.5">
              <Flame className="w-4 h-4 shrink-0" />
              <span>Tasteful AI Roast</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Brutally honest feedback targeting your code presentation, empty READMEs, and missing descriptions without personal attacks.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel">
            <div className="flex items-center gap-2.5 text-indigo-400 font-semibold text-sm mb-1.5">
              <Award className="w-4 h-4 shrink-0" />
              <span>Recruiter 30-Sec View</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find out what hiring managers and technical recruiters skim in their first 30 seconds before deciding to interview or skip.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel">
            <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm mb-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Prioritized Rescue</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Concrete Fix First, Fix Next actions with simulated score potential (+20 points) and an actionable 7-day checklist.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
