/**
 * Fetch and transform GitHub repositories into project data
 * Requires a GitHub personal access token for higher rate limits
 */

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  archived: boolean;
}

export interface EnrichedProject {
  title: string;
  description: string;
  websiteUrl?: string;
  githubUrl: string;
  tags?: string[];
  stars: number;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
  ageInDays: number;
  contributionActivityLevel: string;
}

/**
 * Calculate contribution activity level based on last activity
 */
function getActivityLevel(lastActivityDate: Date): string {
  const daysAgo = Math.floor(
    (Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysAgo <= 7) return "Very Active";
  if (daysAgo <= 30) return "Active";
  if (daysAgo <= 90) return "Moderately Active";
  if (daysAgo <= 180) return "Somewhat Active";
  return "Inactive";
}

/**
 * Transform GitHub API response into enriched project data
 */
function transformRepo(repo: GitHubRepo): EnrichedProject {
  const createdAt = new Date(repo.created_at);
  const updatedAt = new Date(repo.updated_at);
  const lastActivity = new Date(repo.pushed_at || repo.updated_at);
  const ageInDays = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const tags: string[] = [];

  // Add language if available
  if (repo.language) {
    tags.push(repo.language);
  }

  // Add topics
  if (repo.topics && repo.topics.length > 0) {
    tags.push(...repo.topics);
  }

  return {
    title: repo.name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description:
      repo.description ||
      "A GitHub repository with useful functionality and active development.",
    websiteUrl: repo.homepage || undefined,
    githubUrl: repo.html_url,
    tags: tags.slice(0, 5), // Limit to 5 tags
    stars: repo.stargazers_count,
    language: repo.language || undefined,
    createdAt,
    updatedAt,
    lastActivity,
    ageInDays,
    contributionActivityLevel: getActivityLevel(lastActivity),
  };
}

/**
 * Fetch public repositories from a GitHub user or organization
 * @param owner - GitHub username or organization name
 * @param options - Configuration options
 */
export async function fetchGitHubProjects(
  owner: string,
  options?: {
    token?: string;
    perPage?: number;
    filterByStars?: number;
    sort?: "stars" | "updated" | "created";
  }
): Promise<EnrichedProject[]> {
  const token = options?.token || process.env.GITHUB_TOKEN;
  const perPage = options?.perPage || 100;
  const filterByStars = options?.filterByStars || 0;
  const sort = options?.sort || "stars";

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${owner}/repos?per_page=${perPage}&sort=${sort}&direction=desc&type=public`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos: GitHubRepo[] = await response.json();

    return repos
      .filter((repo) => !repo.archived && repo.stargazers_count >= filterByStars)
      .map(transformRepo)
      .sort((a, b) => b.stars - a.stars);
  } catch (error) {
    console.error("Error fetching GitHub projects:", error);
    throw error;
  }
}

/**
 * Fetch repositories from multiple organizations/users
 */
export async function fetchMultipleGitHubProjects(
  owners: string[],
  options?: {
    token?: string;
    perPage?: number;
    filterByStars?: number;
  }
): Promise<EnrichedProject[]> {
  const projects = await Promise.all(
    owners.map((owner) =>
      fetchGitHubProjects(owner, {
        ...options,
        sort: "updated",
      }).catch((error) => {
        console.warn(`Failed to fetch projects for ${owner}:`, error);
        return [];
      })
    )
  );

  // Flatten and sort by stars
  return projects
    .flat()
    .sort((a, b) => b.stars - a.stars);
}
