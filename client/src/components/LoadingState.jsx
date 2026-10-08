import React, { useState, useEffect } from 'react';
import { Search, FileSearch, Eye, Flame, Terminal } from 'lucide-react';

export default function LoadingState({ username }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      icon: Search,
      title: '🔍 Inspecting repositories...',
      subtitle: `Scanning public repositories for @${username}...`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: FileSearch,
      title: '🧐 Checking README quality...',
      subtitle: 'Analyzing project descriptions, topics, licenses, and docs...',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: Eye,
      title: '👀 Thinking like a recruiter...',
      subtitle: 'Simulating 30-second hiring manager screening evaluation...',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      icon: Flame,
      title: '🔥 Preparing the roast...',
      subtitle: 'Synthesizing constructive humor and prioritized rescue plan...',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  const currentStep = steps[stepIndex];
  const IconComponent = currentStep.icon;

  return (
    <div className="max-w-xl mx-auto my-16 px-4">
      <div className="glass-panel rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl border border-slate-800">
        {/* Animated accent gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-orange-500 animate-pulse" />

        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-2xl ${currentStep.bgColor} ${currentStep.borderColor} border flex items-center justify-center transition-all duration-500 animate-flame`}>
            <IconComponent className={`w-10 h-10 ${currentStep.color} transition-all duration-300`} />
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 transition-all duration-300">
          {currentStep.title}
        </h3>
        <p className="text-sm text-slate-400 mb-8 font-mono">
          {currentStep.subtitle}
        </p>

        {/* Progress steps timeline */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {steps.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                  idx <= stepIndex
                    ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                    : 'bg-slate-800'
                }`}
              />
              <span className={`text-[10px] font-mono ${idx <= stepIndex ? 'text-slate-300' : 'text-slate-600'}`}>
                Phase {idx + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Mock terminal log footer */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>Auditing GitHub API telemetry...</span>
        </div>
      </div>
    </div>
  );
}
