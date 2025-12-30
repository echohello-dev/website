# AGENTS.md - AI Coding Agent Guide

## Project Overview

**echohello.dev** is a Next.js 16 portfolio website showcasing projects and services. It uses **Contentlayer2** for MDX-based content management with a static export architecture. The design features a terminal aesthetic with dark/light theme support.

### Key Tech Stack

- **Framework**: Next.js 16 (static export via `output: "export"`)
- **Content**: Contentlayer2 + MDX files in `content/` directory
- **Styling**: Tailwind CSS 4 + CSS variables for theming
- **Theme**: next-themes with dark mode default
- **Type Safety**: TypeScript strict mode
- **Runtime**: Bun (package manager & task runner)
- **Build**: `contentlayer2 build` → `next build`
- **Task Management**: Mise for orchestrating dev/build/lint tasks

---

## Essential Architecture Patterns

### 1. Content Pipeline: MDX to React Components

All content lives in `content/` organized by type:

- **Projects**: `content/projects/*.mdx` → `Project` document type
- **Pages**: `content/pages/*.mdx` → `Page` document type

**Contentlayer Config** ([contentlayer.config.ts](contentlayer.config.ts)):

- Defines document schemas with required fields (title, description)
- Auto-computes `slug` from file path: `projects/cli-tools.mdx` → slug `cli-tools`
- Outputs generated types to `.contentlayer/generated` (auto-aliased in tsconfig)

**Rendering Pattern** ([components/MDXContent.tsx](components/MDXContent.tsx)):

```tsx
// Client component that renders compiled MDX code to React
const Component = useMDXComponent(code);
return <Component />;
```

**Usage in Pages**: Pages query contentlayer data to fetch content, pass compiled code to MDXContent:

```tsx
// Example from app/projects/page.tsx pattern
import { allProjects } from "@/.contentlayer/generated";
// Contentlayer provides allProjects array automatically
```

### 2. Static Site Generation Requirements

- **Build steps**: `contentlayer2 build && next build`
- **Image handling**: `unoptimized: true` in next.config (required for static export)
- **Trailing slashes**: `trailingSlash: true` for proper static routing
- **No dynamic routes** that require ISR—all routing must be pre-determined

### 3. Project Data Management

Two data sources exist with different purposes:

**Hardcoded Projects** ([lib/data.ts](lib/data.ts)):

- Used for homepage featured projects (slice 0-6)
- Manually maintained array of `Project` interface objects
- Properties: title, description, websiteUrl?, githubUrl?, tags?

**GitHub API Integration** ([lib/github-projects.ts](lib/github-projects.ts)):

- Utility functions to fetch live repo data from GitHub API
- `fetchGitHubProjects(owner)` - single user/org
- `fetchMultipleGitHubProjects(owners[])` - multiple owners
- **Not currently integrated into site**, but available for future dynamic project listing
- Enriches repos with activity levels, creation dates, star counts
- Requires `GITHUB_TOKEN` env var for higher rate limits (optional but recommended)

---

## Critical Developer Workflows

### Local Development

```bash
mise run dev  # Recommended: runs bun run dev
# or
bun run dev  # Runs: contentlayer2 build && next dev
```

- Contentlayer watches `content/` and rebuilds generated types
- Next.js dev server hot-reloads on component/config changes
- Generated types available immediately in editors
- Tasks defined in [mise.toml](mise.toml)

### Building for Production

```bash
mise run build  # Recommended: runs bun run build
# or
bun run build  # Runs: contentlayer2 build && next build
```

- Creates static HTML in `.next/out/` directory
- Requires contentlayer step to complete first (it runs in sequence)
- Fails if contentlayer schema validation fails

### Linting

```bash
mise run lint  # Recommended: runs bun run lint
# or
bun run lint  # ESLint with Next.js config
```

- Uses eslint.config.mjs (flat config format)
- Runs on all `.ts` and `.tsx` files

### Installing Dependencies

```bash
mise run install  # Recommended: runs bun install
# or
bun install
```

