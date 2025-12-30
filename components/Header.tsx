import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { LuGithub } from "react-icons/lu";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-surface/80 backdrop-blur-sm z-50 border-b border-border animate-fade-in">
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-text hover:text-accent transition-colors"
          >
            <Image
              src="/images/emblem-box-color-background-wave-small.svg"
              alt="echoHello logo"
              width={28}
              height={28}
              className="rounded-md"
            />
            echoHello
          </Link>
          <div className="flex items-center gap-6">
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
              className="px-3 py-2 text-xs border border-border rounded-lg text-text hover:border-accent hover:text-accent transition-colors flex items-center gap-2 h-9"
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
