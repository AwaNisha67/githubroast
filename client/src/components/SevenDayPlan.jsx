import React, { useState } from 'react';
import { Calendar, CheckCircle, Circle, Clock, Target, ChevronRight } from 'lucide-react';

export default function SevenDayPlan({ plan }) {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [activeDay, setActiveDay] = useState(1);

  if (!plan || plan.length === 0) return null;

  const toggleTask = (taskKey) => {
    const next = new Set(completedTasks);
    if (next.has(taskKey)) {
      next.delete(taskKey);
    } else {
      next.add(taskKey);
    }
    setCompletedTasks(next);
  };

  const currentDayData = plan.find(d => d.day === activeDay) || plan[0];

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Structured Roadmap
            </span>
            <h3 className="text-lg font-bold text-white">
              🎯 7-Day Portfolio Turnaround Plan
            </h3>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {completedTasks.size} Tasks Checked Off
        </span>
      </div>

      {/* Day selector carousel/pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
        {plan.map((dayItem) => {
          const isActive = dayItem.day === activeDay;
          return (
            <button
              key={dayItem.day}
              onClick={() => setActiveDay(dayItem.day)}
              className={`flex flex-col items-center px-4 py-2.5 rounded-xl min-w-[80px] border transition-all ${
                isActive
                  ? 'bg-amber-500/20 border-amber-500/50 text-white shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider">Day</span>
              <span className="text-lg font-extrabold font-mono text-amber-400">{dayItem.day}</span>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">{dayItem.time}</span>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs">
              Day {currentDayData.day}
            </span>
            {currentDayData.title}
          </h4>
          <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5" /> Est: {currentDayData.time}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-5">
          <Target className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Objective: {currentDayData.objective}</span>
        </div>

        {/* Task list with interactive checkmarks */}
        <div className="space-y-3">
          {currentDayData.tasks.map((task, tIdx) => {
            const taskKey = `day-${currentDayData.day}-task-${tIdx}`;
            const isDone = completedTasks.has(taskKey);

            return (
              <div
                key={tIdx}
                onClick={() => toggleTask(taskKey)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <span className={`text-xs sm:text-sm ${isDone ? 'line-through text-slate-500' : ''}`}>
                  {task}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
