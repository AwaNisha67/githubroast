import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateAIFeedback, ICONIC_ROASTS } from '../services/ai.js';

describe('AI Feedback & Iconic Roasts Engine (PRD Section 7 F5 & F6)', () => {
  it('contains the curated collection of iconic community roasts', () => {
    assert.ok(Array.isArray(ICONIC_ROASTS));
    assert.ok(ICONIC_ROASTS.length >= 10, 'Expected at least 10 iconic roasts');

    ICONIC_ROASTS.forEach((roast) => {
      assert.ok(roast.title && roast.title.length > 0, 'Roast must have title');
      assert.ok(roast.text && roast.text.length > 0, 'Roast must have text');
      assert.ok(roast.category, 'Roast must have category');
    });

    // Check specific user requested roasts
    const allTexts = ICONIC_ROASTS.map(r => r.text).join(' ');
    assert.ok(allTexts.includes("goldfish's attention span"));
    assert.ok(allTexts.includes("diary of poor life choices"));
    assert.ok(allTexts.includes("family reunion therapy session"));
    assert.ok(allTexts.includes("pull my own Git repository"));
    assert.ok(allTexts.includes("Shah Rukh Khan in My Name is Khan"));
    assert.ok(allTexts.includes("item song dropped randomly in an arthouse film"));
    assert.ok(allTexts.includes("keep your profile on 'Private'"));
    assert.ok(allTexts.includes("giving a viva without reading the syllabus"));
    assert.ok(allTexts.includes("tweaking your LinkedIn bio"));
    assert.ok(allTexts.includes("family drama directed by Karan Johar"));
  });

  it('generates dynamic feedback with full recruiter view and additional roasts', async () => {
    const mockUserData = {
      profile: {
        username: 'coder_viva',
        name: 'Viva Candidate',
        hasProfileReadme: false,
      },
      stats: {
        total_repos: 14,
        repos_without_readme: 8,
        repos_without_description: 6,
        days_since_last_push: 25,
        languages: [{ language: 'Python', count: 8 }, { language: 'JavaScript', count: 6 }],
        total_stars: 4,
        total_forks: 1,
      },
      top_projects: [
        { name: 'viva-bot', description: 'Bot for exams', language: 'Python', stargazers_count: 2 },
        { name: 'notes-app', description: '', language: 'JavaScript', stargazers_count: 1 },
      ],
    };

    const mockScore = { overall: 55, grade: 'C' };
    const feedback = await generateAIFeedback(mockUserData, mockScore, []);

    assert.ok(feedback, 'Feedback must not be null');
    assert.ok(feedback.roast && feedback.roast.length > 0, 'Must have primary roast');
    assert.ok(feedback.roast_title && feedback.roast_title.length > 0, 'Must have roast title');

    // Recruiter view verification
    const rv = feedback.recruiter_view;
    assert.ok(rv, 'Must have recruiter_view');
    assert.ok(rv.verdict && rv.verdict.length > 0, 'Must have recruiter verdict');
    assert.ok(rv.quick_take && rv.quick_take.length > 0, 'Must have recruiter quick take');
    assert.ok(Array.isArray(rv.strengths) && rv.strengths.length > 0, 'Must have strengths');
    assert.ok(Array.isArray(rv.red_flags) && rv.red_flags.length > 0, 'Must have red flags');
    assert.ok(rv.hiring_manager_quote && rv.hiring_manager_quote.length > 0, 'Must have hiring manager quote');

    // Additional roasts for interactive reroll feature
    assert.ok(Array.isArray(feedback.additional_roasts), 'Must have additional_roasts array');
    assert.ok(feedback.additional_roasts.length > 0, 'Additional roasts must not be empty');

    // Project hints verification
    assert.ok(Array.isArray(feedback.project_hints));
    assert.strictEqual(feedback.project_hints.length, 2);
    assert.strictEqual(feedback.project_hints[0].repo_name, 'viva-bot');
  });
});
