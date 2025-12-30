export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-muted">
            <span className="text-accent">$</span> © 2025 echoHello
            --all-rights-reserved
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/echohello-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              [GITHUB]
            </a>
            <a
              href="https://twitter.com/echohello"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              [TWITTER]
            </a>
            <a
              href="https://linkedin.com/company/echohello"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              [LINKEDIN]
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
