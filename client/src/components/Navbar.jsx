import React from 'react';
import { Flame, ShieldAlert, Settings, RefreshCw } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function Navbar({ onOpenSettings, onReset, hasReport }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group transition-all"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white font-bold ring-2 ring-slate-950">
              🛟
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-orange-400 transition-colors">
                GitHub Roast <span className="text-orange-500">&</span> Rescue
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 uppercase tracking-wider">
                Recruiter Auditor
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI-Powered Portfolio Auditor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasReport && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Audit</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="API Keys & Token Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
