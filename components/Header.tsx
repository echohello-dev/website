import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-surface/80 backdrop-blur-sm z-50 border-b border-border animate-fade-in">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="text-sm font-semibold text-text hover:text-accent transition-colors">
            <span className="text-accent">$</span> echo Hello
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/projects/" className="text-sm text-muted hover:text-text transition-colors">
              projects
            </Link>
            <ThemeToggle />
            <a
              href="https://github.com/echohello-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs border border-border rounded-lg text-text hover:border-accent hover:text-accent transition-colors"
            >
              [GITHUB]
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
