import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { fetchGitHubUserData } from './services/github.js';
import { calculatePortfolioScore } from './services/scoring.js';
import { detectPortfolioProblems } from './services/problems.js';
import { generateRescuePlan } from './services/rescue.js';
import { generateAIFeedback } from './services/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint (supports both /api/health and /health)
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    app: 'GitHub Roast & Rescue API',
    timestamp: new Date().toISOString(),
  });
});

// Main Analysis Endpoint (supports both /api/analyze and /analyze)
app.post(['/api/analyze', '/analyze'], async (req, res) => {
  try {
    const { username, githubToken, aiApiKey } = req.body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({
        error: 'Please provide a valid GitHub username.',
      });
    }

    const cleanUsername = username.trim();

    // 1. Fetch GitHub data
    const userData = await fetchGitHubUserData(cleanUsername, githubToken);

    // Empty profile check (Section 14 of PRD)
    if (userData.stats.total_repos === 0) {
      return res.status(200).json({
        isEmptyProfile: true,
        message: "We found the profile. Unfortunately, there isn't much to roast yet! Create and push a few repositories first.",
        profile: userData.profile,
      });
    }

    // 2. Deterministic Portfolio Quality Scoring (Section 8)
    const scoreData = calculatePortfolioScore(userData);

    // 3. Problem Detection (Section 7 F7)
    const problems = detectPortfolioProblems(userData, scoreData);

    // 4. Rescue Plan & Potential Improvement & 7-Day Plan (Section 7 F8, F10)
    const rescuePlan = generateRescuePlan(userData, scoreData, problems);

    // 5. AI Feedback (Roast & Recruiter 30-Second View) (Section 7 F5, F6)
    const aiFeedback = await generateAIFeedback(userData, scoreData, problems, aiApiKey);

    // Enhance top projects with AI hints
    const enrichedTopProjects = (userData.top_projects || []).map((proj) => {
      const hintObj = (aiFeedback.project_hints || []).find(h => h.repo_name === proj.name);
      return {
        ...proj,
        improvementHint: hintObj ? hintObj.hint : 'Add a detailed README with installation steps and live preview link.',
      };
    });

    const report = {
      profile: userData.profile,
      stats: userData.stats,
      score: scoreData,
      roast: {
        title: aiFeedback.roast_title,
        text: aiFeedback.roast,
        additionalRoasts: aiFeedback.additional_roasts || [],
      },
      recruiterView: aiFeedback.recruiter_view,
      problems,
      rescuePlan,
      topProjects: enrichedTopProjects,
      analyzedAt: new Date().toISOString(),
    };

    return res.json(report);
  } catch (error) {
    console.error('Analysis error:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.message || 'Something went wrong while fetching GitHub data. Retry analysis.',
    });
  }
});

// Production static file serving for local standalone runs if client build exists
const clientDistPath = path.join(__dirname, '../client/dist');
if (!process.env.VERCEL && fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health' || req.path === '/analyze') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
      if (err) {
        res.status(404).send('Not Found');
      }
    });
  });
}

// Start listener only when run directly as main module, never in tests or Vercel
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
const isTestMode = Boolean(
  process.env.NODE_TEST_CONTEXT ||
  process.env.NODE_ENV === 'test' ||
  process.argv.some(a => a.includes('test')) ||
  process.execArgv.some(a => a.includes('test')) ||
  process.env.VITEST
);

if (isDirectRun && !isTestMode && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 GitHub Roast & Rescue server running on http://localhost:${PORT}`);
    console.log(`🔑 GitHub Token: ${Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim()) ? 'Configured ✅ (High Rate Limit)' : 'Unset (Public Rate Limit)'}`);
    console.log(`🤖 Gemini AI Key: ${Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) ? 'Configured ✅' : 'Unset (Using Dynamic Engine)'}`);
  });
}

export default app;
