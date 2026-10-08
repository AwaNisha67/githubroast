import axios from 'axios';

/**
 * AI Service for GitHub Roast & Rescue
 * Uses Gemini API (or OpenAI) when keys are available, with an intelligent
 * dynamic synthesis engine fallback to guarantee 100% demo uptime.
 */

export async function generateAIFeedback(userData, scoreData, problemsData, customAiKey = null) {
  const { profile, stats, top_projects } = userData;

  // Build the structured input as specified in Section 9 of the PRD
  const aiPayload = {
    username: profile.username,
    name: profile.name,
    repos: stats.total_repos,
    repos_without_readme: stats.repos_without_readme,
    repos_without_description: stats.repos_without_description,
    languages: (stats.languages || []).slice(0, 5).map(l => l.language),
    recent_activity: stats.days_since_last_push <= 14 ? 'high' : stats.days_since_last_push <= 60 ? 'medium' : 'low',
    days_since_last_push: stats.days_since_last_push,
    profile_readme: profile.hasProfileReadme,
    stars: stats.total_stars,
    forks: stats.total_forks,
    top_projects: (top_projects || []).slice(0, 4).map(p => ({
      name: p.name,
      description: p.description || 'No description',
      language: p.language || 'Unknown',
      stars: p.stargazers_count,
    })),
    score: scoreData.overall,
    grade: scoreData.grade,
  };

  const apiKey = customAiKey || process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const result = await callGeminiAPI(aiPayload, apiKey.trim());
      if (result) return result;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to dynamic roast engine:', err.message);
    }
  }

  // Fallback dynamic generator (guarantees instantaneous, witty, context-aware results)
  return generateDynamicFeedback(aiPayload, problemsData);
}

/**
 * Calls Google Gemini API
 */
async function callGeminiAPI(payload, apiKey) {
  const prompt = `
You are the AI engine for "GitHub Roast & Rescue" - an AI-Powered GitHub Portfolio Auditor for student and early-career developers.
Your goal is to evaluate the user's public GitHub from a recruiter-oriented perspective.
Rules:
1. Roast the PROFILE and code presentation, NOT the person. Keep it clever, developer-insider humorous, and constructive.
2. Formulate the "Recruiter 30-Second View" as an experienced tech recruiter or hiring manager skimming their profile.
3. Keep the roast punchy (2-3 sentences max).

Here is the developer's profile data:
${JSON.stringify(payload, null, 2)}

Respond with a valid JSON object matching this exact structure:
{
  "roast": "A 2-3 sentence humorous roast specifically citing their numbers, repos, or habits.",
  "roast_title": "A witty 3-5 word headline for the roast (e.g., 'The Secret Agent Developer', 'README Phobia In Full Bloom')",
  "recruiter_view": {
    "verdict": "One short verdict sentence from the recruiter",
    "quick_take": "A 2 sentence hiring manager impression",
    "strengths": ["3 key bullet points of strengths observed"],
    "red_flags": ["3 key bullet points of recruiter turn-offs"],
    "hiring_manager_quote": "A realistic quote a hiring manager would say to their recruiter colleague"
  },
  "project_hints": [
    { "repo_name": "name of top project", "hint": "Specific 1-sentence tip to make this project shine to a recruiter" }
  ]
}
`;

  const url = apiKey.startsWith('AQ.') || apiKey.startsWith('ya29.')
    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
    : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const headers = {
    'Content-Type': 'application/json',
  };
  if (apiKey.startsWith('AQ.') || apiKey.startsWith('ya29.')) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    headers['x-goog-api-key'] = apiKey;
  }

  const response = await axios.post(
    url,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    },
    { headers, timeout: 15000 }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text) {
    return JSON.parse(text);
  }
  return null;
}

/**
 * Intelligent Dynamic Synthesis Engine
 * Generates tailored roasts and recruiter feedback referencing exact stats.
 */
