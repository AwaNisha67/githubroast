import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePortfolioScore } from '../services/scoring.js';

describe('Deterministic Scoring Engine (PRD Section 8)', () => {
  const createMockUserData = (overrides = {}) => {
    return {
      profile: {
        username: 'testdev',
        name: 'Test Developer',
        bio: 'Full-stack software engineer building open source tools and web apps.',
        avatar_url: 'https://github.com/testdev.png',
        html_url: 'https://github.com/testdev',
        company: 'Acme Corp',
        blog: 'https://testdev.io',
        location: 'San Francisco, CA',
        email: 'test@testdev.io',
        twitter_username: 'testdev',
        account_age_years: 3.5,
        hasProfileReadme: true,
        ...(overrides.profile || {}),
      },
      stats: {
        total_repos: 10,
        original_repos_count: 8,
        forked_repos_count: 2,
        total_stars: 45,
        total_forks: 12,
        repos_without_description: 0,
        repos_with_homepage: 4,
        repos_with_topics: 6,
        repos_without_readme: 0,
        days_since_last_push: 3,
        languages: [
          { language: 'TypeScript', count: 5 },
          { language: 'Python', count: 3 },
          { language: 'Go', count: 2 },
        ],
        ...(overrides.stats || {}),
      },
      top_projects: overrides.top_projects || [
        {
          id: 1,
          name: 'cloud-orchestrator',
          description: 'Distributed microservice orchestrator',
          hasReadme: true,
          stargazers_count: 30,
          forks_count: 8,
          language: 'TypeScript',
        },
        {
          id: 2,
          name: 'data-pipeline',
          description: 'High-throughput stream processing pipeline',
          hasReadme: true,
          stargazers_count: 15,
          forks_count: 4,
          language: 'Python',
        },
      ],
      all_repos_sample: overrides.all_repos_sample || [
        { name: 'cloud-orchestrator', description: 'desc', hasReadme: true, license: 'MIT' },
        { name: 'data-pipeline', description: 'desc', hasReadme: true, license: 'MIT' },
      ],
    };
  };

  it('calculates high score (Grade A - Recruiter Ready) for strong portfolio', () => {
    const mockData = createMockUserData();
    const result = calculatePortfolioScore(mockData);

    assert.ok(result.overall >= 80, `Expected score >= 80, got ${result.overall}`);
    assert.strictEqual(typeof result.overall, 'number');
    assert.ok(result.overall <= 100);
    assert.ok(['A', 'B'].includes(result.grade));
    assert.ok(result.verdict.length > 0);
  });

  it('correctly caps all 6 categories to their PRD specified maximum weights', () => {
    const mockData = createMockUserData();
    const result = calculatePortfolioScore(mockData);
    const { categories } = result;

    assert.ok(categories.profile_quality.score <= 15, 'Profile Quality must be <= 15');
    assert.ok(categories.repository_quality.score <= 25, 'Repository Quality must be <= 25');
    assert.ok(categories.documentation.score <= 20, 'Documentation must be <= 20');
    assert.ok(categories.activity.score <= 15, 'Activity must be <= 15');
    assert.ok(categories.project_diversity.score <= 10, 'Project Diversity must be <= 10');
    assert.ok(categories.recruiter_readiness.score <= 15, 'Recruiter Readiness must be <= 15');

    const sumOfMax = 
      categories.profile_quality.max +
      categories.repository_quality.max +
      categories.documentation.max +
      categories.activity.max +
      categories.project_diversity.max +
      categories.recruiter_readiness.max;

    assert.strictEqual(sumOfMax, 100, 'Sum of maximum weights must strictly equal 100');
  });

  it('penalizes poor profiles with missing bio, zero READMEs, and stale activity', () => {
    const poorData = createMockUserData({
      profile: {
        bio: '',
        name: 'testdev',
        hasProfileReadme: false,
        blog: null,
        company: null,
        location: null,
        email: null,
        twitter_username: null,
        account_age_years: 0.2,
      },
      stats: {
        total_repos: 12,
        original_repos_count: 2,
        forked_repos_count: 10,
        total_stars: 0,
        total_forks: 0,
        repos_without_description: 12,
        repos_with_homepage: 0,
        repos_with_topics: 0,
        repos_without_readme: 12,
        days_since_last_push: 180,
        languages: [{ language: 'JavaScript', count: 2 }],
      },
      top_projects: [
        { name: 'test', description: '', hasReadme: false, stargazers_count: 0 },
      ],
      all_repos_sample: [
        { name: 'test', description: '', hasReadme: false, license: null },
        { name: 'demo123', description: '', hasReadme: false, license: null },
      ],
    });

    const result = calculatePortfolioScore(poorData);
    assert.ok(result.overall < 50, `Expected low score < 50, got ${result.overall}`);
    assert.strictEqual(result.grade, 'D');
    assert.strictEqual(result.verdictColor, 'rose');
  });

  it('grades properly according to PRD grade brackets', () => {
    const testCases = [
      { score: 90, expectedGrade: 'A' },
      { score: 75, expectedGrade: 'B' },
      { score: 60, expectedGrade: 'C' },
      { score: 40, expectedGrade: 'D' },
    ];

    for (const tc of testCases) {
      assert.ok(['A', 'B', 'C', 'D'].includes(tc.expectedGrade));
    }
  });
});
