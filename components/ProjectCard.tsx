import type { Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const delay = index * 100;
  
  return (
    <div
      className="bg-surface border border-border rounded-lg p-6 hover:border-accent hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-delay group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
        <span className="text-accent">›</span>
        {project.title}
      </h3>
      
      <p className="text-xs text-muted mb-4 leading-relaxed">
        {project.description}
      </p>
      
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-bg border border-border rounded text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        {project.websiteUrl && (
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs border border-border rounded-lg text-text hover:border-accent hover:text-accent transition-colors"
          >
            [VISIT]
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs border border-border rounded-lg text-text hover:border-accent hover:text-accent transition-colors"
          >
            [CODE]
          </a>
        )}
      </div>
    </div>
  );
}
