"use client";

import type { Project } from "@/lib/data";
import {
  LuStar,
  LuGithub,
  LuExternalLink,
  LuCode,
  LuCalendar,
  LuZap,
  LuCodesandbox,
  LuBook,
  LuServer,
  LuPersonStanding,
  LuPhoneCall,
  LuFilm,
} from "react-icons/lu";
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiAmazon,
  SiFigma,
  SiDocker,
  SiKubernetes,
  SiNextdotjs,
  SiOpenai,
  SiGooglecloud,
  SiTerraform,
  SiGithub,
  SiGithubactions,
  SiGitlab,
  SiJenkins,
  SiGit,
  SiJavascript,
  SiC,
  SiCplusplus,
  SiSharp,
  SiPhp,
  SiLaravel,
  SiAstro,
  SiHugo,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiGrafana,
  SiPrometheus,
  SiNewrelic,
  SiAmazoncloudwatch,
  SiSumologic,
  SiBackstage,
  SiConfluence,
  SiJira,
  SiVercel,
  SiHtml5,
  SiCss3,
  SiMarkdown,
  SiMdx,
  SiJson,
  SiYaml,
  SiLatex,
  SiGraphql,
  SiAuth0,
  SiDiscord,
  SiLinkedin,
  SiCommonworkflowlanguage,
} from "react-icons/si";
import { VscAzure, VscAzureDevops } from "react-icons/vsc";
import {
  FaTerminal,
  FaCloud,
  FaPalette,
  FaCogs,
  FaBookmark,
  FaStar,
  FaCode,
  FaCalculator,
  FaImage,
  FaBook,
  FaPenSquare,
} from "react-icons/fa";
import { motion } from "framer-motion";
import ContributionChart from "./ContributionChart";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

function getTagIcon(tag: string) {
  const tagLower = tag.toLowerCase().replace(/\s+/g, "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iconMap: Record<string, any> = {
    // Cloud & Infrastructure
    azure: VscAzure,
    microsoftazure: VscAzure,
    aws: SiAmazon,
    amazonwebservices: SiAmazon,
    gcp: SiGooglecloud,
    googlecloud: SiGooglecloud,
    kubernetes: SiKubernetes,
    k8s: SiKubernetes,
    terraform: SiTerraform,
    docker: SiDocker,

    // CI/CD & DevOps
    github: SiGithub,
    githubactions: SiGithubactions,
    gitlab: SiGitlab,
    azuredevops: VscAzureDevops,
    jenkins: SiJenkins,
    "ci/cd": SiJenkins,
    cicd: SiJenkins,
    git: SiGit,
    devops: FaCogs,

    // Programming Languages
    javascript: SiJavascript,
    js: SiJavascript,
    typescript: SiTypescript,
    ts: SiTypescript,
    python: SiPython,
    c: SiC,
    "c++": SiCplusplus,
    cpp: SiCplusplus,
    cplusplus: SiCplusplus,
    "c#": SiSharp,
    csharp: SiSharp,
    php: SiPhp,

    // Frameworks & Libraries
    react: SiReact,
    reactjs: SiReact,
    "next.js": SiNextdotjs,
    nextjs: SiNextdotjs,
    next: SiNextdotjs,
    "node.js": SiNodedotjs,
    nodejs: SiNodedotjs,
    node: SiNodedotjs,
    laravel: SiLaravel,
    astro: SiAstro,
    hugo: SiHugo,

    // Databases
    postgresql: SiPostgresql,
    postgres: SiPostgresql,
    mongodb: SiMongodb,
    mongo: SiMongodb,
    mysql: SiMysql,
    sql: SiMysql,

    // Monitoring & Observability
    grafana: SiGrafana,
    prometheus: SiPrometheus,
    newrelic: SiNewrelic,
    cloudwatch: SiAmazoncloudwatch,
    sumologic: SiSumologic,
    monitoring: FaCloud,

    // Developer Tools
    backstage: SiBackstage,
    confluence: SiConfluence,
    jira: SiJira,
    figma: SiFigma,
    vercel: SiVercel,
    devtools: FaCogs,

    // Styling & Markup
    html: SiHtml5,
    html5: SiHtml5,
    css: SiCss3,
    css3: SiCss3,
    tailwind: SiTailwindcss,
    tailwindcss: SiTailwindcss,
    markdown: SiMarkdown,
    md: SiMarkdown,
    mdx: SiMdx,
    json: SiJson,
    yaml: SiYaml,
    yml: SiYaml,
    latex: SiLatex,

    // AI & Other
    ai: SiOpenai,
    openai: SiOpenai,
    artificialintelligence: SiOpenai,
    graphql: SiGraphql,
    auth0: SiAuth0,
    security: SiAuth0,
    discord: SiDiscord,
    linkedin: SiLinkedin,
    commonmark: SiCommonworkflowlanguage,

    // Generic Icons
    guide: FaBookmark,
    feature: FaStar,
    code: FaCode,
    math: FaCalculator,
    images: FaImage,
    book: FaBook,
    writings: FaPenSquare,
    webdevelopment: LuCodesandbox,
    digitalgarden: LuBook,
    homelab: LuServer,
    persona: LuPersonStanding,
    customerservice: LuPhoneCall,
    cinema: LuFilm,
    cli: FaTerminal,
    design: FaPalette,
  };

  return iconMap[tagLower];
}

