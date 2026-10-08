import React from 'react';
import { Star, GitFork, ExternalLink, Sparkles, FolderGit2, AlertCircle } from 'lucide-react';

export default function ProjectCards({ projects }) {
  if (!projects || projects.length === 0) return null;

  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Dart: '#00B4AB',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Project Level Audit
            </span>
            <h3 className="text-lg font-bold text-white">
              ⭐ Best Projects Showcase ({projects.length})
            </h3>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Ranked by Traction & Presentation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((repo) => {
          const langColor = languageColors[repo.language] || '#8b949e';

          return (
            <div
              key={repo.id}
              className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-base text-white hover:text-orange-400 flex items-center gap-1.5 group transition-colors truncate"
                  >
                    <FolderGit2 className="w-4 h-4 text-slate-400 group-hover:text-orange-400 shrink-0" />
                    <span className="truncate">{repo.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-orange-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  {repo.fork && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                      Fork
                    </span>
                  )}
                </div>

                {/* Description */}
                {repo.description ? (
                  <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                    {repo.description}
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400/90 mb-3 bg-rose-950/30 px-2 py-1 rounded border border-rose-500/20">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>No description provided</span>
                  </div>
                )}

                {/* Topics */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {repo.topics.slice(0, 3).map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800/80 text-slate-400 border border-slate-700/60"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Project Improvement Hint */}
                <div className="mt-3 p-3 rounded-lg bg-orange-950/20 border border-orange-500/20 text-xs text-slate-300 mb-3">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Recruiter Action Hint</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {repo.improvementHint}
                  </p>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: langColor }}
                        />
                        <span>{repo.language}</span>
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>{repo.stargazers_count}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5 text-slate-400" />
                      <span>{repo.forks_count}</span>
                    </span>
                  </div>

                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    repo.hasReadme ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {repo.hasReadme ? 'README ✓' : 'NO README'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
