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
}

export const projects: Project[] = [
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
