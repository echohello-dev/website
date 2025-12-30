import { fetchGitHubProjects, EnrichedProject } from "./github-projects";

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
    title: "COMPONENT LIBRARY",
    description:
      "A modern React component library with TypeScript support and Tailwind CSS styling. Built for speed and developer experience.",
    websiteUrl: "https://components.echohello.dev",
    githubUrl: "https://github.com/echohello-dev/components",
    tags: ["React", "TypeScript", "Tailwind"],
  },
  {
    title: "CLI TOOLKIT",
    description:
      "Command-line tools for streamlining development workflows. Includes scaffolding, testing utilities, and deployment helpers.",
    githubUrl: "https://github.com/echohello-dev/cli-tools",
    tags: ["Node.js", "CLI", "DevTools"],
  },
  {
    title: "AI CODE ASSISTANT",
    description:
      "An intelligent coding assistant that helps with code reviews, refactoring suggestions, and documentation generation.",
    websiteUrl: "https://ai.echohello.dev",
    githubUrl: "https://github.com/echohello-dev/ai-assistant",
    tags: ["AI", "Python", "OpenAI"],
  },
  {
    title: "CLOUD DASHBOARD",
    description:
      "Real-time monitoring and management dashboard for cloud infrastructure. Track metrics, logs, and deployments in one place.",
    websiteUrl: "https://cloud.echohello.dev",
    tags: ["Next.js", "AWS", "Monitoring"],
  },
  {
    title: "DESIGN SYSTEM",
    description:
      "Comprehensive design system with tokens, components, and documentation. Enables consistent UI across multiple products.",
    websiteUrl: "https://design.echohello.dev",
    githubUrl: "https://github.com/echohello-dev/design-system",
    tags: ["Design", "Figma", "React"],
  },
  {
    title: "DEPLOYMENT ENGINE",
    description:
      "Automated deployment pipeline with zero-downtime releases, rollback capabilities, and environment management.",
    githubUrl: "https://github.com/echohello-dev/deploy-engine",
    tags: ["DevOps", "Docker", "K8s"],
  },
];

/**
 * Calculate activity score for sorting
 * Higher score = more recent activity
 */
function getActivityScore(project: Project): number {
  if (!project.lastActivity) return 0;

  const daysAgo = Math.floor(
    (Date.now() - project.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
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
 * Fetch projects from GitHub API with fallback to hardcoded projects
 * This will be called at build time for static generation
 */
export async function getProjects(): Promise<Project[]> {
  const startTime = Date.now();
  const event = {
    timestamp: new Date().toISOString(),
    operation: "get_projects",
    service: "data-layer",
    owner: "echohello-dev",
    config: {
      per_page: 50,
      filter_by_stars: 0,
      sort: "updated",
      has_token: !!process.env.GITHUB_TOKEN,
    },
  };

  try {
    // Fetch projects from GitHub (echohello-dev organization)
    const githubProjects = await fetchGitHubProjects("echohello-dev", {
      token: process.env.GITHUB_TOKEN,
      perPage: 50,
      filterByStars: 0, // Include all projects
      sort: "updated",
    });

    // If we successfully fetched GitHub projects, sort and return them
    if (githubProjects.length > 0) {
      const sortedProjects = sortProjectsByActivityAndStars(githubProjects);

      console.info({
        ...event,
        outcome: "success",
        source: "github_api",
        duration_ms: Date.now() - startTime,
        projects_count: sortedProjects.length,
        projects_with_activity: sortedProjects.filter((p) => p.lastActivity)
          .length,
        total_stars: sortedProjects.reduce((sum, p) => sum + (p.stars || 0), 0),
        languages: [
          ...new Set(sortedProjects.map((p) => p.language).filter(Boolean)),
        ],
        most_recent_activity: sortedProjects[0]?.lastActivity?.toISOString(),
      });

      return sortedProjects;
    }

    console.info({
      ...event,
      outcome: "success",
      source: "hardcoded_fallback",
      reason: "empty_github_response",
      duration_ms: Date.now() - startTime,
      projects_count: hardcodedProjects.length,
    });

    return hardcodedProjects;
  } catch (error) {
    const errorCode =
      error instanceof Error && "code" in error
        ? (error as Error & { code?: string }).code
        : undefined;

    console.warn({
      ...event,
      outcome: "error",
      source: "hardcoded_fallback",
      duration_ms: Date.now() - startTime,
      error_type: error instanceof Error ? error.name : "UnknownError",
      error_message: error instanceof Error ? error.message : String(error),
      error_code: errorCode,
      projects_count: hardcodedProjects.length,
    });

    // Fallback to hardcoded projects
    return hardcodedProjects;
  }
}

// Export hardcoded projects as the default for backward compatibility
export const projects: Project[] = hardcodedProjects;
