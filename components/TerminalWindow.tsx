"use client";

import { useEffect, useState } from "react";

export default function TerminalWindow() {
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCursor(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
      <div className="bg-surface border border-border rounded-lg shadow-xl overflow-hidden">
        {/* Terminal header */}
        <div className="bg-surface border-b border-border px-4 py-2.5 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-xs text-muted">echohello@terminal:~</div>
          <div className="w-16"></div>
        </div>

        {/* Terminal body */}
        <div className="p-6 space-y-4 font-mono text-sm">
          <div>
            <div className="text-accent">
              $ echo &quot;Hello, I&apos;m a full-stack developer&quot;
            </div>
            <div className="text-text ml-2">
              Hello, I&apos;m a full-stack developer
            </div>
          </div>

          <div>
            <div className="text-accent">
              $ echo &quot;Building AI tooling, DX, cloud, OSS&quot;
            </div>
            <div className="text-text ml-2">
              Building AI tooling, DX, cloud, OSS
            </div>
          </div>

          <div>
            <div className="text-accent">$ ls projects/</div>
            <div className="text-muted ml-2 mt-1">
              component-library<span className="text-border"> / </span>
              cli-toolkit<span className="text-border"> / </span>
              ai-assistant<span className="text-border"> / </span>
              cloud-dashboard<span className="text-border"> / </span>
              design-system<span className="text-border"> / </span>
              deploy-engine<span className="text-border"> / </span>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-accent">$</span>
            {showCursor && (
              <span className="ml-1 inline-block w-2 h-4 bg-accent cursor-blink"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
