"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";
import { Moon, Sun, Zap } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg bg-surface">
        <span className="text-xs text-muted">...</span>
      </div>
    );
  }

  const themes = [
    { value: "dark", label: "dark", icon: Moon },
    { value: "light", label: "light", icon: Sun },
    { value: "system", label: "auto", icon: Zap },
  ];

  return (
    <div className="flex items-center gap-1 px-2 py-1 border border-border rounded-lg bg-surface">
      {themes.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`p-1.5 rounded transition-colors ${
              theme === t.value
                ? "bg-accent text-bg"
                : "text-muted hover:text-text"
            }`}
            title={t.label}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
