import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, copyFileSync } from "fs";
import { join } from "path";

interface PackageInfo {
  name: string;
  version: string;
  description?: string;
  homepage: string;
  repository: string;
  author?: string;
}

interface MDXFile {
  slug: string;
  filename: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

interface Project {
  title: string;
  description: string;
  githubUrl?: string | null;
  websiteUrl?: string | null;
}

interface TechStack {
  framework: string;
  version: string;
  features: string[];
}

/**
 * Read package.json to extract site metadata
 */
function getPackageInfo(): PackageInfo {
  const pkgPath = join(process.cwd(), "package.json");
  
  if (!existsSync(pkgPath)) {
    return { 
      name: "website",
      version: "0.1.0",
      homepage: "https://echohello.dev",
      repository: "https://github.com/echohello-dev/website"
    };
  }
  
  const content = readFileSync(pkgPath, "utf-8");
  const pkg = JSON.parse(content);
  
  // Extract hostname from homepage URL
  const hostname = pkg.homepage ? new URL(pkg.homepage).hostname : "echohello.dev";
  
  return {
    name: pkg.name || "website",
    version: pkg.version || "0.1.0",
    description: pkg.description,
    homepage: pkg.homepage || `https://${hostname}`,
    repository: pkg.repository?.url?.replace(/^git\+/, "").replace(/\.git$/, "") || "https://github.com/echohello-dev/website",
    author: pkg.author,
  };
}

/**
 * Extract Next.js version and tech stack from package.json
 */
function getTechStack(): TechStack {
  const pkgPath = join(process.cwd(), "package.json");
  
  if (!existsSync(pkgPath)) {
    return {
      framework: "Next.js",
      version: "16",
      features: ["App Router", "Static Export", "TypeScript", "Tailwind CSS"]
    };
  }
  
  const content = readFileSync(pkgPath, "utf-8");
  const pkg = JSON.parse(content);
  
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  // Extract versions
  const nextVersion = deps.next?.match(/\d+/)?.[0] || "16";
  const tailwindVersion = deps.tailwindcss?.match(/\d+/)?.[0] || "4";
  
  const features = [];
  if (deps.next) features.push("App Router with static export");
  if (deps.contentlayer2 || deps["next-contentlayer2"]) features.push("Contentlayer2 + MDX for content");
  if (deps.typescript) features.push("TypeScript (strict mode)");
  if (deps.tailwindcss) features.push(`Tailwind CSS ${tailwindVersion} with CSS variables`);
  if (deps["next-themes"]) features.push("next-themes for dark/light mode");
  
  return {
    framework: "Next.js",
    version: nextVersion,
    features
  };
}

/**
 * Parse MDX frontmatter from file content
 */
function parseMdxFrontmatter(content: string): Record<string, string> {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return {};
  
  const frontmatter: Record<string, string> = {};
  const lines = match[1].split("\n");
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      const value = valueParts.join(":").trim();
      frontmatter[key.trim()] = value;
    }
  }
  
  return frontmatter;
}

/**
 * Read all MDX files from a directory
 */
function readMdxFiles(dir: string): MDXFile[] {
  const files: MDXFile[] = [];
  const dirPath = join(process.cwd(), "content", dir);
  
  if (!existsSync(dirPath)) {
    return files;
  }
  
  const entries = readdirSync(dirPath);
  
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);
    
    if (stat.isFile() && entry.endsWith(".mdx")) {
      const content = readFileSync(fullPath, "utf-8");
      const frontmatter = parseMdxFrontmatter(content);
      const slug = entry.replace(/\.mdx$/, "");
      
      files.push({
        slug,
        filename: entry,
        ...frontmatter,
      });
    }
  }
  
  return files;
}

/**
 * Get homepage URL from a package's package.json
 */
function getPackageHomepage(packageName: string): string | null {
  try {
    const pkgJsonPath = join(process.cwd(), "node_modules", packageName, "package.json");
    if (existsSync(pkgJsonPath)) {
      const content = readFileSync(pkgJsonPath, "utf-8");
      const pkg = JSON.parse(content);
      return pkg.homepage || pkg.repository?.url?.replace(/^git\+/, "").replace(/\.git$/, "") || null;
    }
  } catch (error) {
    // Silently fail if package.json can't be read
  }
  return null;
}

/**
 * Get description for a package
 */
