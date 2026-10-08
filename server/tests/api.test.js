process.env.NODE_ENV = 'test';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../server.js';

describe('Express API Endpoints Integration (PRD Section 12)', () => {
  it('responds with 200 OK on GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.strictEqual(res.body.app, 'GitHub Roast & Rescue API');
    assert.ok(res.body.timestamp);
  });

  it('responds with 200 OK on GET /health (dual routing for Vercel)', async () => {
    const res = await request(app).get('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
  });

  it('rejects POST /api/analyze without username with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({});
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error);
    assert.ok(res.body.error.includes('valid GitHub username'));
  });

  it('rejects POST /api/analyze with whitespace username with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ username: '   ' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error);
  });

  it('handles valid analyze request on /api/analyze and returns full audit report schema', async () => {
    // Testing with octocat (GitHub official mascot profile)
    const res = await request(app)
      .post('/api/analyze')
      .send({ username: 'octocat' });

    assert.strictEqual(res.status, 200);
    const report = res.body;

    // Verify root schema sections
    assert.ok(report.profile, 'Must contain profile');
    assert.ok(report.stats, 'Must contain stats');
    assert.ok(report.score, 'Must contain score');
    assert.ok(report.roast, 'Must contain roast');
    assert.ok(report.recruiterView, 'Must contain recruiterView');
    assert.ok(Array.isArray(report.problems), 'Must contain problems array');
    assert.ok(report.rescuePlan, 'Must contain rescuePlan');
    assert.ok(Array.isArray(report.topProjects), 'Must contain topProjects');

    // Verify Score Details
    assert.strictEqual(typeof report.score.overall, 'number');
    assert.ok(report.score.overall >= 0 && report.score.overall <= 100);
    assert.ok(['A', 'B', 'C', 'D'].includes(report.score.grade));

    // Verify Roast
    assert.ok(report.roast.text.length > 0);
    assert.ok(report.roast.title.length > 0);
    assert.ok(Array.isArray(report.roast.additionalRoasts));
  });
});