- Uses Bun package manager (faster than npm/yarn)
- Configured in package.json: `"packageManager": "bun@latest"`

---

## Design System & Styling Conventions

### CSS Variable Theming ([app/globals.css](app/globals.css))

- Root-level CSS variables control entire color palette
- Light/dark mode variants in `:root` and `.dark` selector
- **Colors**: `--bg`, `--surface`, `--border`, `--text`, `--muted`, `--accent`
- **Accent color**: Consistent orange (`#FFA217`) across themes
- **Font**: Geist Mono (monospace terminal aesthetic)

### Tailwind Integration

- Uses `@theme inline` to expose CSS variables to Tailwind
- Custom animations in globals.css: `fadeIn`, `fadeInUp`, `fadeInDelay`, `cursor-blink`
- Classes like `text-text`, `bg-bg`, `border-border` reference variables

### Component Patterns

- All components accept className for flexibility
- Transition animations on interactive elements: `transition-colors`, `transition-opacity`
- Header uses `backdrop-blur-sm` with fixed positioning (z-50)
- Terminal aesthetic: monospace font, bordered boxes, `<>` and `[]` brackets in UI text

---

## Integration Points & External Dependencies

### next-themes

- Wraps app in `<ThemeProvider>` in [app/layout.tsx](app/layout.tsx)
- Attributes: `class` mode (adds `.dark` to html element)
- Default: dark mode (`defaultTheme="dark"`)
- System preference respected: `enableSystem`

### next-contentlayer2

- Provides `useMDXComponent` hook for client-side rendering
- Provides generated document arrays (allProjects, allPages)
- Must import from generated path: `@/.contentlayer/generated`

### date-fns

- Utility for date formatting (potential use in project metadata display)

---

## File Organization & Important Paths

```
/components     - Reusable React components (ThemeToggle, Header, ProjectCard)
/app            - Next.js App Router pages and layouts
/content        - MDX source files (projects/, pages/)
/lib            - TypeScript utilities (data.ts, github-projects.ts)
/public         - Static assets (images/, CNAME for domain)
.contentlayer/  - Generated contentlayer types (auto-created, git-ignored)
```

**Key files to modify for common tasks**:

- Add projects: `content/projects/*.mdx` + add to featured list in `lib/data.ts`
- Update colors: [app/globals.css](app/globals.css) CSS variables
- Add pages: `content/pages/*.mdx` + link in [components/Header.tsx](components/Header.tsx)
- Change layout: [app/layout.tsx](app/layout.tsx) for global wrapper, page files for route-specific

---

## Common Pitfalls & Project-Specific Notes

1. **Always run contentlayer build before next build** - Generated types must exist before TypeScript compilation. The npm scripts handle this, but manual builds can fail.

2. **Image optimization disabled** - Use `next/image` but images won't be optimized. Useful for static export but requires pre-optimized source images.

3. **MDX field validation happens at build time** - Missing required fields (title, description) in frontmatter cause build failures. Check `.contentlayer/generated` output for debug info.

4. **Theme toggle requires client component** - Any component using `next-themes` must be marked with `"use client"` directive.

5. **GitHub API fallback** - `fetchGitHubProjects` logs warnings for failed org fetches but doesn't break the build (Promise.catch returns empty array).

---

## Extending the Project

### Adding New Content Types

1. Define new `DocumentType` in [contentlayer.config.ts](contentlayer.config.ts)
2. Create content directory (e.g., `content/blog/`)
3. Add files matching `filePathPattern`
4. Contentlayer generates types automatically in `.contentlayer/generated`
5. Import and use in pages via `allYourNewType` array

### Integrating Dynamic GitHub Projects

- Use `fetchGitHubProjects()` in build process or API route
- Currently available but unused—could replace `lib/data.ts` array for live data
- Requires `GITHUB_TOKEN` env var to avoid rate limiting

### Custom Theme Variants

- Add new CSS variables to `:root` and `.dark` in [app/globals.css](app/globals.css)
- Reference in Tailwind via `@theme inline` section
- Update TypeScript color references if creating typed theme object
