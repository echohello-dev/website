/**
 * Fetch and transform GitHub repositories into project data
 * Requires a GitHub personal access token for higher rate limits
 */

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  resetTime: Date;
  percentRemaining: number;
  isLimited: boolean;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
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
  open_issues_count: number;
  forks_count: number;
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
  commitActivity?: { week: number; commits: number }[]; // Weekly commit data for last year
  totalCommits?: number;
  contributors?: number;
  openIssues?: number;
  forks?: number;
}

/**
 * Fetch GitHub API rate limit information
 */
async function getRateLimitInfo(token?: string): Promise<RateLimitInfo> {
  try {
    const { execSync } = await import("child_process");
    const env = { ...process.env, GH_TOKEN: token || process.env.GITHUB_TOKEN };

    // Fetch rate limit info from GitHub API
    const result = execSync(
      `gh api rate_limit --jq '.resources.core | {limit, remaining, reset}'`,
      { encoding: "utf-8", env, stdio: ["pipe", "pipe", "ignore"] }
    );

    const data = JSON.parse(result);
    const resetTime = new Date(data.reset * 1000);
    const percentRemaining = (data.remaining / data.limit) * 100;
    const isLimited = data.remaining <= 0 || percentRemaining < 5;

    return {
      limit: data.limit,
      remaining: data.remaining,
      reset: data.reset,
      resetTime,
      percentRemaining,
      isLimited,
    };
  } catch (error) {
    // Return default values if we can't fetch rate limit info
    console.warn({
      timestamp: new Date().toISOString(),
      operation: "get_rate_limit_info",
      outcome: "error",
      error_message:
        error instanceof Error ? error.message : "Failed to fetch rate limit",
    });

    return {
      limit: 60,
      remaining: 60,
      reset: Math.floor(Date.now() / 1000) + 3600,
      resetTime: new Date(Date.now() + 3600000),
      percentRemaining: 100,
      isLimited: false,
    };
  }
}

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Throttle API calls to avoid rate limiting
 * Adds delay between sequential requests
 */
