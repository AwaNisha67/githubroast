import React, { useState } from 'react';
import { Flame, Copy, Check, Share2, Quote } from 'lucide-react';

export default function RoastCard({ roast, username }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!roast?.text) return;
    const textToCopy = `🔥 GitHub Roast for @${username}:\n"${roast.text}"\n\nAudited by GitHub Roast & Rescue`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`I just had my GitHub roasted by GitHub Roast & Rescue! 🔥\n\n"${roast.text.slice(0, 180)}..."\n\nCheck your recruiter score:`);
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div className="relative glass-panel rounded-2xl p-6 sm:p-8 border border-orange-500/30 overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* Background flame glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/15 via-red-500/10 to-transparent blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                AI Portfolio Roast
              </span>
              <h3 className="text-lg font-extrabold text-white">
                {roast?.title || 'The Brutally Honest Truth'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
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
        <div className="relative my-4 p-5 rounded-xl bg-orange-950/20 border border-orange-500/20">
          <Quote className="absolute -top-3 -left-2 w-8 h-8 text-orange-500/20" />
          <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed italic">
            "{roast?.text}"
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 mt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          Roasting the profile, not the person
        </span>
        <span className="font-mono text-slate-500">AI PromptWars MVP</span>
      </div>
    </div>
  );
}
