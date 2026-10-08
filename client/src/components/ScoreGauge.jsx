import React from 'react';
import { Award, Zap, HelpCircle } from 'lucide-react';

export default function ScoreGauge({ score, grade, verdict, verdictColor }) {
  // SVG circular gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap = {
    emerald: {
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      stroke: '#10b981',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    blue: {
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
      stroke: '#3b82f6',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    amber: {
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      stroke: '#f59e0b',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    rose: {
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
      stroke: '#f43f5e',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
  };

  const currentTheme = colorMap[verdictColor] || colorMap.amber;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border border-slate-800">
      {/* Background soft glow */}
      <div 
        className="absolute w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: currentTheme.stroke }}
      />

      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Portfolio Quality Score
        </span>
      </div>

      {/* Circular Gauge */}
      <div className="relative w-44 h-44 flex items-center justify-center mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-800/80"
          />
          {/* Progress fill */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={currentTheme.stroke}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <span className="text-5xl font-black tracking-tight text-white font-mono">
              {score}
            </span>
            <span className="text-base font-semibold text-slate-500 font-mono ml-0.5">
              /100
            </span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 border ${currentTheme.badge}`}>
            Grade {grade}
          </span>
        </div>
      </div>

      {/* Recruiter Verdict Badge */}
      <div className="flex flex-col items-center gap-1.5 mt-1">
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${currentTheme.text}`} />
          <h4 className="text-base sm:text-lg font-bold text-white">
            {verdict}
          </h4>
        </div>
        <p className="text-xs text-slate-400 max-w-xs">
          Deterministic evaluation based on 6 core hiring signals and code presentation.
        </p>
      </div>
    </div>
  );
}
