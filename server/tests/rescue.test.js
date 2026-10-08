import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateRescuePlan } from '../services/rescue.js';

describe('Rescue Plan Engine (PRD Section 7 F8 & F10)', () => {
  const mockUserData = {
    profile: {
      username: 'student_dev',
      hasProfileReadme: false,
      name: 'Student Dev',
    },
    stats: {
      total_repos: 12,
      repos_without_description: 7,
      repos_without_readme: 6,
      repos_with_homepage: 0,
      repos_with_topics: 1,
      forked_repos_count: 5,
    },
    top_projects: [],
  };

  const mockScoreData = { overall: 58 };
  const mockProblems = [
    { id: 'missing-profile-readme', severity: 'critical' },
    { id: 'missing-descriptions', severity: 'high' },
  ];

  it('generates prioritized tiers: Fix First, Fix Next, and Nice to Have', () => {
    const rescuePlan = generateRescuePlan(mockUserData, mockScoreData, mockProblems);

    assert.ok(Array.isArray(rescuePlan.fixFirst));
    assert.ok(Array.isArray(rescuePlan.fixNext));
    assert.ok(Array.isArray(rescuePlan.niceToHave));

    assert.ok(rescuePlan.fixFirst.length > 0, 'Must have Fix First items');
    assert.ok(rescuePlan.fixNext.length > 0, 'Must have Fix Next items');
    assert.ok(rescuePlan.niceToHave.length > 0, 'Must have Nice to Have items');
  });

  it('calculates transparent potential score improvement', () => {
    const rescuePlan = generateRescuePlan(mockUserData, mockScoreData, mockProblems);

    assert.strictEqual(rescuePlan.currentScore, 58);
    assert.ok(rescuePlan.simulatedScore > rescuePlan.currentScore, 'Simulated score must be higher than current score');
    assert.ok(rescuePlan.simulatedScore <= 100, 'Simulated score must not exceed 100');
    assert.strictEqual(rescuePlan.potentialGain, rescuePlan.simulatedScore - rescuePlan.currentScore);
  });

  it('generates a full 7-day turnaround plan with structured tasks', () => {
    const rescuePlan = generateRescuePlan(mockUserData, mockScoreData, mockProblems);
    const { sevenDayPlan } = rescuePlan;

    assert.ok(Array.isArray(sevenDayPlan));
    assert.strictEqual(sevenDayPlan.length, 7, 'Must have exactly 7 days in improvement roadmap');

    sevenDayPlan.forEach((day, index) => {
      assert.strictEqual(day.day, index + 1, `Day number must match index + 1`);
      assert.ok(day.title.length > 0, 'Day must have title');
      assert.ok(day.objective.length > 0, 'Day must have objective');
      assert.ok(day.time.length > 0, 'Day must have estimated time');
      assert.ok(Array.isArray(day.tasks) && day.tasks.length > 0, 'Day must have tasks');
    });
  });

  it('includes copyable starter templates for key actions', () => {
    const rescuePlan = generateRescuePlan(mockUserData, mockScoreData, mockProblems);
    const profileReadmeTask = rescuePlan.fixFirst.find(t => t.id === 'fix-profile-readme');

    assert.ok(profileReadmeTask, 'Must contain fix-profile-readme task');
    assert.ok(profileReadmeTask.template, 'Must provide template markdown');
    assert.ok(profileReadmeTask.template.includes('Hi there'), 'Template should contain greeting');
  });
});
