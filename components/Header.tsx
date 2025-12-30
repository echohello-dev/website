import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { LuGithub } from "react-icons/lu";

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-surface/80 backdrop-blur-sm z-50 border-b border-border animate-fade-in">
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-text hover:text-accent transition-colors"
          >
            <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M85 45C85 38.9249 80.0751 34 74 34C67.9249 34 63 38.9249 63 45C63 51.0751 67.9249 56 74 56C80.0751 56 85 51.0751 85 45Z"
                  fill="white"
                />
                <path
                  d="M57 75C57 70.5817 53.4183 67 49 67C44.5817 67 41 70.5817 41 75C41 79.4183 44.5817 83 49 83C53.4183 83 57 79.4183 57 75Z"
                  fill="white"
                />
              </svg>
            </div>
            echoHello
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/projects/"
              className="text-sm text-muted hover:text-text transition-colors"
            >
              projects
            </Link>
            <ThemeToggle />
            <a
              href="https://github.com/echohello-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs border border-border rounded-lg text-text hover:border-accent hover:text-accent transition-colors flex items-center gap-1"
            >
              <LuGithub className="w-4 h-4" />
              <span>GITHUB</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
