# echoHello.dev

The official website for echoHello - built with Next.js, TypeScript, and Contentlayer2.

## 🚀 Features

- **Next.js 16** with App Router and TypeScript
- **Contentlayer2** for MDX content management
- **Tailwind CSS 4** for styling
- **Static Export** for GitHub Pages deployment
- **Base Path Aware** for proper routing on GitHub Pages
- **Custom Theme**: Warm orange (#FEA116), charcoal ink, rounded design

## 🎨 Design

The site features a bold, modern design with:
- Warm orange (#FEA116) as the primary accent color
- Charcoal (#2C2C2C) for text and backgrounds
- Thick rounded borders and big border radii
- Monoline style with subtle wave arcs
- Responsive layout optimized for all devices

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

## 📝 Content Management

Content is managed through Contentlayer2 with MDX files in the `content` directory:

- `content/pages/` - Static pages (about, services, oss, projects)
- `content/projects/` - Project entries with metadata

## 🚀 Deployment

The site automatically deploys to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

The workflow file is located at `.github/workflows/deploy.yml`.

## 🔗 Links

- **Discord**: [Join our community](https://discord.gg/echohello)
- **GitHub**: [View our projects](https://github.com/echohello-dev)

## 📄 License

See LICENSE file for details.

