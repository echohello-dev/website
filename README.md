# echoHello.dev

The official website for echoHello - a terminal/CLI-inspired portfolio built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

- **Terminal/CLI Aesthetic**: Clean, monospace-first design inspired by modern terminal interfaces
- **Dark Mode by Default**: Three-state theme toggle (Dark/Light/Auto) with localStorage persistence
- **Echo Command Theme**: Plays on the "echoHello" name with terminal commands throughout
- **Smooth Animations**: Subtle entrance animations on page load
- **Interactive Terminal**: Hero section with blinking cursor animation
- **Project Showcase**: Featured projects with tech tags and bracket-style links
- **Responsive Design**: Mobile-first layout that works on all screen sizes

## 🎨 Design System

**Colors:**
- Background (Dark): `#1a1612` - Deep warm charcoal
- Background (Light): `#faf8f5` - Soft off-white
- Surface: Slightly lighter/darker than background for layering
- Text: Warm off-white in dark mode, charcoal in light mode
- Accent: `#FEA116` - Warm orange (echoHello brand color)
- Border: Subtle warm tones

**Typography:**
- Font: Geist Mono and monospace fallbacks
- All UI elements use monospace for that terminal feel
- Brackets for buttons: `[GITHUB]`, `[VISIT]`, `[CODE]`
- Prompt symbols: `$` and `>` for terminal-style headers

**Components:**
- Slightly rounded corners (8-14px)
- Thin borders (1-2px)
- Soft shadows for depth
- Hover effects: slight lift + border accent

## 📦 Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔨 Building

To build the site for production:

```bash
npm run build
```

This will generate a static export in the `out` directory.

## 🌐 Pages

- **Home (/)**: Terminal hero window with echo commands + featured projects
- **Projects (/projects)**: Full list of all projects with filtering

## 📝 Project Data

Project data is hardcoded in `lib/data.ts`. Each project includes:
- Title
- Description
- Website URL (optional)
- GitHub URL (optional)
- Tech tags (optional)

## 🚀 Deployment

The site automatically deploys to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

The workflow file is located at `.github/workflows/deploy.yml`.

## 🎯 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Content**: Contentlayer2 for MDX
- **Theme**: next-themes for dark mode
- **Deployment**: GitHub Pages (static export)

## 🔗 Links

- **Website**: [echohello.dev](https://echohello.dev)
- **GitHub**: [github.com/echohello-dev](https://github.com/echohello-dev)

## 📄 License

See LICENSE file for details.

