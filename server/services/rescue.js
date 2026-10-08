/**
 * Rescue Plan Engine (Section 7 F8, F10, Section 9 & 10 of PRD)
 * Prioritizes improvements into Fix First, Fix Next, Nice to Have,
 * calculates transparent score improvement potential, and builds an actionable 7-day roadmap.
 */

export function generateRescuePlan(userData, scoreData, problems) {
  const { profile, stats, top_projects } = userData;
  const currentScore = scoreData.overall;

  const fixFirst = [];
  const fixNext = [];
  const niceToHave = [];

  // Determine Fix First items (High Impact, Fast execution)
  if (!profile.hasProfileReadme) {
    fixFirst.push({
      id: 'fix-profile-readme',
      title: `Create a Profile README (${profile.username}/${profile.username})`,
      category: 'Profile',
      estimatedTime: '20 mins',
      potentialGain: 4,
      action: 'Create a repository named exactly after your username with a README.md introducing yourself, your tech stack, and links to your top projects.',
      template: `### Hi there, I'm ${profile.name || profile.username} 👋\n\n- 🔭 Currently building: ...\n- 🌱 Learning: ...\n- 💬 Ask me about: ...\n- 📫 Reach me: ...`,
    });
  }

  if (stats.repos_without_description > 0) {
    fixFirst.push({
      id: 'fix-descriptions',
      title: `Add One-Sentence Descriptions to Your Top Repos`,
      category: 'Repositories',
      estimatedTime: '10 mins',
      potentialGain: 6,
      action: 'Click the gear icon on your repositories to add a crisp description answering: "What does this do and what stack does it use?"',
      template: 'e.g. "Real-time collaborative markdown editor built with React, Node.js, and WebSockets."',
    });
  }

  if (stats.repos_without_readme > 0) {
    fixFirst.push({
      id: 'fix-readmes',
      title: 'Draft Standard READMEs for Top 3 Featured Projects',
      category: 'Documentation',
      estimatedTime: '45 mins',
      potentialGain: 7,
      action: 'Add a clean README to each core repo including: Problem Statement, Tech Stack, Features, How to Run Locally, and Screenshots.',
    });
  }

  // Determine Fix Next items (Medium effort, High Recruiter payoff)
  if (stats.repos_with_homepage === 0) {
    fixNext.push({
      id: 'fix-live-demos',
      title: 'Deploy Live Demos & Add URL to Repo Header',
      category: 'Recruiter Readiness',
      estimatedTime: '30 mins',
      potentialGain: 4,
      action: 'Deploy frontend/full-stack projects to free tiers (Vercel, Render, GitHub Pages) and put the live URL in the repo About section.',
    });
  }

  fixNext.push({
    id: 'fix-pinning',
    title: 'Pin Your Top 4-6 Strongest Repositories',
    category: 'Recruiter Readiness',
    estimatedTime: '5 mins',
    potentialGain: 3,
    action: 'Customize your pinned repositories on your profile so recruiters see your proudest original work instead of random tutorial repos.',
  });

  if (stats.repos_with_topics < 3) {
    fixNext.push({
      id: 'fix-topics',
      title: 'Tag Repositories with Relevant Topic Tags',
      category: 'Discovery',
      estimatedTime: '10 mins',
      potentialGain: 2,
      action: 'Add 3-5 GitHub topics per project (e.g., #react, #typescript, #fullstack, #hackathon) for recruiter keyword discovery.',
    });
  }

  // Determine Nice to Have items (Polish & Longevity)
  niceToHave.push({
    id: 'fix-licenses',
    title: 'Add Open Source Licenses (MIT or Apache 2.0)',
    category: 'Documentation',
    estimatedTime: '5 mins',
    potentialGain: 2,
    action: 'Add an MIT license to your public repos to show professional legal hygiene and open-source readiness.',
  });

  if (stats.forked_repos_count > 3) {
    niceToHave.push({
      id: 'fix-archive-forks',
      title: 'Archive or Hide Dormant Forks',
      category: 'Hygiene',
      estimatedTime: '15 mins',
      potentialGain: 2,
      action: 'Make untouched forks private or archive them so your profile highlights code you authored.',
    });
  }

  niceToHave.push({
    id: 'fix-demo-visuals',
    title: 'Add UI Screenshots or Demo GIFs into READMEs',
    category: 'Visual Polish',
    estimatedTime: '20 mins',
    potentialGain: 3,
    action: 'A picture is worth 100 lines of code. Embed a short video preview or screenshot at the top of your top repositories.',
  });

  // Calculate potential score improvement
  const totalPotentialGains = [...fixFirst, ...fixNext, ...niceToHave].reduce((acc, item) => acc + item.potentialGain, 0);
  const simulatedScore = Math.min(98, currentScore + totalPotentialGains);

  // 7-Day Improvement Plan (Section 9 & 10 of PRD)
  const sevenDayPlan = [
    {
      day: 1,
      title: 'Profile Face-Lift & Contact Channels',
      time: '30 mins',
      objective: 'Make your profile look active, professional, and accessible in 10 seconds.',
      tasks: [
        'Write a clear, role-focused bio (e.g. "Full-Stack Engineer | React, Node.js, Python | Building X")',
        'Add your portfolio link, LinkedIn URL, and primary email',
        'Verify your profile photo is professional and welcoming',
      ],
    },
    {
      day: 2,
      title: 'The Profile README Digital Resume',
      time: '45 mins',
      objective: 'Create a custom github.com/username/username repository.',
      tasks: [
        'Initialize your special profile README repository',
        'Add a brief elevator pitch and your core technology icons',
        'Highlight your top 2 favorite projects with direct live links',
      ],
    },
    {
      day: 3,
      title: 'The Top 3 Showcase READMEs',
      time: '60 mins',
      objective: 'Upgrade your 3 best repositories so any recruiter can understand them in 15 seconds.',
      tasks: [
        'Write clear descriptions for the 3 top projects',
        'Include: What it solves, Tech Stack used, and Local Setup instructions',
        'Add an MIT license to all 3 repositories',
      ],
    },
    {
      day: 4,
      title: 'Visual Proof & Live Deployments',
      time: '45 mins',
      objective: 'Allow recruiters to test your apps without touching the command line.',
      tasks: [
        'Deploy your top web projects to Vercel, Netlify, or Render',
        'Paste the deployed URL into the GitHub repository "About" section',
        'Take a screenshot or screen recording GIF and embed it at the top of the README',
      ],
    },
    {
      day: 5,
      title: 'Curation & Junk Repo Clean-Up',
      time: '25 mins',
      objective: 'Eliminate clutter so recruiters only see your best work.',
      tasks: [
        'Pin your 4 to 6 best repositories to your profile front page',
        'Archive or make private ancient school homework files and empty "test123" repos',
        'Ensure fork repositories are clearly distinguished from your original code',
      ],
    },
    {
      day: 6,
      title: 'GitHub SEO & Topic Tags',
      time: '20 mins',
      objective: 'Optimize your repositories for search and keyword indexing.',
      tasks: [
        'Add 4-5 relevant topics to every public repo (#react, #tailwindcss, #api, etc.)',
        'Check code cleanliness and remove any stray API keys, console.logs, or commented-out blocks',
      ],
    },
    {
      day: 7,
      title: 'The Recruiter 30-Second Simulation',
      time: '15 mins',
      objective: 'Do a self-audit from an interviewer perspective.',
      tasks: [
        'Open your GitHub in an Incognito window',
        'Time yourself for 30 seconds: Is it immediately obvious what you build?',
        'Re-run GitHub Roast & Rescue to verify your new score!',
      ],
    },
  ];

  return {
    currentScore,
    simulatedScore,
    potentialGain: simulatedScore - currentScore,
    fixFirst,
    fixNext,
    niceToHave,
    sevenDayPlan,
  };
}
