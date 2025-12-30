import type { Project } from "@/lib/data";
import {
  LuStar,
  LuGithub,
  LuExternalLink,
  LuCode,
  LuCalendar,
  LuZap,
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
} from "react-icons/si";
import { FaTerminal, FaCloud, FaPalette, FaCogs } from "react-icons/fa";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

function getTagIcon(tag: string) {
  const tagLower = tag.toLowerCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iconMap: Record<string, any> = {
    react: SiReact,
    typescript: SiTypescript,
    tailwind: SiTailwindcss,
    tailwindcss: SiTailwindcss,
    "node.js": SiNodedotjs,
    nodejs: SiNodedotjs,
    python: SiPython,
    aws: SiAmazon,
    figma: SiFigma,
    docker: SiDocker,
    k8s: SiKubernetes,
    kubernetes: SiKubernetes,
    "next.js": SiNextdotjs,
    nextjs: SiNextdotjs,
    openai: SiOpenai,
    ai: SiOpenai,
    cli: FaTerminal,
    devtools: FaCogs,
    monitoring: FaCloud,
    design: FaPalette,
    devops: FaCogs,
  };

  return iconMap[tagLower];
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const delay = index * 100;

  return (
    <div
      className="bg-surface border border-border rounded-lg p-6 hover:border-accent hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-delay group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-text flex items-center gap-2">
          <LuCode className="w-4 h-4 text-accent flex-shrink-0" />
          {project.title}
        </h3>
        {project.stars !== undefined && (
          <span className="text-xs text-accent font-semibold whitespace-nowrap ml-2 flex items-center gap-1">
            <LuStar className="w-3.5 h-3.5 fill-current" />
            {project.stars.toLocaleString()}
          </span>
        )}
      </div>

      <p className="text-xs text-muted mb-3 leading-relaxed">
        {project.description}
      </p>

      {(project.ageInDays !== undefined ||
        project.contributionActivityLevel !== undefined) && (
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
        </div>
      )}

      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => {
            const TagIcon = getTagIcon(tag);
            return (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-bg border border-border rounded text-muted flex items-center gap-1"
              >
                {TagIcon && <TagIcon className="w-3 h-3" />}
                {tag}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        {project.websiteUrl && (
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs border border-border rounded-lg text-text hover:border-accent hover:text-accent transition-colors flex items-center gap-1"
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
            className="px-3 py-1.5 text-xs border border-border rounded-lg text-text hover:border-accent hover:text-accent transition-colors flex items-center gap-1"
          >
            <LuGithub className="w-3.5 h-3.5" />
            <span>CODE</span>
          </a>
        )}
      </div>
    </div>
  );
}
