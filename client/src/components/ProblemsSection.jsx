import React from 'react';
import { AlertOctagon, AlertTriangle, Info, Clock, PlusCircle } from 'lucide-react';

export default function ProblemsSection({ problems }) {
  if (!problems || problems.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 text-center">
        <p className="text-emerald-400 font-semibold">
          🎉 No major portfolio red flags detected! Your repository presentation is in top shape.
        </p>
      </div>
    );
  }

  const severityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
            <AlertOctagon className="w-3 h-3 text-rose-400" /> Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40 uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3 text-orange-400" /> High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
            <Info className="w-3 h-3 text-amber-400" /> Moderate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-wider">
            <Info className="w-3 h-3 text-blue-400" /> Minor
          </span>
        );
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Portfolio Red Flags
            </span>
            <h3 className="text-lg font-bold text-white">
              🚨 Biggest Problems Detected ({problems.length})
            </h3>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Ranked by Recruiter Friction
        </span>
      </div>

      <div className="space-y-4">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                {severityBadge(problem.severity)}
                <h4 className="text-base font-bold text-white">
                  {problem.title}
                </h4>
              </div>

              <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                {problem.summary}
              </p>

              {problem.recruiterImpact && (
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Recruiter Friction: </span>
                  {problem.recruiterImpact}
                </div>
              )}

              {problem.sampleItems && problem.sampleItems.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[11px] text-slate-500">Affected Repos:</span>
                  {problem.sampleItems.map((repo, rIdx) => (
                    <span
                      key={rIdx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700/60"
                    >
                      {repo}
                    </span>
                  ))}
                  {problem.affectedCount > problem.sampleItems.length && (
                    <span className="text-[11px] text-slate-500">
                      +{problem.affectedCount - problem.sampleItems.length} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Fix: {problem.fixEffort}</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+{problem.scoreGain} pts potential</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
