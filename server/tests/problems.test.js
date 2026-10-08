import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { detectPortfolioProblems } from '../services/problems.js';

describe('Problem Detection Engine (PRD Section 7 F7)', () => {
  it('detects critical problems when profile is uncurated', () => {
    const mockUserData = {
      profile: {
        username: 'unpolished_dev',
        hasProfileReadme: false,
        bio: '',
      },
      stats: {
        total_repos: 8,
        repos_without_description: 6,
        repos_without_readme: 5,
        repos_with_homepage: 0,
        days_since_last_push: 120,
        forked_repos_count: 5,
        original_repos_count: 3,
        repos_with_topics: 0,
      },
      top_projects: [],
      all_repos_sample: [
        { name: 'repo-1', description: '', hasReadme: false },
        { name: 'repo-2', description: '', hasReadme: false },
        { name: 'repo-3', description: '', hasReadme: false },
      ],
    };

    const mockScore = { overall: 42 };
    const problems = detectPortfolioProblems(mockUserData, mockScore);

    assert.ok(Array.isArray(problems));
    assert.ok(problems.length >= 4, `Expected at least 4 problems, found ${problems.length}`);

    const problemIds = problems.map(p => p.id);
    assert.ok(problemIds.includes('missing-profile-readme'));
    assert.ok(problemIds.includes('missing-descriptions'));
    assert.ok(problemIds.includes('missing-readmes'));
    assert.ok(problemIds.includes('dormant-activity'));
  });

  it('orders detected problems by severity (critical first)', () => {
    const mockUserData = {
      profile: {
        username: 'coder',
        hasProfileReadme: false,
        bio: 'Hello world',
      },
      stats: {
        total_repos: 10,
        repos_without_description: 8,
        repos_without_readme: 5,
        repos_with_homepage: 0,
        days_since_last_push: 15,
        forked_repos_count: 0,
        original_repos_count: 10,
        repos_with_topics: 0,
      },
      top_projects: [],
      all_repos_sample: [
        { name: 'app-1', description: '', hasReadme: false },
      ],
    };

    const problems = detectPortfolioProblems(mockUserData, { overall: 60 });
    const severityValues = { critical: 0, high: 1, medium: 2, low: 3 };

    for (let i = 0; i < problems.length - 1; i++) {
      const curr = severityValues[problems[i].severity];
      const next = severityValues[problems[i + 1].severity];
      assert.ok(curr <= next, `Problem ${problems[i].id} (${problems[i].severity}) should be >= ${problems[i + 1].id} (${problems[i + 1].severity})`);
    }
  });

  it('returns empty problems array when portfolio is completely optimized', () => {
    const perfectUserData = {
      profile: {
        username: 'pro_dev',
        hasProfileReadme: true,
        bio: 'Senior Full Stack Engineer specializing in TypeScript and Cloud Architecture.',
      },
      stats: {
        total_repos: 10,
        repos_without_description: 0,
        repos_without_readme: 0,
        repos_with_homepage: 8,
        days_since_last_push: 2,
        forked_repos_count: 1,
        original_repos_count: 9,
        repos_with_topics: 10,
      },
      top_projects: [],
      all_repos_sample: [
        { name: 'showcase-app', description: 'Production app', hasReadme: true, homepage: 'https://app.dev' },
      ],
    };

    const problems = detectPortfolioProblems(perfectUserData, { overall: 98 });
    assert.strictEqual(problems.length, 0);
  });
});
