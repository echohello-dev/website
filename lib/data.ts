import { fetchGitHubProjects } from "./github-projects";

export interface Project {
  title: string;
  description: string;
  websiteUrl?: string;
  githubUrl?: string;
  tags?: string[];
  stars?: number;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastActivity?: Date;
  ageInDays?: number;
  contributionActivityLevel?: string;
  commitActivity?: { week: number; commits: number }[];
  totalCommits?: number;
  contributors?: number;
  openIssues?: number;
  forks?: number;
}

// Hardcoded featured projects (used as fallback or to showcase specific projects)
export const hardcodedProjects: Project[] = [
  {
    title: "Backstage",
    description:
      "A production-ready Backstage in a showcase emphasizing developer portal capabilities and enterprise features.",
    githubUrl: "https://github.com/echohello-dev/backstage",
    tags: ["TypeScript", "backstage", "developer-portal"],
    stars: 1,
    createdAt: new Date("2024-05-04"),
    updatedAt: new Date("2024-05-04"),
    lastActivity: new Date("2024-05-04"),
    ageInDays: Math.floor(
      (Date.now() - new Date("2024-05-04").getTime()) / (1000 * 60 * 60 * 24)
    ),
    totalCommits: 314,
    contributors: 5,
  },
  {
    title: "Website",
    description: "The website for echoHello",
    websiteUrl: "https://echohello.dev",
    githubUrl: "https://github.com/echohello-dev/website",
    tags: ["TypeScript", "Next.js"],
    stars: 0,
    createdAt: new Date("2025-12-28"),
    updatedAt: new Date("2025-12-28"),
    lastActivity: new Date("2025-12-28"),
    ageInDays: Math.floor(
      (Date.now() - new Date("2025-12-28").getTime()) / (1000 * 60 * 60 * 24)
    ),
    totalCommits: 37,
    contributors: 2,
    commitActivity: [
      { week: 1704067200000, commits: 5 },
      { week: 1704672000000, commits: 12 },
      { week: 1705276800000, commits: 20 },
    ],
  },
  {
    title: "Betterfit",
    description: "A workout tracker with auto-tracking capability",
    githubUrl: "https://github.com/echohello-dev/betterfit",
    tags: ["Swift"],
    stars: 0,
    createdAt: new Date("2025-07-12"),
    updatedAt: new Date("2025-07-12"),
    lastActivity: new Date("2025-07-12"),
    ageInDays: Math.floor(
      (Date.now() - new Date("2025-07-12").getTime()) / (1000 * 60 * 60 * 24)
    ),
    totalCommits: 78,
    contributors: 2,
  },
  {
    title: "Yell",
    description: "A Kahoot / Menti alternative to live quizzes with a spin!",
    githubUrl: "https://github.com/echohello-dev/yell",
    tags: ["TypeScript"],
    stars: 0,
    createdAt: new Date("2025-07-12"),
    updatedAt: new Date("2025-07-12"),
    lastActivity: new Date("2025-07-12"),
    ageInDays: Math.floor(
      (Date.now() - new Date("2025-07-12").getTime()) / (1000 * 60 * 60 * 24)
    ),
    totalCommits: 40,
    contributors: 2,
  },
  {
    title: "Wingman",
    description: "A Slackbot that can help enhance your channel",
    githubUrl: "https://github.com/echohello-dev/wingman",
    tags: [],
    stars: 0,
    createdAt: new Date("2025-07-12"),
    updatedAt: new Date("2025-07-12"),
    lastActivity: new Date("2025-07-12"),
    ageInDays: Math.floor(
      (Date.now() - new Date("2025-07-12").getTime()) / (1000 * 60 * 60 * 24)
    ),
    totalCommits: 1,
    contributors: 1,
  },
  {
    title: "Transcribe Me",
    description: "The transcriber that uses Anthropic and OpenAI.",
    githubUrl: "https://github.com/echohello-dev/transcribe-yt",
    tags: ["Python", "chatgpt", "claude", "openai"],
    stars: 6,
    createdAt: new Date("2024-08-04"),
    updatedAt: new Date("2024-08-04"),
    lastActivity: new Date("2024-08-04"),
    ageInDays: Math.floor(
      (Date.now() - new Date("2024-08-04").getTime()) / (1000 * 60 * 60 * 24)
    ),
    totalCommits: 258,
    contributors: 2,
  },
];

/**
 * Calculate activity score for sorting
 * Higher score = more recent activity
 */
