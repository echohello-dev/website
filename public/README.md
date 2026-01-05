# echohello.dev

Terminal-inspired portfolio built with Next.js, TypeScript, and Contentlayer.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Content**: Contentlayer2 + MDX
- **Theme**: next-themes with dark mode default

## Development

```bash
mise run install  # Install dependencies
mise run dev      # Start dev server
mise run build    # Build for production
mise run lint     # Run linter
```

## Features

- Terminal/CLI aesthetic with monospace font
- Dark/Light/Auto theme toggle
- MDX-based content in `content/` directory
- Static site generation with GitHub Pages deployment
- Auto-generated [llms.txt](https://llmstxt.org) for LLM-friendly documentation

## Project Data

Project information is managed in two places:

- **Homepage featured projects**: Hardcoded in [lib/data.ts](lib/data.ts)
- **MDX content**: `content/projects/*.mdx` files
- **GitHub integration**: Available in [lib/github-projects.ts](lib/github-projects.ts) (not currently used)

See [AGENTS.md](AGENTS.md) for detailed development guide.
