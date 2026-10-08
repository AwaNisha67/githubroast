import React, { useState } from 'react';
import { LifeBuoy, Zap, Clock, TrendingUp, CheckCircle, Copy, Check, FileCode, Sparkles } from 'lucide-react';

export default function RescuePlanSection({ rescuePlan }) {
  const [activeTab, setActiveTab] = useState('fixFirst');
  const [copiedTemplate, setCopiedTemplate] = useState(null);

  if (!rescuePlan) return null;

  const { fixFirst = [], fixNext = [], niceToHave = [] } = rescuePlan;

  const handleCopyTemplate = (id, template) => {
    navigator.clipboard.writeText(template);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const tabs = [
    {
      id: 'fixFirst',
      label: 'Fix First (Highest ROI)',
      badge: `${fixFirst.length} Tasks`,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      icon: Zap,
    },
    {
      id: 'fixNext',
      label: 'Fix Next (Recruiter Polish)',
      badge: `${fixNext.length} Tasks`,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: TrendingUp,
    },
    {
      id: 'niceToHave',
      label: 'Nice to Have (Extras)',
      badge: `${niceToHave.length} Tasks`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: Sparkles,
    },
  ];

  const currentList = activeTab === 'fixFirst' ? fixFirst : activeTab === 'fixNext' ? fixNext : niceToHave;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Prioritized Rescue Plan
            </span>
            <h3 className="text-lg font-bold text-white">
              🛟 Step-by-Step Portfolio Rescue
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Potential Score Gain: +{rescuePlan.potentialGain} Points</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800/80 pb-3">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <IconComp className="w-4 h-4 text-emerald-400" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${tab.badgeColor}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {currentList.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <h4 className="text-base font-bold text-white">
                  {item.title}
                </h4>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> {item.estimatedTime}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                  +{item.potentialGain} pts
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-3 pl-6">
              {item.action}
            </p>

            {item.template && (
              <div className="ml-6 mt-2 p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono relative">
                <div className="flex items-center justify-between mb-1.5 text-slate-500 font-sans text-[11px]">
                  <span className="flex items-center gap-1">
                    <FileCode className="w-3.5 h-3.5" /> Starter Template:
                  </span>
                  <button
                    onClick={() => handleCopyTemplate(item.id, item.template)}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedTemplate === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Template</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-emerald-300/90 leading-relaxed overflow-x-auto">
                  {item.template}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