function getPackageDescription(packageName: string): string {
  try {
    const pkgJsonPath = join(process.cwd(), "node_modules", packageName, "package.json");
    if (existsSync(pkgJsonPath)) {
      const content = readFileSync(pkgJsonPath, "utf-8");
      const pkg = JSON.parse(content);
      return pkg.description || "";
    }
  } catch (error) {
    // Silently fail
  }
  return "";
}
function getProjectsFromData(): Project[] {
  const dataPath = join(process.cwd(), "lib", "data.ts");
  
  if (!existsSync(dataPath)) {
    return [];
  }
  
  const content = readFileSync(dataPath, "utf-8");
  
  // Extract hardcoded projects array
  const projectsMatch = content.match(/export const hardcodedProjects: Project\[\] = \[([\s\S]*?)\];/);
  
  if (!projectsMatch) {
    return [];
  }
  
  // Parse basic project info (title, description, githubUrl)
  const projects: Project[] = [];
  const projectBlocks = projectsMatch[1].split(/\},\s*\{/);
  
  for (const block of projectBlocks) {
    const titleMatch = block.match(/title:\s*"([^"]+)"/);
    const descMatch = block.match(/description:\s*"([^"]+)"/);
    const githubMatch = block.match(/githubUrl:\s*"([^"]+)"/);
    const websiteMatch = block.match(/websiteUrl:\s*"([^"]+)"/);
    
    if (titleMatch && descMatch) {
      projects.push({
        title: titleMatch[1],
        description: descMatch[1],
        githubUrl: githubMatch ? githubMatch[1] : null,
        websiteUrl: websiteMatch ? websiteMatch[1] : null,
      });
    }
  }
  
  return projects;
}

