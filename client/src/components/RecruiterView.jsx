import React from 'react';
import { Eye, CheckCircle2, AlertTriangle, Briefcase, MessageSquare } from 'lucide-react';

export default function RecruiterView({ recruiterView }) {
  if (!recruiterView) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Recruiter 30-Second View
            </span>
            <h3 className="text-lg font-bold text-white">
              What Hiring Managers Notice in 30 Seconds
            </h3>
          </div>
        </div>

        {recruiterView.verdict && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            <span>Verdict: {recruiterView.verdict}</span>
          </div>
        )}
      </div>

      {/* Hiring Manager Quote Banner */}
      {recruiterView.hiring_manager_quote && (
        <div className="mb-6 p-4 rounded-xl bg-slate-900/90 border-l-4 border-l-indigo-500 border-y border-r border-slate-800 flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Internal Recruiter Slack Note
            </p>
            <p className="text-sm sm:text-base text-slate-200 font-medium italic">
              {recruiterView.hiring_manager_quote}
            </p>
          </div>
        </div>
      )}

      {/* Two columns: Strengths vs Red Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Column */}
        <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Strengths (What Gets You Screened In)</span>
          </div>
          <ul className="space-y-2.5">
            {(recruiterView.strengths || []).map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Red Flags Column */}
        <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Friction Points (What Causes Skips)</span>
          </div>
          <ul className="space-y-2.5">
            {(recruiterView.red_flags || []).map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {recruiterView.quick_take && (
        <p className="text-xs text-slate-400 mt-4 leading-relaxed font-mono">
          Recruiter Take: {recruiterView.quick_take}
        </p>
      )}
    </div>
  );
}