async function throttledApiCall<T>(
  operation: string,
  fn: () => Promise<T>,
  delayMs: number = 100
): Promise<T> {
  try {
    const result = await fn();
    await sleep(delayMs);
    return result;
  } catch (error) {
    throw error;
  }
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
 * Fetch commit activity for a repository (last 52 weeks) using gh CLI
 */
async function fetchCommitActivity(
  owner: string,
  repo: string,
  token?: string
): Promise<{ week: number; commits: number }[]> {
  const startTime = Date.now();
  const event = {
    timestamp: new Date().toISOString(),
    operation: "fetch_commit_activity",
    owner,
    repo,
    service: "github-projects",
  };

  try {
    const { execSync } = await import("child_process");

    // Use gh CLI to get commit activity stats
    const result = execSync(
      `gh api repos/${owner}/${repo}/stats/commit_activity --cache 1h`,
      {
        encoding: "utf-8",
        env: { ...process.env, GH_TOKEN: token || process.env.GITHUB_TOKEN },
      }
    );

    // Validate that result is not empty before parsing
    if (!result || !result.trim()) {
      console.info({
        ...event,
        outcome: "empty_response",
        duration_ms: Date.now() - startTime,
        weeks_returned: 0,
      });
      return [];
    }

    const data = JSON.parse(result);

    // Handle non-array responses (GitHub returns object with status/message on error)
    if (!Array.isArray(data)) {
      console.warn({
        ...event,
        outcome: "empty_activity",
        duration_ms: Date.now() - startTime,
        reason: "Repository has no commit activity or stats not yet computed",
        response_type: typeof data,
      });
      return [];
    }

    // Filter out entries with zero commits
    const commitActivity = data
      .filter((item) => item.total > 0)
      .map((item) => ({
        week: item.week * 1000, // Convert to milliseconds
        commits: item.total,
      }));

    console.info({
      ...event,
      outcome: "success",
      duration_ms: Date.now() - startTime,
      weeks_returned: commitActivity.length,
      total_commits: commitActivity.reduce((sum, w) => sum + w.commits, 0),
    });

    return commitActivity;
  } catch (error) {
    const errorCode =
      error instanceof Error && "code" in error
        ? (error as Error & { code?: string }).code
        : undefined;
    console.warn({
      ...event,
      outcome: "error",
      duration_ms: Date.now() - startTime,
      error_type: error instanceof Error ? error.name : "UnknownError",
      error_message: error instanceof Error ? error.message : String(error),
      error_code: errorCode,
    });
    return [];
  }
}

/**
 * Fetch additional repository stats (contributors, total commits) using gh CLI
 */
async function fetchRepoStats(
  owner: string,
  repo: string,
  token?: string
): Promise<{ contributors: number; totalCommits: number }> {
  const startTime = Date.now();
  const event = {
    timestamp: new Date().toISOString(),
    operation: "fetch_repo_stats",
    owner,
    repo,
    service: "github-projects",
  };

  try {
    const { execSync } = await import("child_process");
    const env = { ...process.env, GH_TOKEN: token || process.env.GITHUB_TOKEN };

    // Fetch contributors count using gh CLI
    let contributors = 0;
    let contributorsAttempts = 0;
    try {
      contributorsAttempts++;
      const contributorsResult = execSync(
        `gh api repos/${owner}/${repo}/contributors?per_page=1 --paginate --jq 'length'`,
        { encoding: "utf-8", env, stdio: ["pipe", "pipe", "ignore"] }
      );
      contributors = parseInt(contributorsResult.trim()) || 0;
    } catch {
      // If pagination fails, try getting the array directly
      try {
        contributorsAttempts++;
        const contributorsResult = execSync(
          `gh api repos/${owner}/${repo}/contributors --jq 'length'`,
          { encoding: "utf-8", env, stdio: ["pipe", "pipe", "ignore"] }
        );
        contributors = parseInt(contributorsResult.trim()) || 0;
      } catch {}
    }

    // Fetch total commits using gh CLI
    let totalCommits = 0;
    let commitsAttempts = 0;
    try {
      commitsAttempts++;
      const commitsResult = execSync(
        `gh api repos/${owner}/${repo}/commits?per_page=1 -i | grep -i '^link:' | grep -o 'page=[0-9]*' | tail -1 | cut -d= -f2`,
        { encoding: "utf-8", env, stdio: ["pipe", "pipe", "ignore"] }
      );
      totalCommits = parseInt(commitsResult.trim()) || 0;
    } catch {}

    console.info({
      ...event,
      outcome: "success",
      duration_ms: Date.now() - startTime,
      contributors,
      total_commits: totalCommits,
      contributors_fetch_attempts: contributorsAttempts,
      commits_fetch_attempts: commitsAttempts,
    });

    return { contributors, totalCommits };
  } catch (error) {
    const errorCode =
      error instanceof Error && "code" in error
        ? (error as Error & { code?: string }).code
        : undefined;
    console.warn({
      ...event,
      outcome: "error",
      duration_ms: Date.now() - startTime,
      error_type: error instanceof Error ? error.name : "UnknownError",
      error_message: error instanceof Error ? error.message : String(error),
      error_code: errorCode,
      contributors: 0,
      total_commits: 0,
    });
    return { contributors: 0, totalCommits: 0 };
  }
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
    openIssues: repo.open_issues_count,
    forks: repo.forks_count,
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
  const startTime = Date.now();
  const token = options?.token || process.env.GITHUB_TOKEN;
  const perPage = options?.perPage || 100;
  const filterByStars = options?.filterByStars || 0;
  const sort = options?.sort || "stars";

  const event = {
    timestamp: new Date().toISOString(),
    operation: "fetch_github_projects",
    owner,
    service: "github-projects",
    config: {
      per_page: perPage,
      filter_by_stars: filterByStars,
      sort,
      has_token: !!token,
    },
  };

  try {
    // Check rate limits before making API calls
    const rateLimitInfo = await getRateLimitInfo(token);

    console.info({
      ...event,
      operation: "check_rate_limit",
      rate_limit_info: {
        limit: rateLimitInfo.limit,
        remaining: rateLimitInfo.remaining,
        percent_remaining: rateLimitInfo.percentRemaining.toFixed(2),
        reset_time: rateLimitInfo.resetTime.toISOString(),
        is_limited: rateLimitInfo.isLimited,
      },
    });

    // If rate limit is nearly exhausted, fail gracefully
    if (rateLimitInfo.isLimited) {
      console.warn({
        ...event,
        outcome: "rate_limit_exceeded",
        duration_ms: Date.now() - startTime,
        rate_limit_info: {
          limit: rateLimitInfo.limit,
          remaining: rateLimitInfo.remaining,
          reset_time: rateLimitInfo.resetTime.toISOString(),
        },
        message:
          "GitHub API rate limit nearly exhausted. Falling back to cached data.",
      });
      return [];
    }

    const { execSync } = await import("child_process");
    const env = { ...process.env, GH_TOKEN: token };

    // Use gh CLI to fetch repositories
    const result = execSync(
      `gh api users/${owner}/repos --paginate -X GET -f per_page=${perPage} -f sort=${sort} -f direction=desc -f type=public`,
      { encoding: "utf-8", env }
    );

    const repos: GitHubRepo[] = JSON.parse(result);

    const filteredRepos = repos.filter(
      (repo) => !repo.archived && repo.stargazers_count >= filterByStars
    );

    // Transform repos and enrich with additional data
    const enrichedProjects = await Promise.all(
      filteredRepos.map(async (repo) => {
        const baseProject = transformRepo(repo);

        // Parse owner and repo name from full_name
        const [repoOwner, repoName] = repo.full_name.split("/");

        // Fetch commit activity and stats with throttling
        const commitActivity = await throttledApiCall(
          `commit_activity:${repoOwner}/${repoName}`,
          () => fetchCommitActivity(repoOwner, repoName, token),
          150
        );

        // Add delay between stats requests to throttle API calls
        await sleep(150);

        const stats = await throttledApiCall(
          `repo_stats:${repoOwner}/${repoName}`,
          () => fetchRepoStats(repoOwner, repoName, token),
          150
        );

        return {
          ...baseProject,
          commitActivity:
            commitActivity.length > 0 ? commitActivity : undefined,
          totalCommits: stats.totalCommits > 0 ? stats.totalCommits : undefined,
          contributors: stats.contributors > 0 ? stats.contributors : undefined,
        };
      })
    );

    const sortedProjects = enrichedProjects.sort((a, b) => b.stars - a.stars);

    // Check rate limits after API calls
    const finalRateLimitInfo = await getRateLimitInfo(token);

    console.info({
      ...event,
      outcome: "success",
      duration_ms: Date.now() - startTime,
      repos_fetched: repos.length,
      repos_filtered: filteredRepos.length,
      repos_archived: repos.filter((r) => r.archived).length,
      repos_below_star_threshold: repos.filter(
        (r) => r.stargazers_count < filterByStars
      ).length,
      projects_enriched: sortedProjects.length,
      total_stars: sortedProjects.reduce((sum, p) => sum + p.stars, 0),
      languages: [
        ...new Set(sortedProjects.map((p) => p.language).filter(Boolean)),
      ],
      rate_limit_info: {
        initial_remaining: rateLimitInfo.remaining,
        final_remaining: finalRateLimitInfo.remaining,
        calls_made: rateLimitInfo.remaining - finalRateLimitInfo.remaining,
        reset_time: finalRateLimitInfo.resetTime.toISOString(),
      },
    });

    return sortedProjects;
  } catch (error) {
    const errorCode =
      error instanceof Error && "code" in error
        ? (error as Error & { code?: string }).code
        : undefined;
    console.error({
      ...event,
      outcome: "error",
      duration_ms: Date.now() - startTime,
      error_type: error instanceof Error ? error.name : "UnknownError",
      error_message: error instanceof Error ? error.message : String(error),
      error_code: errorCode,
      error_stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

/**
 * Fetch repositories from multiple organizations/users
 * Processes sequentially to avoid rate limiting
 */
export async function fetchMultipleGitHubProjects(
  owners: string[],
  options?: {
    token?: string;
    perPage?: number;
    filterByStars?: number;
  }
): Promise<EnrichedProject[]> {
  const startTime = Date.now();
  const token = options?.token || process.env.GITHUB_TOKEN;

  const event = {
    timestamp: new Date().toISOString(),
    operation: "fetch_multiple_github_projects",
    owners,
    owners_count: owners.length,
    service: "github-projects",
    config: {
      per_page: options?.perPage || 100,
      filter_by_stars: options?.filterByStars || 0,
      has_token: !!token,
      processing_mode: "sequential",
    },
  };

  // Check rate limits before processing multiple owners
  const initialRateLimitInfo = await getRateLimitInfo(token);
  console.info({
    ...event,
    operation: "check_initial_rate_limit",
    rate_limit_info: {
      limit: initialRateLimitInfo.limit,
      remaining: initialRateLimitInfo.remaining,
      percent_remaining: initialRateLimitInfo.percentRemaining.toFixed(2),
    },
  });

  const results = [];

  // Process owners sequentially to avoid rate limiting
  for (const owner of owners) {
    try {
      console.info({
        timestamp: new Date().toISOString(),
        operation: "fetch_github_projects_single_owner",
        owner,
        message: "Processing owner sequentially",
      });

      const projects = await fetchGitHubProjects(owner, {
        ...options,
        sort: "updated",
        token,
      });

      results.push({ owner, projects, success: true });

      // Add delay between owner requests to throttle
      if (owner !== owners[owners.length - 1]) {
        await sleep(1000); // 1 second delay between owner requests
      }
    } catch (error) {
      const errorCode =
        error instanceof Error && "code" in error
          ? (error as Error & { code?: string }).code
          : undefined;

      console.warn({
        timestamp: new Date().toISOString(),
        operation: "fetch_github_projects_single_owner",
        owner,
        outcome: "error",
        error_type: error instanceof Error ? error.name : "UnknownError",
        error_message: error instanceof Error ? error.message : String(error),
        error_code: errorCode,
      });

      results.push({ owner, projects: [], success: false });
    }
  }

  const allProjects = results.flatMap((r) => r.projects);
  const sortedProjects = allProjects.sort((a, b) => b.stars - a.stars);

  // Check final rate limits
  const finalRateLimitInfo = await getRateLimitInfo(token);

  console.info({
    ...event,
    outcome: "success",
    duration_ms: Date.now() - startTime,
    owners_succeeded: results.filter((r) => r.success).length,
    owners_failed: results.filter((r) => !r.success).length,
    failed_owners: results.filter((r) => !r.success).map((r) => r.owner),
    total_projects: sortedProjects.length,
    total_stars: sortedProjects.reduce((sum, p) => sum + p.stars, 0),
    projects_per_owner: results.map((r) => ({
      owner: r.owner,
      count: r.projects.length,
      success: r.success,
    })),
    rate_limit_info: {
      initial_remaining: initialRateLimitInfo.remaining,
      final_remaining: finalRateLimitInfo.remaining,
      total_calls_made:
        initialRateLimitInfo.remaining - finalRateLimitInfo.remaining,
      reset_time: finalRateLimitInfo.resetTime.toISOString(),
    },
  });

  return sortedProjects;
}
