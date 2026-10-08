import React, { useState } from 'react';
import { Sliders, CheckSquare, Square, ArrowUpRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScoreSimulator({ currentScore, rescuePlan }) {
  if (!rescuePlan) return null;

  const defaultTasks = [
    { id: 'sim-readme', label: 'Create professional Profile README (username/username)', pts: 4 },
    { id: 'sim-desc', label: 'Add 1-sentence descriptions & tech stacks to top repos', pts: 6 },
    { id: 'sim-docs', label: 'Write structured READMEs with setup instructions for top 3 projects', pts: 7 },
    { id: 'sim-demo', label: 'Deploy live demos on Vercel/Netlify & link in repo About section', pts: 4 },
    { id: 'sim-pin', label: 'Pin your 4 best original showcase repositories', pts: 3 },
    { id: 'sim-license', label: 'Add open source MIT licenses to core repositories', pts: 2 },
  ];

  const [checkedTasks, setCheckedTasks] = useState(
    new Set(['sim-readme', 'sim-desc']) // pre-check some for immediate dynamic illustration
  );

  const toggleTask = (taskId) => {
    const next = new Set(checkedTasks);
    if (next.has(taskId)) {
      next.delete(taskId);
    } else {
      next.add(taskId);
      // Trigger subtle celebratory confetti if hitting >= 85
      const potentialNewScore = Math.min(
        100,
        currentScore + [...next].reduce((sum, id) => {
          const t = defaultTasks.find(item => item.id === id);
          return sum + (t ? t.pts : 0);
        }, 0)
      );
      if (potentialNewScore >= 85) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    }
    setCheckedTasks(next);
  };

  const simulatedGain = [...checkedTasks].reduce((sum, id) => {
    const t = defaultTasks.find(item => item.id === id);
    return sum + (t ? t.pts : 0);
  }, 0);

  const simulatedScore = Math.min(100, currentScore + simulatedGain);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Interactive ROI Simulator
            </span>
            <h3 className="text-lg font-bold text-white">
              📈 Score Improvement Potential
            </h3>
          </div>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Current</span>
            <span className="text-base font-bold font-mono text-slate-300">{currentScore}</span>
          </div>
          <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          <div className="text-center">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Simulated</span>
            <span className="text-xl font-extrabold font-mono text-emerald-400">
              {simulatedScore}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            +{simulatedGain} pts
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 mb-6">
        Select the fixes you plan to tackle to see transparent estimated score gains based on our deterministic recruiter evaluation rules:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {defaultTasks.map((task) => {
          const isChecked = checkedTasks.has(task.id);
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                isChecked
                  ? 'bg-purple-950/30 border-purple-500/40 text-white shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-purple-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="flex-1 text-xs sm:text-sm font-medium">
                {task.label}
              </div>
              <span className={`font-mono text-xs font-bold shrink-0 px-2 py-0.5 rounded ${
                isChecked ? 'bg-purple-500/20 text-purple-300' : 'text-slate-500'
              }`}>
                +{task.pts} pts
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
        <span>Transparent estimated point gains (not guaranteed by AI)</span>
        <span className="text-purple-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Target: 85+ for "Recruiter Ready"
        </span>
      </div>
    </div>
  );
}
