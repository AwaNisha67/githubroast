import React, { useState } from 'react';
import { Flame, Copy, Check, Share2, Quote, Dices, ChevronRight } from 'lucide-react';

export default function RoastCard({ roast, username }) {
  const [copied, setCopied] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine primary roast and any additional curated roasts
  const allRoasts = [
    { title: roast?.title || 'The Brutally Honest Truth', text: roast?.text || '' },
    ...(roast?.additionalRoasts || []).map(r => ({
      title: r.title,
      text: r.text,
    })),
  ].filter(r => r.text && r.text.trim().length > 0);

  const activeRoast = allRoasts[currentIndex % allRoasts.length] || {
    title: roast?.title || 'The Brutally Honest Truth',
    text: roast?.text || '',
  };

  const handleNextRoast = () => {
    setCurrentIndex((prev) => (prev + 1) % allRoasts.length);
  };

  const handleCopy = () => {
    if (!activeRoast.text) return;
    const textToCopy = `🔥 GitHub Roast for @${username}:\n"${activeRoast.text}"\n\nAudited by GitHub Roast & Rescue`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`I just had my GitHub roasted by GitHub Roast & Rescue! 🔥\n\n"${activeRoast.text.slice(0, 180)}..."\n\nCheck your recruiter score:`);
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div className="relative glass-panel rounded-2xl p-6 sm:p-8 border border-orange-500/30 overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* Background flame glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/15 via-red-500/10 to-transparent blur-2xl pointer-events-none" />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  AI Portfolio Roast
                </span>
                {allRoasts.length > 1 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 font-mono border border-orange-500/30">
                    Roast {currentIndex + 1} of {allRoasts.length}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-extrabold text-white">
                {activeRoast.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allRoasts.length > 1 && (
              <button
                onClick={handleNextRoast}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-500/50 transition-all shadow-sm active:scale-95"
                title="Shuffle to another savage roast"
              >
                <Dices className="w-3.5 h-3.5 text-orange-400 animate-spin-slow" />
                <span>Reroll Roast</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
              title="Copy roast"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareTwitter}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
              title="Share on X"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Roast Paragraph */}
        <div className="relative my-4 p-5 rounded-xl bg-orange-950/20 border border-orange-500/20 transition-all duration-300">
          <Quote className="absolute -top-3 -left-2 w-8 h-8 text-orange-500/20" />
          <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed italic">
            "{activeRoast.text}"
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 mt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          Roasting the profile, not the person
        </span>
        <span className="font-mono text-slate-500">
          {allRoasts.length > 1 ? `Click Reroll for more` : `AI PromptWars MVP`}
        </span>
      </div>
    </div>
  );
}
