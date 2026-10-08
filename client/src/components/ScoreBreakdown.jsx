import React, { useState } from 'react';
import { BarChart3, ChevronDown, ChevronUp, User, FolderGit2, FileText, Activity, Cpu, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ScoreBreakdown({ categories, overallScore }) {
  const [expandedCat, setExpandedCat] = useState(null);

  if (!categories) return null;

  const iconMap = {
    user: User,
    'folder-git': FolderGit2,
    'file-text': FileText,
    activity: Activity,
    cpu: Cpu,
    briefcase: Briefcase,
  };

  const categoryEntries = Object.entries(categories);

  const toggleExpand = (key) => {
    setExpandedCat(prev => prev === key ? null : key);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Deterministic Scoring Model
            </span>
            <h3 className="text-lg font-bold text-white">
              Score Breakdown (100 Pts Total)
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black font-mono text-white">{overallScore}</span>
          <span className="text-xs text-slate-400 font-mono"> / 100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryEntries.map(([key, cat]) => {
          const IconComponent = iconMap[cat.icon] || BarChart3;
          const isExpanded = expandedCat === key;
          const pct = cat.percentage;

          let colorClass = 'bg-blue-500';
          let textColor = 'text-blue-400';
          if (pct >= 80) {
            colorClass = 'bg-emerald-500';
            textColor = 'text-emerald-400';
          } else if (pct < 50) {
            colorClass = 'bg-rose-500';
            textColor = 'text-rose-400';
          } else {
            colorClass = 'bg-amber-500';
            textColor = 'text-amber-400';
          }

          return (
            <div
              key={key}
              className={`p-4 rounded-xl border transition-all ${
                isExpanded ? 'bg-slate-900/90 border-slate-700 shadow-md' : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div 
                className="cursor-pointer"
                onClick={() => toggleExpand(key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${textColor}`} />
                    <span className="text-sm font-semibold text-white">
                      {cat.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {cat.score}/{cat.max}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
                    style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Weight: {cat.max} pts</span>
                  <span className={`font-semibold ${textColor}`}>{pct}% achieved</span>
                </div>
              </div>

              {/* Collapsible rule details */}
              {isExpanded && cat.details && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 animate-fadeIn text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Sub-Criteria Evaluated:
                  </span>
                  {cat.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start justify-between gap-2 text-slate-300">
                      <div className="flex items-start gap-1.5">
                        {detail.status === 'pass' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-tight">{detail.label}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 shrink-0">
                        +{detail.pts}/{detail.max}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
