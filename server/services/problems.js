/**
 * Problem Detection Engine (Section 7 F7 of PRD)
 * Identifies concrete weaknesses with severity, affected repos, and actionable impact.
 */

export function detectPortfolioProblems(userData, scoreData) {
  const { profile, stats, top_projects, all_repos_sample } = userData;
  const repos = all_repos_sample || [];
  const problems = [];

  // 1. Missing Profile README
  if (!profile.hasProfileReadme) {
    problems.push({
      id: 'missing-profile-readme',
      severity: 'critical',
      title: 'Missing Profile README',
      summary: `Your profile is missing a personalized ${profile.username}/${profile.username} README banner.`,
      recruiterImpact: 'Recruiters see an empty greeting. A profile README is your digital resume header with your bio, tech stack, and proudest achievements.',
      affectedCount: 1,
      fixEffort: '15 mins',
      scoreGain: 4,
    });
  }

  // 2. Repositories without descriptions
  const noDescRepos = repos.filter(r => !r.description || r.description.trim().length === 0);
  if (noDescRepos.length > 0) {
    const isCritical = noDescRepos.length > 5 || noDescRepos.length >= (repos.length * 0.5);
    problems.push({
      id: 'missing-descriptions',
      severity: isCritical ? 'critical' : 'high',
      title: `${noDescRepos.length} Repositories Lack Descriptions`,
      summary: `${noDescRepos.length} of your repositories have no description or summary.`,
      recruiterImpact: 'Recruiters spend 30 seconds skimming. If a repository has no one-sentence summary, they skip past it without clicking.',
      affectedCount: noDescRepos.length,
      sampleItems: noDescRepos.slice(0, 4).map(r => r.name),
      fixEffort: '10 mins',
      scoreGain: 6,
    });
  }

  // 3. Repositories without README
  const noReadmeRepos = repos.filter(r => !r.hasReadme);
  if (noReadmeRepos.length > 0) {
    const isCritical = noReadmeRepos.length >= 3;
    problems.push({
      id: 'missing-readmes',
      severity: isCritical ? 'critical' : 'high',
      title: `${noReadmeRepos.length} Projects Missing README Documentation`,
      summary: `${noReadmeRepos.length} repositories do not have a README or have virtually empty files.`,
      recruiterImpact: 'A repo without a README looks like abandoned scrap code. Recruiters won\'t inspect code files without understanding what the software does.',
      affectedCount: noReadmeRepos.length,
      sampleItems: noReadmeRepos.slice(0, 4).map(r => r.name),
      fixEffort: '30 mins',
      scoreGain: 7,
    });
  }

  // 4. Missing Live Demos
  const liveDemoRepos = repos.filter(r => r.homepage && r.homepage.trim().length > 0);
  if (liveDemoRepos.length === 0 && repos.length > 0) {
    problems.push({
      id: 'missing-live-demos',
      severity: 'medium',
      title: 'Zero Live Demo or Deployment Links',
      summary: 'None of your top repositories have a live demo or deployed URL listed.',
      recruiterImpact: 'Recruiters and hiring managers rarely clone repos to run `npm install`. Live demo links (Vercel, Netlify, Render) generate 4x more interview interest.',
      affectedCount: repos.length,
      fixEffort: '20 mins',
      scoreGain: 3,
    });
  }

  // 5. Bio and Contact Avenues
  if (!profile.bio || profile.bio.trim().length < 10) {
    problems.push({
      id: 'weak-bio',
      severity: 'high',
      title: 'Blank or Minimalist Profile Bio',
      summary: profile.bio ? 'Your bio is very brief and does not state your core focus or stack.' : 'Your profile bio is completely blank.',
      recruiterImpact: 'Recruiters need to know your title (e.g., "Full-Stack Developer | Next.js & Python") within 3 seconds of loading your page.',
      affectedCount: 1,
      fixEffort: '5 mins',
      scoreGain: 3,
    });
  }

  // 6. Dormant Activity
  if (stats.days_since_last_push > 60) {
    problems.push({
      id: 'dormant-activity',
      severity: stats.days_since_last_push > 120 ? 'critical' : 'medium',
      title: `Inactive GitHub Cadence (Last pushed ${stats.days_since_last_push} days ago)`,
      summary: `Your most recent public code contribution was ${stats.days_since_last_push} days ago.`,
      recruiterImpact: 'Stale activity signals that you might not be actively coding or pushing projects, leaving recruiters uncertain about your current technical momentum.',
      affectedCount: 1,
      fixEffort: 'Ongoing',
      scoreGain: 4,
    });
  }

  // 7. Excessive Forks vs Original Work
  if (stats.forked_repos_count > stats.original_repos_count && stats.forked_repos_count > 3) {
    problems.push({
      id: 'fork-heavy',
      severity: 'medium',
      title: `High Fork Ratio (${stats.forked_repos_count} forks vs ${stats.original_repos_count} original repos)`,
      summary: 'More than half of your repositories are forks of other people\'s projects.',
      recruiterImpact: 'Uncustomized forks make recruiters wonder how much code you actually wrote yourself vs bookmarked.',
      affectedCount: stats.forked_repos_count,
      fixEffort: '15 mins',
      scoreGain: 3,
    });
  }

  // 8. Missing Topics / Tags
  if ((stats.repos_with_topics || 0) < Math.min(3, repos.length)) {
    problems.push({
      id: 'missing-topics',
      severity: 'low',
      title: 'Missing GitHub Topic Tags',
      summary: 'Most of your repositories do not have topic tags (e.g., `react`, `typescript`, `fastapi`).',
      recruiterImpact: 'Topics help GitHub SEO and quickly give technical screeners visual tags of your engineering competencies.',
      affectedCount: repos.length - (stats.repos_with_topics || 0),
      fixEffort: '10 mins',
      scoreGain: 2,
    });
  }

  // Sort by severity (critical -> high -> medium -> low)
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return problems.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
