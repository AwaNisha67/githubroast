import React, { useState } from 'react';
import { 
  MapPin, Building, Globe, Mail, 
  Calendar, Clock, Star, GitFork, Printer, Share2, Copy, Check 
} from 'lucide-react';
import { GithubIcon, TwitterIcon } from './Icons';

export default function ProfileHeader({ profile, stats, score, onShare }) {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `📊 GitHub Roast & Rescue Audit for @${profile.username}
Score: ${score.overall}/100 (Grade ${score.grade} - ${score.verdict})
Repositories: ${stats.total_repos} (${stats.original_repos_count} original, ${stats.forked_repos_count} forks)
Stars: ${stats.total_stars} | Forks: ${stats.total_forks}
Last Push: ${stats.days_since_last_push} days ago
Audited with GitHub Roast & Rescue`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        {/* User Identity info */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-slate-700 shadow-xl object-cover bg-slate-900"
            />
            {profile.hasProfileReadme && (
              <span 
                className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-md"
                title="Profile README detected"
              >
                README ✓
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {profile.name}
              </h2>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-mono text-slate-400 hover:text-orange-400 flex items-center gap-1 transition-colors"
              >
                @{profile.username}
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {profile.bio ? (
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mb-3">
                {profile.bio}
              </p>
            ) : (
              <p className="text-xs text-rose-400 italic mb-3">
                No profile bio provided
              </p>
            )}

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {profile.location}
                </span>
              )}

              {profile.company && (
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  {profile.company}
                </span>
              )}

              {profile.blog && (
                <a
                  href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-300 hover:text-orange-400 transition-colors underline truncate max-w-[200px]"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  {profile.blog.replace(/^https?:\/\//, '')}
                </a>
              )}

              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {profile.account_age_years} yrs tenure
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center no-print">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Export / Print PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-6">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Repositories
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-white">{stats.total_repos}</span>
            <span className="text-[11px] text-slate-500 font-mono">({stats.original_repos_count} orig)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Total Traction
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm font-mono text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5" /> {stats.total_stars}
            </span>
            <span className="flex items-center gap-1 text-sm font-mono text-slate-300 font-bold">
              <GitFork className="w-3.5 h-3.5" /> {stats.total_forks}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Documentation Rate
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-white">
              {stats.total_repos > 0 ? Math.round(((stats.total_repos - stats.repos_without_readme) / stats.total_repos) * 100) : 0}%
            </span>
            <span className="text-[11px] text-slate-500">READMEs</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Last Active
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-white">{stats.days_since_last_push}</span>
            <span className="text-[11px] text-slate-500">days ago</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-4 lg:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Top Stacks
          </span>
          <div className="flex flex-wrap gap-1">
            {(stats.languages || []).slice(0, 3).map((l, idx) => (
              <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                {l.language}
              </span>
            ))}
            {(!stats.languages || stats.languages.length === 0) && (
              <span className="text-xs text-slate-500">None detected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
