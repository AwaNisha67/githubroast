/**
 * Deterministic Portfolio Quality Scoring Engine (Section 8 of PRD)
 * Strict 100-point model:
 * - Profile Quality: 15
 * - Repository Quality: 25
 * - Documentation: 20
 * - Activity: 15
 * - Project Diversity: 10
 * - Recruiter Readiness: 15
 */

export function calculatePortfolioScore(userData) {
  const { profile, stats, top_projects, all_repos_sample } = userData;
  const repos = all_repos_sample || [];
  const totalRepos = Math.max(1, stats.total_repos || repos.length);

  // 1. Profile Quality (Max 15)
  let profileScore = 0;
  const profileDetails = [];

  // Bio (4 pts)
  if (profile.bio && profile.bio.trim().length >= 15) {
    profileScore += 4;
    profileDetails.push({ label: 'Descriptive bio provided', pts: 4, max: 4, status: 'pass' });
  } else if (profile.bio && profile.bio.trim().length > 0) {
    profileScore += 2;
    profileDetails.push({ label: 'Brief bio provided (could be more informative)', pts: 2, max: 4, status: 'warning' });
  } else {
    profileDetails.push({ label: 'Missing bio', pts: 0, max: 4, status: 'fail' });
  }

  // Profile README (4 pts)
  if (profile.hasProfileReadme) {
    profileScore += 4;
    profileDetails.push({ label: 'Custom profile README created', pts: 4, max: 4, status: 'pass' });
  } else {
    profileDetails.push({ label: 'Missing profile README (username/username)', pts: 0, max: 4, status: 'fail' });
  }

  // Name (2 pts)
  if (profile.name && profile.name.trim() !== profile.username) {
    profileScore += 2;
    profileDetails.push({ label: 'Full human name displayed', pts: 2, max: 2, status: 'pass' });
  } else {
    profileScore += 1;
    profileDetails.push({ label: 'Only username displayed as name', pts: 1, max: 2, status: 'warning' });
  }

  // External Links (Portfolio / Blog / Company / Social) (3 pts)
  if (profile.blog || profile.company || profile.twitter_username) {
    profileScore += 3;
    profileDetails.push({ label: 'Portfolio link or organization listed', pts: 3, max: 3, status: 'pass' });
  } else {
    profileDetails.push({ label: 'No portfolio website or contact handle', pts: 0, max: 3, status: 'fail' });
  }

  // Location / Contactability (2 pts)
  if (profile.location || profile.email) {
    profileScore += 2;
    profileDetails.push({ label: 'Geographic location or contact info set', pts: 2, max: 2, status: 'pass' });
  } else {
    profileScore += 1;
    profileDetails.push({ label: 'Missing location details', pts: 1, max: 2, status: 'warning' });
  }
  profileScore = Math.min(15, profileScore);


  // 2. Repository Quality (Max 25)
  let repoScore = 0;
  const repoDetails = [];

  // Descriptions ratio (10 pts)
  const reposWithDescCount = totalRepos - (stats.repos_without_description || 0);
  const descRatio = Math.max(0, Math.min(1, reposWithDescCount / totalRepos));
  const descPts = Math.round(descRatio * 10);
  repoScore += descPts;
  repoDetails.push({
    label: `${Math.round(descRatio * 100)}% of repositories have descriptions`,
    pts: descPts,
    max: 10,
    status: descRatio >= 0.7 ? 'pass' : descRatio >= 0.4 ? 'warning' : 'fail',
  });

  // Topics / Tags ratio (5 pts)
  const topicsRatio = Math.max(0, Math.min(1, (stats.repos_with_topics || 0) / totalRepos));
  const topicsPts = Math.round(topicsRatio * 5);
  repoScore += topicsPts;
  repoDetails.push({
    label: `${Math.round(topicsRatio * 100)}% of repositories have discovery topic tags`,
    pts: topicsPts,
    max: 5,
    status: topicsRatio >= 0.5 ? 'pass' : 'warning',
  });

  // Stars & Forks Community Traction (5 pts)
  const stars = stats.total_stars || 0;
  let starsPts = 0;
  if (stars >= 50) starsPts = 5;
  else if (stars >= 20) starsPts = 4;
  else if (stars >= 10) starsPts = 3;
  else if (stars >= 3) starsPts = 2;
  else if (stars >= 1) starsPts = 1;
  repoScore += starsPts;
  repoDetails.push({
    label: `${stars} total stars earned across repositories`,
    pts: starsPts,
    max: 5,
    status: starsPts >= 3 ? 'pass' : 'warning',
  });

  // Clean Professional Naming (5 pts)
  const junkPatterns = /^(test|untitled|demo|sample|temp|asdf|foo|bar|project\d*|\d+)$/i;
  const junkRepos = repos.filter(r => junkPatterns.test(r.name));
  let namingPts = 5;
  if (junkRepos.length > 2) namingPts = 2;
  else if (junkRepos.length > 0) namingPts = 4;
  repoScore += namingPts;
  repoDetails.push({
    label: junkRepos.length === 0 ? 'Professional repository naming convention' : `${junkRepos.length} generic or scratch repo names detected`,
    pts: namingPts,
    max: 5,
    status: junkRepos.length === 0 ? 'pass' : 'warning',
  });
  repoScore = Math.min(25, repoScore);


  // 3. Documentation (Max 20)
  let docScore = 0;
  const docDetails = [];

  // README presence ratio (12 pts)
  const reposWithReadmeCount = totalRepos - (stats.repos_without_readme || 0);
  const readmeRatio = Math.max(0, Math.min(1, reposWithReadmeCount / totalRepos));
  const readmePts = Math.round(readmeRatio * 12);
  docScore += readmePts;
  docDetails.push({
    label: `${Math.round(readmeRatio * 100)}% of projects contain a README`,
    pts: readmePts,
    max: 12,
    status: readmeRatio >= 0.75 ? 'pass' : readmeRatio >= 0.4 ? 'warning' : 'fail',
  });

  // Top projects README quality (4 pts)
  const topProjectsWithReadme = top_projects.filter(r => r.hasReadme).length;
  const topProjectsRatio = top_projects.length > 0 ? (topProjectsWithReadme / top_projects.length) : 0;
  const topReadmePts = Math.round(topProjectsRatio * 4);
  docScore += topReadmePts;
  docDetails.push({
    label: `${topProjectsWithReadme}/${top_projects.length} featured showcase projects have documentation`,
    pts: topReadmePts,
    max: 4,
    status: topReadmePts >= 3 ? 'pass' : 'warning',
  });

  // Open Source Licensing (4 pts)
  const licensedRepos = repos.filter(r => Boolean(r.license)).length;
  const licenseRatio = licensedRepos / totalRepos;
  const licensePts = licenseRatio >= 0.5 ? 4 : licenseRatio >= 0.2 ? 3 : licensedRepos > 0 ? 2 : 0;
  docScore += licensePts;
  docDetails.push({
    label: licensedRepos > 0 ? `${licensedRepos} repositories have open source licenses` : 'No open-source licenses specified',
    pts: licensePts,
    max: 4,
    status: licensePts >= 2 ? 'pass' : 'warning',
  });
  docScore = Math.min(20, docScore);


  // 4. Activity (Max 15)
  let activityScore = 0;
  const activityDetails = [];
  const daysSincePush = stats.days_since_last_push ?? 999;

  let recencyPts = 1;
  if (daysSincePush <= 7) recencyPts = 6;
  else if (daysSincePush <= 30) recencyPts = 5;
  else if (daysSincePush <= 90) recencyPts = 3;
  activityScore += recencyPts;
  activityDetails.push({
    label: daysSincePush <= 7 ? 'Active this week!' : daysSincePush <= 30 ? `Active ${daysSincePush} days ago` : `Last pushed ${daysSincePush} days ago`,
    pts: recencyPts,
    max: 6,
    status: recencyPts >= 5 ? 'pass' : recencyPts >= 3 ? 'warning' : 'fail',
  });

  // Count repos updated in the last 6 months (5 pts)
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  const activeRecentCount = repos.filter(r => new Date(r.pushed_at || r.updated_at) > sixMonthsAgo).length;
  let recentCountPts = 1;
  if (activeRecentCount >= 5) recentCountPts = 5;
  else if (activeRecentCount >= 3) recentCountPts = 4;
  else if (activeRecentCount >= 1) recentCountPts = 3;
  activityScore += recentCountPts;
  activityDetails.push({
    label: `${activeRecentCount} repositories maintained in the past 6 months`,
    pts: recentCountPts,
    max: 5,
    status: recentCountPts >= 4 ? 'pass' : 'warning',
  });

  // Account Maturity (4 pts)
  const ageYears = profile.account_age_years || 1;
  let agePts = ageYears >= 2 ? 4 : ageYears >= 1 ? 3 : 2;
  activityScore += agePts;
  activityDetails.push({
    label: `${ageYears} year(s) of GitHub account tenure`,
    pts: agePts,
    max: 4,
    status: 'pass',
  });
  activityScore = Math.min(15, activityScore);


  // 5. Project Diversity (Max 10)
  let diversityScore = 0;
  const diversityDetails = [];

  const langCount = (stats.languages || []).length;
  let langPts = 1;
  if (langCount >= 4) langPts = 7;
  else if (langCount >= 2) langPts = 5;
  else if (langCount === 1) langPts = 3;
  diversityScore += langPts;
  diversityDetails.push({
    label: `${langCount} distinct programming languages used`,
    pts: langPts,
    max: 7,
    status: langPts >= 5 ? 'pass' : 'warning',
  });

  // Original projects vs forks (3 pts)
  const originalRatio = totalRepos > 0 ? (stats.original_repos_count / totalRepos) : 1;
  let originalPts = originalRatio >= 0.7 ? 3 : originalRatio >= 0.4 ? 2 : 1;
  diversityScore += originalPts;
  diversityDetails.push({
    label: `${Math.round(originalRatio * 100)}% original work (${stats.original_repos_count} original, ${stats.forked_repos_count} forks)`,
    pts: originalPts,
    max: 3,
    status: originalPts >= 2 ? 'pass' : 'warning',
  });
  diversityScore = Math.min(10, diversityScore);


  // 6. Recruiter Readiness (Max 15)
  let readinessScore = 0;
  const readinessDetails = [];

  // Top 3 Projects Presentation (6 pts)
  const top3 = top_projects.slice(0, 3);
  let top3Score = 0;
  top3.forEach(p => {
    if (p.description) top3Score += 1;
    if (p.hasReadme) top3Score += 1;
  });
  readinessScore += top3Score;
  readinessDetails.push({
    label: `Top showcase projects presentation standard (${top3Score}/6 criteria met)`,
    pts: top3Score,
    max: 6,
    status: top3Score >= 4 ? 'pass' : 'warning',
  });

  // Recruiter Reachability / Contact (4 pts)
  let contactPts = 1;
  if (profile.email && profile.blog) contactPts = 4;
  else if (profile.email || profile.blog || profile.twitter_username) contactPts = 3;
  else if (profile.location) contactPts = 2;
  readinessScore += contactPts;
  readinessDetails.push({
    label: contactPts >= 3 ? 'Recruiter can easily reach out directly' : 'Contact avenues are sparse or hidden',
    pts: contactPts,
    max: 4,
    status: contactPts >= 3 ? 'pass' : 'warning',
  });

  // Clutter vs Curation (5 pts)
  let clutterPts = 5;
  if (stats.repos_without_description > 10 && stats.repos_without_readme > 10) clutterPts = 2;
  else if (stats.repos_without_description > 5) clutterPts = 3;
  readinessScore += clutterPts;
  readinessDetails.push({
    label: clutterPts >= 4 ? 'Clean and curated portfolio appearance' : 'High volume of uncaptioned repository clutter',
    pts: clutterPts,
    max: 5,
    status: clutterPts >= 4 ? 'pass' : 'fail',
  });
  readinessScore = Math.min(15, readinessScore);


  // Overall Score Calculation
  const overall = Math.min(100, Math.max(0,
    profileScore + repoScore + docScore + activityScore + diversityScore + readinessScore
  ));

  let grade = 'B';
  let verdict = 'Promising Candidate';
  let verdictColor = 'amber';

  if (overall >= 85) {
    grade = 'A';
    verdict = 'Recruiter Ready';
    verdictColor = 'emerald';
  } else if (overall >= 70) {
    grade = 'B';
    verdict = 'Good Foundation, Needs Polish';
    verdictColor = 'blue';
  } else if (overall >= 50) {
    grade = 'C';
    verdict = 'Needs Immediate Rescue';
    verdictColor = 'amber';
  } else {
    grade = 'D';
    verdict = 'In Recruiter ICU';
    verdictColor = 'rose';
  }

  return {
    overall,
    grade,
    verdict,
    verdictColor,
    categories: {
      profile_quality: {
        score: profileScore,
        max: 15,
        percentage: Math.round((profileScore / 15) * 100),
        title: 'Profile Quality',
        icon: 'user',
        details: profileDetails,
      },
      repository_quality: {
        score: repoScore,
        max: 25,
        percentage: Math.round((repoScore / 25) * 100),
        title: 'Repository Quality',
        icon: 'folder-git',
        details: repoDetails,
      },
      documentation: {
        score: docScore,
        max: 20,
        percentage: Math.round((docScore / 20) * 100),
        title: 'Documentation',
        icon: 'file-text',
        details: docDetails,
      },
      activity: {
        score: activityScore,
        max: 15,
        percentage: Math.round((activityScore / 15) * 100),
        title: 'Activity & Cadence',
        icon: 'activity',
        details: activityDetails,
      },
      project_diversity: {
        score: diversityScore,
        max: 10,
        percentage: Math.round((diversityScore / 10) * 100),
        title: 'Project Diversity',
        icon: 'cpu',
        details: diversityDetails,
      },
      recruiter_readiness: {
        score: readinessScore,
        max: 15,
        percentage: Math.round((readinessScore / 15) * 100),
        title: 'Recruiter Readiness',
        icon: 'briefcase',
        details: readinessDetails,
      },
    },
  };
}
