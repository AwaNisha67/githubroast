import axios from 'axios';

// In-memory cache for 5 minutes to conserve GitHub API rate limits
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getFromCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

function setToCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

function getGitHubHeaders(customToken) {
  const token = customToken || process.env.GITHUB_TOKEN;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Roast-And-Rescue-App',
  };
  if (token && token.trim()) {
    headers['Authorization'] = `token ${token.trim()}`;
  }
  return headers;
}

/**
 * Fetch public GitHub profile and repository data
 */
export async function fetchGitHubUserData(username, customToken = null) {
  const sanitizedUsername = username.trim().toLowerCase();
  const cacheKey = `user_${sanitizedUsername}`;
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }

  const headers = getGitHubHeaders(customToken);

  try {
    // 1. Fetch user profile
    const userRes = await axios.get(`https://api.github.com/users/${sanitizedUsername}`, {
      headers,
      timeout: 10000,
    });
    const profile = userRes.data;

    // 2. Fetch public repos (up to 100, sorted by recently pushed)
    const reposRes = await axios.get(
      `https://api.github.com/users/${sanitizedUsername}/repos?per_page=100&sort=pushed&direction=desc`,
      {
        headers,
        timeout: 12000,
      }
    );
    const rawRepos = reposRes.data;

    // 3. Check for profile README (repo named same as username)
    let hasProfileReadme = false;
    try {
      const readmeRes = await axios.get(
        `https://api.github.com/repos/${sanitizedUsername}/${sanitizedUsername}/readme`,
        { headers, timeout: 5000 }
      );
      if (readmeRes.status === 200 && readmeRes.data) {
        hasProfileReadme = true;
      }
    } catch (err) {
      // 404 means no profile README
      hasProfileReadme = false;
    }

    // 4. Check READMEs for top repositories (first 8 non-fork repos)
    const nonForkRepos = rawRepos.filter(r => !r.fork);
    const reposToCheck = (nonForkRepos.length > 0 ? nonForkRepos : rawRepos).slice(0, 8);
    const readmeCheckResults = new Map();

    await Promise.all(
      reposToCheck.map(async (repo) => {
        try {
          const res = await axios.get(
            `https://api.github.com/repos/${sanitizedUsername}/${repo.name}/readme`,
            { headers, timeout: 4000 }
          );
          readmeCheckResults.set(repo.id, {
            hasReadme: true,
            size: res.data.size || 0,
            name: res.data.name,
          });
        } catch {
          readmeCheckResults.set(repo.id, { hasReadme: false, size: 0 });
        }
      })
    );

    // 5. Aggregate statistics
    let totalStars = 0;
    let totalForks = 0;
    let reposWithoutDescription = 0;
    let reposWithHomepage = 0;
    let reposWithTopics = 0;
    let reposWithoutReadme = 0;
    const languageCounts = {};

    const enrichedRepos = rawRepos.map((repo) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;

      const hasDesc = Boolean(repo.description && repo.description.trim().length > 0);
      if (!hasDesc) reposWithoutDescription++;

      if (repo.homepage && repo.homepage.trim().length > 0) reposWithHomepage++;
      if (repo.topics && repo.topics.length > 0) reposWithTopics++;

      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }

      const readmeMeta = readmeCheckResults.get(repo.id);
      // For unchecked repos, estimate based on size > 15kb
      const hasReadme = readmeMeta
        ? readmeMeta.hasReadme
        : repo.size > 15;
      
      if (!hasReadme) reposWithoutReadme++;

      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        fork: repo.fork,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        homepage: repo.homepage,
        size: repo.size,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        archived: repo.archived,
        topics: repo.topics || [],
        license: repo.license ? repo.license.spdx_id || repo.license.name : null,
        hasReadme,
      };
    });

    // Languages sorted by popularity
    const sortedLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang, count]) => ({ language: lang, count }));

    // Top projects ranking: non-forked first, sorted by stars + forks + size/activity
    const topProjects = [...enrichedRepos]
      .filter((r) => !r.archived)
      .sort((a, b) => {
        // Priority for non-forks
        if (a.fork !== b.fork) return a.fork ? 1 : -1;
        const scoreA = (a.stargazers_count * 3) + (a.forks_count * 2) + (a.description ? 2 : 0) + (a.homepage ? 2 : 0);
        const scoreB = (b.stargazers_count * 3) + (b.forks_count * 2) + (b.description ? 2 : 0) + (b.homepage ? 2 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 6);

    // Compute account age in years
    const createdDate = new Date(profile.created_at);
    const now = new Date();
    const accountAgeYears = Math.max(0.1, Number(((now - createdDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)));

    // Days since last push
    let daysSinceLastPush = 999;
    if (enrichedRepos.length > 0 && enrichedRepos[0].pushed_at) {
      const lastPushDate = new Date(enrichedRepos[0].pushed_at);
      daysSinceLastPush = Math.max(0, Math.floor((now - lastPushDate) / (1000 * 60 * 60 * 24)));
    }

    const payload = {
      profile: {
        username: profile.login,
        name: profile.name || profile.login,
        bio: profile.bio || '',
        avatar_url: profile.avatar_url,
        html_url: profile.html_url,
        company: profile.company || null,
        blog: profile.blog || null,
        location: profile.location || null,
        email: profile.email || null,
        twitter_username: profile.twitter_username || null,
        public_repos: profile.public_repos,
        public_gists: profile.public_gists,
        followers: profile.followers,
        following: profile.following,
        created_at: profile.created_at,
        account_age_years: accountAgeYears,
        hasProfileReadme,
      },
      stats: {
        total_repos: rawRepos.length,
        original_repos_count: nonForkRepos.length,
        forked_repos_count: rawRepos.length - nonForkRepos.length,
        total_stars: totalStars,
        total_forks: totalForks,
        repos_without_description: reposWithoutDescription,
        repos_with_homepage: reposWithHomepage,
        repos_with_topics: reposWithTopics,
        repos_without_readme: reposWithoutReadme,
        days_since_last_push: daysSinceLastPush,
        languages: sortedLanguages,
      },
      top_projects: topProjects,
      all_repos_sample: enrichedRepos.slice(0, 30),
    };

    setToCache(cacheKey, payload);
    return payload;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        const err = new Error('GitHub profile not found. Check the username and try again.');
        err.statusCode = 404;
        throw err;
      }
      if (error.response.status === 403) {
        const rateLimitRemaining = error.response.headers['x-ratelimit-remaining'];
        if (rateLimitRemaining === '0') {
          const err = new Error("GitHub isn't letting us inspect more profiles right now. GitHub API rate limit exceeded. You can configure a personal access token in settings to bypass limits.");
          err.statusCode = 429;
          throw err;
        }
      }
    }
    const err = new Error(error.message || 'Something went wrong while fetching GitHub data. Retry analysis.');
    err.statusCode = 500;
    throw err;
  }
}
