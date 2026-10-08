import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePortfolioScore } from '../server/services/scoring.js';
import { detectPortfolioProblems } from '../server/services/problems.js';
import { generateRescuePlan } from '../server/services/rescue.js';
import { generateAIFeedback, ICONIC_ROASTS } from '../server/services/ai.js';

describe('End-to-End Portfolio Audit Pipeline (PromptWars Full System Test)', () => {
  const sampleCandidate = {
    profile: {
      username: 'dev_alex',
      name: 'Alex Developer',
      bio: 'Junior Software Engineer passionate about React and Python.',
      avatar_url: 'https://avatars.githubusercontent.com/u/12345',
      html_url: 'https://github.com/dev_alex',
      company: null,
      blog: 'https://alexdev.me',
      location: 'Bangalore, India',
      email: 'alex@dev.me',
      twitter_username: 'alex_codes',
      account_age_years: 1.8,
      hasProfileReadme: false,
    },
    stats: {
      total_repos: 11,
      original_repos_count: 7,
      forked_repos_count: 4,
      total_stars: 8,
      total_forks: 3,
      repos_without_description: 5,
      repos_with_homepage: 1,
      repos_with_topics: 2,
      repos_without_readme: 4,
      days_since_last_push: 12,
      languages: [
        { language: 'JavaScript', count: 6 },
        { language: 'Python', count: 3 },
        { language: 'HTML', count: 2 },
      ],
    },
    top_projects: [
      {
        id: 101,
        name: 'expense-tracker',
        description: 'React finance tracker app',
        hasReadme: true,
        stargazers_count: 5,
        forks_count: 2,
        language: 'JavaScript',
      },
      {
        id: 102,
        name: 'weather-cli',
        description: 'Python weather terminal tool',
        hasReadme: false,
        stargazers_count: 3,
        forks_count: 1,
        language: 'Python',
      },
    ],
    all_repos_sample: [
      { name: 'expense-tracker', description: 'React finance tracker app', hasReadme: true, license: 'MIT' },
      { name: 'weather-cli', description: 'Python weather terminal tool', hasReadme: false, license: null },
      { name: 'tutorial-todo', description: '', hasReadme: false, license: null },
    ],
  };

  it('executes complete audit pipeline: scoring -> problems -> rescue -> AI feedback', async () => {
    // 1. Scoring Engine
    const scoreData = calculatePortfolioScore(sampleCandidate);
    assert.ok(scoreData.overall >= 0 && scoreData.overall <= 100);
    assert.ok(['A', 'B', 'C', 'D'].includes(scoreData.grade));
    assert.ok(scoreData.categories.profile_quality.score <= 15);
    assert.ok(scoreData.categories.repository_quality.score <= 25);
    assert.ok(scoreData.categories.documentation.score <= 20);
    assert.ok(scoreData.categories.activity.score <= 15);
    assert.ok(scoreData.categories.project_diversity.score <= 10);
    assert.ok(scoreData.categories.recruiter_readiness.score <= 15);

    // 2. Problem Detection
    const problems = detectPortfolioProblems(sampleCandidate, scoreData);
    assert.ok(Array.isArray(problems));
    assert.ok(problems.length > 0);
    const problemIds = problems.map(p => p.id);
    assert.ok(problemIds.includes('missing-profile-readme'));
    assert.ok(problemIds.includes('missing-descriptions'));

    // 3. Rescue Plan & Simulation
    const rescuePlan = generateRescuePlan(sampleCandidate, scoreData, problems);
    assert.ok(rescuePlan.simulatedScore > scoreData.overall);
    assert.ok(rescuePlan.sevenDayPlan.length === 7);
    assert.ok(rescuePlan.fixFirst.length > 0);

    // 4. AI Feedback & Roasts
    const aiFeedback = await generateAIFeedback(sampleCandidate, scoreData, problems);
    assert.ok(aiFeedback.roast.length > 0);
    assert.ok(aiFeedback.roast_title.length > 0);
    assert.ok(Array.isArray(aiFeedback.additional_roasts));
    assert.ok(aiFeedback.recruiter_view.verdict.length > 0);
    assert.ok(aiFeedback.recruiter_view.hiring_manager_quote.length > 0);
  });

  it('verifies all 10 iconic user-requested roasts are present and well-formed', () => {
    assert.ok(Array.isArray(ICONIC_ROASTS));
    assert.ok(ICONIC_ROASTS.length >= 10);

    const goldFishRoast = ICONIC_ROASTS.find(r => r.text.includes("goldfish's attention span"));
    assert.ok(goldFishRoast);
    assert.strictEqual(goldFishRoast.title, 'TODO Since 2023');

    const vivaRoast = ICONIC_ROASTS.find(r => r.text.includes('giving a viva without reading the syllabus'));
    assert.ok(vivaRoast);
    assert.strictEqual(vivaRoast.title, 'The Unprepared Viva Exam');

    const srkRoast = ICONIC_ROASTS.find(r => r.text.includes('Shah Rukh Khan in My Name is Khan'));
    assert.ok(srkRoast);

    const karanJoharRoast = ICONIC_ROASTS.find(r => r.text.includes('directed by Karan Johar'));
    assert.ok(karanJoharRoast);
  });
});