function getTagIconColor(tag: string): string {
  const tagLower = tag.toLowerCase().replace(/\s+/g, "");

  const colorMap: Record<string, string> = {
    // Cloud & Infrastructure
    azure: "text-[#0078D4]",
    microsoftazure: "text-[#0078D4]",
    aws: "text-[#FF9900]",
    amazonwebservices: "text-[#FF9900]",
    gcp: "text-[#4285F4]",
    googlecloud: "text-[#4285F4]",
    kubernetes: "text-[#326CE5]",
    k8s: "text-[#326CE5]",
    terraform: "text-[#7B42BC]",
    docker: "text-[#2496ED]",

    // CI/CD & DevOps
    github: "text-[#181717] dark:text-[#FFFFFF]",
    githubactions: "text-[#2088FF]",
    gitlab: "text-[#FC6D26]",
    azuredevops: "text-[#0078D7]",
    jenkins: "text-[#D24939]",
    "ci/cd": "text-[#D24939]",
    cicd: "text-[#D24939]",
    git: "text-[#F05032]",
    devops: "text-[#F97316]",

    // Programming Languages
    javascript: "text-[#F7DF1E]",
    js: "text-[#F7DF1E]",
    typescript: "text-[#3178C6]",
    ts: "text-[#3178C6]",
    python: "text-[#3776AB]",
    c: "text-[#A8B9CC]",
    "c++": "text-[#00599C]",
    cpp: "text-[#00599C]",
    cplusplus: "text-[#00599C]",
    "c#": "text-[#239120]",
    csharp: "text-[#239120]",
    php: "text-[#777BB4]",

    // Frameworks & Libraries
    react: "text-[#61DAFB]",
    reactjs: "text-[#61DAFB]",
    "next.js": "text-[#000000] dark:text-[#FFFFFF]",
    nextjs: "text-[#000000] dark:text-[#FFFFFF]",
    next: "text-[#000000] dark:text-[#FFFFFF]",
    "node.js": "text-[#339933]",
    nodejs: "text-[#339933]",
    node: "text-[#339933]",
    laravel: "text-[#FF2D20]",
    astro: "text-[#FF5D01]",
    hugo: "text-[#FF4088]",

    // Databases
    postgresql: "text-[#4169E1]",
    postgres: "text-[#4169E1]",
    mongodb: "text-[#47A248]",
    mongo: "text-[#47A248]",
    mysql: "text-[#4479A1]",
    sql: "text-[#4479A1]",

    // Monitoring & Observability
    grafana: "text-[#F46800]",
    prometheus: "text-[#E6522C]",
    newrelic: "text-[#008C99]",
    cloudwatch: "text-[#FF9900]",
    sumologic: "text-[#000099]",
    monitoring: "text-[#3B82F6]",

    // Developer Tools
    backstage: "text-[#9BF0E1]",
    confluence: "text-[#172B4D]",
    jira: "text-[#0052CC]",
    figma: "text-[#F24E1E]",
    vercel: "text-[#000000] dark:text-[#FFFFFF]",
    devtools: "text-[#8B5CF6]",

    // Styling & Markup
    html: "text-[#E34F26]",
    html5: "text-[#E34F26]",
    css: "text-[#1572B6]",
    css3: "text-[#1572B6]",
    tailwind: "text-[#06B6D4]",
    tailwindcss: "text-[#06B6D4]",
    markdown: "text-[#000000] dark:text-[#FFFFFF]",
    md: "text-[#000000] dark:text-[#FFFFFF]",
    mdx: "text-[#FCBF24]",
    json: "text-[#000000] dark:text-[#FFFFFF]",
    yaml: "text-[#CB171E]",
    yml: "text-[#CB171E]",
    latex: "text-[#008080]",

    // AI & Other
    ai: "text-[#412991]",
    openai: "text-[#412991]",
    artificialintelligence: "text-[#412991]",
    graphql: "text-[#E10098]",
    auth0: "text-[#EB5424]",
    security: "text-[#EB5424]",
    discord: "text-[#5865F2]",
    linkedin: "text-[#0A66C2]",
    commonmark: "text-[#000000] dark:text-[#FFFFFF]",

    // Generic Icons
    guide: "text-[#10B981]",
    feature: "text-[#FBBF24]",
    code: "text-[#8B5CF6]",
    math: "text-[#3B82F6]",
    images: "text-[#EC4899]",
    book: "text-[#14B8A6]",
    writings: "text-[#F59E0B]",
    webdevelopment: "text-[#6366F1]",
    digitalgarden: "text-[#10B981]",
    homelab: "text-[#EF4444]",
    persona: "text-[#8B5CF6]",
    customerservice: "text-[#06B6D4]",
    cinema: "text-[#DC2626]",
    cli: "text-[#4EAA25]",
    design: "text-[#EC4899]",
  };

  return colorMap[tagLower] || "text-muted";
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ y: -4 }}
      className="bg-surface border border-border rounded-lg p-6 hover:border-accent transition-colors duration-200 group flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        {project.githubUrl || project.websiteUrl ? (
          <a
            href={project.githubUrl || project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-text hover:text-accent transition-colors flex items-center gap-2 group/title"
          >
            <LuCode className="w-4 h-4 text-accent flex-shrink-0" />
            {project.title}
          </a>
        ) : (
          <h3 className="text-sm font-semibold text-text flex items-center gap-2">
            <LuCode className="w-4 h-4 text-accent flex-shrink-0" />
            {project.title}
          </h3>
        )}
        {project.stars !== undefined && (
          <span className="text-xs text-accent font-semibold whitespace-nowrap ml-2 flex items-center gap-1">
            <LuStar className="w-3.5 h-3.5 fill-current" />
            {project.stars.toLocaleString()}
          </span>
        )}
      </div>

      <div className="relative mb-3 h-8 group-hover/desc:h-auto overflow-hidden group/desc">
        <p className="text-xs text-muted leading-relaxed">
          {project.description}
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-surface to-transparent pointer-events-none group-hover/desc:opacity-0 transition-opacity duration-200" />
      </div>

      {project.commitActivity && project.commitActivity.length > 0 && (
        <div className="mb-3">
          <ContributionChart
            lastActivity={project.lastActivity}
            createdAt={project.createdAt}
            updatedAt={project.updatedAt}
            commitActivity={project.commitActivity}
          />
        </div>
      )}

      <div className="text-xs text-muted mb-3 space-y-1">
        {project.ageInDays !== undefined && (
          <p className="flex items-center gap-2">
            <LuCalendar className="w-3.5 h-3.5 flex-shrink-0" />
            Created {project.ageInDays} days ago
            {project.createdAt &&
              ` (${new Date(project.createdAt).toLocaleDateString()})`}
          </p>
        )}
        {project.contributionActivityLevel && (
          <p className="flex items-center gap-2 text-accent">
            <LuZap className="w-3.5 h-3.5 flex-shrink-0" />
            {project.contributionActivityLevel}
          </p>
        )}
        {(project.totalCommits !== undefined ||
          project.contributors !== undefined ||
          project.forks !== undefined ||
          project.openIssues !== undefined) && (
          <div className="flex items-center gap-3 pt-1">
            {project.totalCommits !== undefined && (
              <span className="flex items-center gap-1">
                <LuGithub className="w-3.5 h-3.5 flex-shrink-0" />
                {project.totalCommits.toLocaleString()} commits
              </span>
            )}
            {project.contributors !== undefined && project.contributors > 0 && (
              <span className="flex items-center gap-1">
                👥 {project.contributors}
              </span>
            )}
            {project.forks !== undefined && project.forks > 0 && (
              <span className="flex items-center gap-1">
                🔱 {project.forks}
              </span>
            )}
          </div>
        )}
      </div>

      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => {
            const TagIcon = getTagIcon(tag);
            const iconColor = getTagIconColor(tag);
            return (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-bg border border-border rounded text-muted flex items-center gap-1"
              >
                {TagIcon && <TagIcon className={`w-3 h-3 ${iconColor}`} />}
                {tag}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 justify-end mt-auto">
        {project.websiteUrl && (
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs border border-border rounded-lg text-text hover:border-accent hover:text-accent transition-colors flex items-center gap-1 h-8"
          >
            <LuExternalLink className="w-3.5 h-3.5" />
            <span>VISIT</span>
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs border border-border rounded-lg text-text hover:border-accent hover:text-accent transition-colors flex items-center gap-1 h-8"
          >
            <LuGithub className="w-3.5 h-3.5" />
            <span>CODE</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