function generateLlmsTxt(): string {
  const lines: string[] = [];
  const pkgInfo = getPackageInfo();
  const techStack = getTechStack();
  const SITE_URL = pkgInfo.homepage;
  const GITHUB_REPO = pkgInfo.repository;
  const SITE_NAME = new URL(SITE_URL).hostname;

  // Read dynamic content
  const pages = readMdxFiles("pages");
  const projectMdx = readMdxFiles("projects");
  const featuredProjects = getProjectsFromData();

  // H1: Project name (required) - dynamic from hostname
  lines.push(`# ${SITE_NAME}`);
  lines.push("");

  // Blockquote: Summary (recommended) - use package description if available
  const summary = pkgInfo.description || 
    "Portfolio and project showcase for echohello-dev. Features terminal-inspired design, developer tooling projects, and software consulting services.";
  lines.push(`> ${summary}`);
  lines.push("");

  // Context about the site - dynamic based on actual content
  const contentTypes = [];
  if (pages.length > 0) contentTypes.push("informational pages");
  if (featuredProjects.length > 0) contentTypes.push("project portfolio");
  if (projectMdx.length > 0) contentTypes.push("project documentation");
  
  const contentDescription = contentTypes.length > 0 
    ? `featuring ${contentTypes.join(", ")}`
    : "showcasing projects and services";

  lines.push(`${SITE_NAME} is a statically-generated ${techStack.framework} ${techStack.version} portfolio site ${contentDescription}.

Key technologies:
${techStack.features.map(f => `- ${f}`).join("\n")}`);
  lines.push("");

  // Main Pages section - only if pages exist
  if (pages.length > 0) {
    lines.push("## Pages");
    lines.push("");
    
    for (const page of pages) {
      const description = page.description || `Information about ${page.title}`;
      lines.push(`- [${page.title}](${SITE_URL}/${page.slug}/): ${description}`);
    }
    lines.push("");
  }

  // Featured Projects section - using actual project data
  if (featuredProjects.length > 0) {
    lines.push("## Featured Projects");
    lines.push("");
    
    // Limit to top 6 most relevant projects
    const topProjects = featuredProjects.slice(0, 6);
    
    for (const project of topProjects) {
      const url = project.websiteUrl || project.githubUrl || `${SITE_URL}/projects/`;
      lines.push(`- [${project.title}](${url}): ${project.description}`);
    }
    lines.push("");
  }

  // Documentation for developers
  lines.push("## Developer Documentation");
  lines.push("");
  
  // Check which files actually exist
  const docs = [];
  if (existsSync(join(process.cwd(), "AGENTS.md"))) {
    docs.push(`- [AI Agent Guide](${SITE_URL}/AGENTS.md): Comprehensive development guide with architecture patterns, content pipeline, workflows, and design system`);
  }
  if (existsSync(join(process.cwd(), "README.md"))) {
    docs.push(`- [README](${SITE_URL}/README.md): Quick start guide with setup instructions and development commands`);
  }
  if (existsSync(join(process.cwd(), "contentlayer.config.ts"))) {
    docs.push(`- [Contentlayer Config](${GITHUB_REPO}/blob/main/contentlayer.config.ts): Content schema definitions for Projects and Pages document types`);
  }
  if (existsSync(join(process.cwd(), "CONTRIBUTING.md"))) {
    docs.push(`- [Contributing Guide](${GITHUB_REPO}/blob/main/CONTRIBUTING.md): Guidelines for contributing to the project`);
  }
  
  docs.forEach(doc => lines.push(doc));
  lines.push("");

  // Technical Architecture - dynamic based on dependencies
  lines.push("## Technical Stack");
  lines.push("");
  
  const pkgPath = join(process.cwd(), "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  const techLinks = [];
  
  // Add each dependency with its actual homepage from package.json
  if (deps.next) {
    const url = getPackageHomepage("next") || "https://nextjs.org/";
    const desc = getPackageDescription("next") || "App Router with static site generation";
    techLinks.push(`- [${techStack.framework} ${techStack.version}](${url}): ${desc}`);
  }
  if (deps.contentlayer2 || deps["next-contentlayer2"]) {
    const url = getPackageHomepage("contentlayer2") || "https://github.com/contentlayerdev/contentlayer";
    const desc = getPackageDescription("contentlayer2") || "MDX content compilation with TypeScript type generation";
    techLinks.push(`- [Contentlayer2](${url}): ${desc}`);
  }
  if (deps.tailwindcss) {
    const tailwindVersion = deps.tailwindcss.match(/\d+/)?.[0] || "4";
    const url = getPackageHomepage("tailwindcss") || "https://tailwindcss.com/";
    const desc = getPackageDescription("tailwindcss") || "Utility-first CSS framework";
    techLinks.push(`- [Tailwind CSS ${tailwindVersion}](${url}): ${desc}`);
  }
  if (deps["next-themes"]) {
    const url = getPackageHomepage("next-themes") || "https://github.com/pacocoursey/next-themes";
    const desc = getPackageDescription("next-themes") || "Perfect dark mode in Next.js";
    techLinks.push(`- [next-themes](${url}): ${desc}`);
  }
  if (deps["framer-motion"]) {
    const url = getPackageHomepage("framer-motion") || "https://www.framer.com/motion/";
    const desc = getPackageDescription("framer-motion") || "Production-ready animation library for React";
    techLinks.push(`- [Framer Motion](${url}): ${desc}`);
  }
  if (deps.vitest) {
    const url = getPackageHomepage("vitest") || "https://vitest.dev/";
    const desc = getPackageDescription("vitest") || "Next generation testing framework";
    techLinks.push(`- [Vitest](${url}): ${desc}`);
  }
  
  lines.push(techLinks.join("\n"));
  lines.push("");

  // Optional section (detailed config files) - only include files that exist
  const optionalFiles = [];
  if (existsSync(join(process.cwd(), "package.json"))) {
    optionalFiles.push(`- [Package.json](${GITHUB_REPO}/blob/main/package.json): Full dependency list and build scripts`);
  }
  if (existsSync(join(process.cwd(), "tsconfig.json"))) {
    optionalFiles.push(`- [TypeScript Config](${GITHUB_REPO}/blob/main/tsconfig.json): Strict mode TypeScript configuration`);
  }
  if (existsSync(join(process.cwd(), "eslint.config.mjs"))) {
    optionalFiles.push(`- [ESLint Config](${GITHUB_REPO}/blob/main/eslint.config.mjs): Flat config with Next.js and Prettier rules`);
  }
  if (existsSync(join(process.cwd(), "next.config.ts")) || existsSync(join(process.cwd(), "next.config.js"))) {
    const configFile = existsSync(join(process.cwd(), "next.config.ts")) ? "next.config.ts" : "next.config.js";
    optionalFiles.push(`- [Next.js Config](${GITHUB_REPO}/blob/main/${configFile}): Static export with Contentlayer integration`);
  }
  if (existsSync(join(process.cwd(), "vitest.config.ts"))) {
    optionalFiles.push(`- [Vitest Config](${GITHUB_REPO}/blob/main/vitest.config.ts): Test configuration and setup`);
  }
  
  if (optionalFiles.length > 0) {
    lines.push("## Optional");
    lines.push("");
    lines.push(optionalFiles.join("\n"));
    lines.push("");
  }

  return lines.join("\n");
}

// Generate and write the llms.txt file
const content = generateLlmsTxt();
const outputPath = join(process.cwd(), "public", "llms.txt");

writeFileSync(outputPath, content, "utf-8");
console.log("✓ Generated llms.txt at " + outputPath);

// Dynamically find and copy markdown files to public directory for .md access
const rootDir = process.cwd();
const publicDir = join(rootDir, "public");

// Find all markdown files in the root directory
const rootFiles = readdirSync(rootDir);
const markdownFiles = rootFiles.filter(file => {
  const fullPath = join(rootDir, file);
  return statSync(fullPath).isFile() && 
         (file.endsWith(".md") || file.endsWith(".MD")) &&
         file !== "node_modules";
});

// Copy each markdown file to public/
for (const file of markdownFiles) {
  const srcPath = join(rootDir, file);
  const destPath = join(publicDir, file);
  
  try {
    copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${file} to public/${file}`);
  } catch (error) {
    console.warn(`⚠ Failed to copy ${file}:`, error);
  }
}
