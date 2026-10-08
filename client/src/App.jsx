import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LoadingState from './components/LoadingState';
import ProfileHeader from './components/ProfileHeader';
import ScoreGauge from './components/ScoreGauge';
import RoastCard from './components/RoastCard';
import RecruiterView from './components/RecruiterView';
import ScoreBreakdown from './components/ScoreBreakdown';
import ProblemsSection from './components/ProblemsSection';
import RescuePlanSection from './components/RescuePlanSection';
import ScoreSimulator from './components/ScoreSimulator';
import SevenDayPlan from './components/SevenDayPlan';
import ProjectCards from './components/ProjectCards';
import SettingsModal from './components/SettingsModal';

function NetworkBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    let frame;
    let width = 0;
    let height = 0;
    let points = [];
    let targetX = 0;
    let targetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(190, Math.max(90, Math.round((width * height) / 9000)));
      points = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.00042 + 0.00034,
        sway: Math.random() * Math.PI * 2,
        bright: index % 11 === 0,
      }));
    };

    const movePointer = (event) => {
      targetX = (event.clientX / width - 0.5) * 18;
      targetY = (event.clientY / height - 0.5) * 18;
    };

    const draw = (now) => {
      pointerX += (targetX - pointerX) * 0.025;
      pointerY += (targetY - pointerY) * 0.025;
      context.clearRect(0, 0, width, height);
      const projected = points.map((point) => {
        const driftX = Math.sin(now * point.speed + point.phase) * 42
          + Math.sin(now * point.speed * 0.47 + point.sway) * 18;
        const driftY = Math.cos(now * point.speed * 0.82 + point.phase) * 36
          + Math.cos(now * point.speed * 0.56 + point.sway) * 15;
        const depth = Math.max(0, Math.min(1, point.z + Math.sin(now * point.speed * 0.34 + point.sway) * 0.09));
        const perspective = 0.45 + depth * 0.85;
        return {
          x: width / 2 + (point.x - width / 2 + driftX + pointerX * depth) * perspective,
          y: height / 2 + (point.y - height / 2 + driftY + pointerY * depth) * perspective,
          z: depth,
          bright: point.bright || Math.sin(now * point.speed * 1.7 + point.phase) > 0.96,
        };
      });

      projected.forEach((point, index) => {
        projected.slice(index + 1).forEach((other) => {
          const dx = point.x - other.x;
          const dy = point.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 235) return;
          const depth = (point.z + other.z) / 2;
          context.strokeStyle = `rgba(${depth > 0.62 ? '184,92,255' : '255,79,163'}, ${(1 - distance / 235) * 0.58 * (0.55 + depth * 0.45)})`;
          context.lineWidth = 1.05 + depth * 0.9;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        });
        context.fillStyle = point.bright ? 'rgba(255,183,220,1)' : `rgba(215,123,255,${0.52 + point.z * 0.42})`;
        context.beginPath();
        context.arc(point.x, point.y, point.bright ? 2.8 : 1.15 + point.z * 1.2, 0, Math.PI * 2);
        context.fill();
      });
      if (!reduceMotion) frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', movePointer, { passive: true });
    frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', movePointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="network-backdrop" aria-hidden="true" />;
}

export default function App() {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load saved API tokens from localStorage
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('gh_roast_settings');
      return saved ? JSON.parse(saved) : { githubToken: '', aiApiKey: '' };
    } catch {
      return { githubToken: '', aiApiKey: '' };
    }
  });

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gh_roast_settings', JSON.stringify(newSettings));
  };

  const handleAnalyze = async (username) => {
    if (!username.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentUsername(username.trim());

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          githubToken: settings.githubToken,
          aiApiKey: settings.aiApiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to inspect GitHub profile.');
      }

      if (data.isEmptyProfile) {
        throw new Error(data.message || "We found the profile. Unfortunately, there isn't much to roast yet (0 public repos).");
      }

      setReport(data);

      // Trigger celebration confetti if score >= 80
      if (data.score?.overall >= 80) {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Audit failed:', err);
      setError(err.message || 'Something went wrong while fetching GitHub data. Retry analysis.');
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
    setCurrentUsername('');
  };

  return (
    <div className="app-shell min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500/30 selection:text-orange-200">
      <NetworkBackdrop />
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReset={handleReset}
        hasReport={Boolean(report)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-black/34">
        {isLoading ? (
          <LoadingState username={currentUsername} />
        ) : report ? (
          <div className="space-y-8 animate-fadeIn">
            {/* User Profile Header with Meta stats & Export */}
            <ProfileHeader
              profile={report.profile}
              stats={report.stats}
              score={report.score}
            />

            {/* Top Grid: Score Gauge + Roast Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 flex flex-col">
                <ScoreGauge
                  score={report.score.overall}
                  grade={report.score.grade}
                  verdict={report.score.verdict}
                  verdictColor={report.score.verdictColor}
                />
              </div>

              <div className="lg:col-span-8 flex flex-col">
                <RoastCard
                  roast={report.roast}
                  username={report.profile.username}
                />
              </div>
            </div>

            {/* Recruiter 30-Second View */}
            <RecruiterView recruiterView={report.recruiterView} />

            {/* Score Breakdown (Deterministic 100 pts) */}
            <ScoreBreakdown
              categories={report.score.categories}
              overallScore={report.score.overall}
            />

            {/* Detected Red Flags & Problems */}
            <ProblemsSection problems={report.problems} />

            {/* Prioritized Rescue Plan (Fix First, Fix Next, Nice to Have) */}
            <RescuePlanSection rescuePlan={report.rescuePlan} />

            {/* Interactive Before & After Score Simulator */}
            <ScoreSimulator
              currentScore={report.score.overall}
              rescuePlan={report.rescuePlan}
            />

            {/* 7-Day Improvement Plan */}
            <SevenDayPlan plan={report.rescuePlan?.sevenDayPlan} />

            {/* Best Projects Showcase */}
            <ProjectCards projects={report.topProjects} />

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8 border-t border-slate-900 no-print">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 shadow-xl shadow-orange-500/25 transition-all text-center"
              >
                Audit Another GitHub Profile 🔥
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        ) : (
          <HeroSection
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            error={error}
          />
        )}
      </main>

      {/* Footer */}
     <footer className="no-print border-t border-white/10 bg-black/30 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20 py-8 text-center text-xs text-slate-400">
  <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
    <p className="font-mono text-slate-400">
      GitHub Roast & Rescue •{" "}
      <span className="text-orange-400">By AwaNisha67</span>
    </p>

    <p className="text-slate-400 italic">
      "Don't just tell developers that their GitHub needs work. Tell them why—and exactly how to fix it."
    </p>

    <p className="text-slate-400 font-mono">
      Deterministic Engine + AI Synthesis
    </p>
  </div>
</footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={settings}
      />
    </div>
  );
}