function generateDynamicFeedback(payload, problems) {
  const { username, repos, repos_without_description, repos_without_readme, languages, profile_readme, days_since_last_push, top_projects, score } = payload;
  const topProjNames = top_projects.map(p => `"${p.name}"`).join(', ') || 'your projects';

  // 1. Generate Contextual Roast
  let roast = '';
  let roastTitle = '';

  if (repos_without_description > 5 && !profile_readme) {
    roast = `You have ${repos} repositories, but ${repos_without_description} of them have no description and your profile README is nowhere to be found. Your code is apparently undercover and operating strictly on a need-to-know basis.`;
    roastTitle = 'The Classified Agent Profile';
  } else if (repos_without_readme > (repos * 0.5)) {
    roast = `More than half of your repositories have zero README files. You seem to treat your GitHub like a secret diary where documentation is considered a security vulnerability.`;
    roastTitle = 'README Phobia In Full Bloom';
  } else if (days_since_last_push > 90) {
    roast = `Your last push was ${days_since_last_push} days ago. Archeologists are currently securing funding to excavate your commit history and determine if your terminal is still functional.`;
    roastTitle = 'The Ancient Artifact Collection';
  } else if (languages.length === 1) {
    roast = `You have built everything exclusively in ${languages[0]}. Loyalty is an admirable trait, but recruiters might start wondering if other programming languages are illegal in your jurisdiction.`;
    roastTitle = 'The Single-Stack Monolith';
  } else if (score >= 80) {
    roast = `Honestly, your GitHub is surprisingly solid with ${repos} repos and active commits. But recruiters will still find a way to ask why your top project doesn't have 10,000 GitHub stars and a venture funding round.`;
    roastTitle = 'Suspiciously Competent';
  } else {
    roast = `You've got ${repos} repositories, including ${topProjNames}, but with ${repos_without_description} missing descriptions and ${repos_without_readme} missing READMEs, you're making recruiters guess whether you're a 10x developer or a 10x copy-paster.`;
    roastTitle = 'The Mystery Box Portfolio';
  }

  // 2. Generate Recruiter 30-Second View
  const strengths = [];
  const redFlags = [];

  if (repos >= 5) strengths.push(`Healthy project volume (${repos} public repositories show continuous effort)`);
  if (languages.length >= 2) strengths.push(`Multi-language versatility across ${languages.slice(0, 3).join(', ')}`);
  if (days_since_last_push <= 30) strengths.push(`Active momentum (recent code committed within the last ${days_since_last_push} days)`);
  if (top_projects.some(p => p.stars > 0)) strengths.push(`Community interest signaled with external stars`);
  if (strengths.length < 3) strengths.push('Public code portfolio is live and open for review');

  if (!profile_readme) redFlags.push('Missing profile README — first impression is empty and unguided');
  if (repos_without_description > 0) redFlags.push(`${repos_without_description} repos have no summary — recruiter can\'t tell what you built`);
  if (repos_without_readme > 0) redFlags.push('Missing README documentation — high friction to understand architecture');
  if (days_since_last_push > 60) redFlags.push('Dormant commit history makes current technical readiness unclear');
  if (redFlags.length < 3) redFlags.push('Lack of deployed live demo links forces reviewers to guess how apps work');

  let verdict = '';
  let quickTake = '';
  let hiringManagerQuote = '';

  if (score >= 80) {
    verdict = 'Fast-track to technical phone screen.';
    quickTake = `Strong signal of genuine technical curiosity and consistent execution. The candidate has substantial code out in the open with solid variety.`;
    hiringManagerQuote = `"I can immediately see what they build and how they think. Send them a screen invitation."`;
  } else if (score >= 65) {
    verdict = 'Technically capable, but portfolio presentation is holding them back.';
    quickTake = `There is legitimate technical substance here across ${languages.slice(0, 2).join(' & ')}, but lack of polished documentation forces the recruiter to dig too hard.`;
    hiringManagerQuote = `"The code is there, but I don't have 15 minutes to decipher what half of these repos do. Have them clean up their showcase."`;
  } else {
    verdict = 'Skim & skip territory unless direct referral.';
    quickTake = `The profile looks like an uncurated dumping ground of course assignments and scratchpads rather than a deliberate professional showcase.`;
    hiringManagerQuote = `"I need to see at least two complete, well-documented projects with live links before I can recommend an interview."`;
  }

  // 3. Project-level hints
  const projectHints = (top_projects || []).map((p) => {
    let hint = `Add a 2-minute demo GIF and specify the technical challenges you solved with ${p.language || 'code'}.`;
    if (!p.description) {
      hint = `Add a crisp 1-sentence description and mention if this has a live demo or deployed URL.`;
    } else if (p.stars > 2) {
      hint = `This is your strongest repository! Pin it to your profile and add a "Key Features & Architecture" section.`;
    }
    return {
      repo_name: p.name,
      hint,
    };
  });

  return {
    roast,
    roast_title: roastTitle,
    recruiter_view: {
      verdict,
      quick_take: quickTake,
      strengths: strengths.slice(0, 3),
      red_flags: redFlags.slice(0, 3),
      hiring_manager_quote: hiringManagerQuote,
    },
    project_hints: projectHints,
  };
}