function getActivityScore(project: Project): number {
  if (!project.lastActivity) return 0;

  // Ensure lastActivity is a Date object
  const activityDate =
    project.lastActivity instanceof Date
      ? project.lastActivity
      : new Date(project.lastActivity);

  const daysAgo = Math.floor(
    (Date.now() - activityDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Activity decay: very recent = highest score
  if (daysAgo <= 7) return 1000;
  if (daysAgo <= 30) return 500;
  if (daysAgo <= 90) return 250;
  if (daysAgo <= 180) return 100;
  return 10;
}

/**
 * Sort projects by activity and stars
 * Primary: Activity score
 * Secondary: Star count
 */
function sortProjectsByActivityAndStars(projects: Project[]): Project[] {
  return projects.sort((a, b) => {
    const activityScoreA = getActivityScore(a);
    const activityScoreB = getActivityScore(b);

    // First compare by activity
    if (activityScoreA !== activityScoreB) {
      return activityScoreB - activityScoreA;
    }

    // Then by stars
    const starsA = a.stars || 0;
    const starsB = b.stars || 0;
    return starsB - starsA;
  });
}

/**
 * Fetch projects from GitHub API with timeout and fallback
 * Uses hardcoded projects in development to avoid blocking dev server startup
 */
async function fetchGitHubProjectsWithTimeout(
  timeoutMs: number = 5000
): Promise<Project[]> {
  const startTime = Date.now();
  const event = {
    timestamp: new Date().toISOString(),
    operation: "fetch_github_projects_with_timeout",
    service: "data-layer",
    owner: "echohello-dev",
    timeout_ms: timeoutMs,
  };

  try {
    console.info({
      ...event,
      outcome: "starting",
      message: "Starting GitHub projects fetch...",
    });

    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `GitHub API fetch timeout after ${timeoutMs}ms. Using hardcoded projects.`
            )
          ),
        timeoutMs
      )
    );

    // Race between actual fetch and timeout
    const githubProjects = await Promise.race([
      fetchGitHubProjects("echohello-dev", {
        token: process.env.GITHUB_TOKEN,
        perPage: 50,
        filterByStars: 0,
        sort: "updated",
      }),
      timeoutPromise,
    ]);

    if (githubProjects.length > 0) {
      console.info({
        ...event,
        outcome: "fetched",
        duration_ms: Date.now() - startTime,
        projects_count: githubProjects.length,
        message: `Fetched ${githubProjects.length} projects from GitHub API`,
      });

      const sortedProjects = sortProjectsByActivityAndStars(githubProjects);

      console.info({
        ...event,
        outcome: "success",
        source: "github_api",
        duration_ms: Date.now() - startTime,
        projects_count: sortedProjects.length,
        message: "Successfully sorted projects by activity and stars",
      });

      return sortedProjects;
    }

    console.info({
      ...event,
      outcome: "empty_response",
      source: "hardcoded_fallback",
      duration_ms: Date.now() - startTime,
      message: "GitHub API returned no projects, using hardcoded fallback",
    });

    return hardcodedProjects;
  } catch (error) {
    console.warn({
      ...event,
      outcome: "error",
      source: "hardcoded_fallback",
      duration_ms: Date.now() - startTime,
      error_message: error instanceof Error ? error.message : String(error),
      message: `Error fetching GitHub projects, falling back to hardcoded list`,
    });

    return hardcodedProjects;
  }
}

/**
 * Get projects from cache or GitHub API
 * Can fetch fresh GitHub data with proper timeout
 * Set USE_GITHUB_DATA=true to fetch real data in development
 */
export async function getProjects(): Promise<Project[]> {
  const env = process.env.NODE_ENV || "development";
  const useGitHubData = process.env.USE_GITHUB_DATA === "true";

  console.info({
    timestamp: new Date().toISOString(),
    operation: "get_projects_start",
    environment: env,
    use_github_data: useGitHubData,
    message: `Getting projects in ${env} environment... (USE_GITHUB_DATA=${useGitHubData})`,
  });

  // In development, use hardcoded projects unless USE_GITHUB_DATA is set
  if (env === "development" && !useGitHubData) {
    console.info({
      timestamp: new Date().toISOString(),
      operation: "get_projects_dev",
      environment: env,
      projects_count: hardcodedProjects.length,
      message: `Returning ${hardcodedProjects.length} hardcoded projects for dev server. Set USE_GITHUB_DATA=true to fetch real data.`,
    });

    // Non-blocking: attempt GitHub fetch in background (fire and forget logging)
    fetchGitHubProjectsWithTimeout(3000).catch(() => {
      /* Ignore failures during dev */
    });

    return hardcodedProjects;
  }

  console.info({
    timestamp: new Date().toISOString(),
    operation: "get_projects_production",
    environment: env,
    message: "Fetching fresh projects from GitHub API for production build...",
  });

  // In production/build, try to fetch GitHub projects with timeout
  return fetchGitHubProjectsWithTimeout(10000);
}

// Export hardcoded projects as the default for backward compatibility
export const projects: Project[] = hardcodedProjects;
