"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";

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
    { value: "dark", label: "dark" },
    { value: "light", label: "light" },
    { value: "system", label: "auto" },
  ];

  return (
    <div className="flex items-center gap-1 px-2 py-1 border border-border rounded-lg bg-surface">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            theme === t.value
              ? "bg-accent text-bg font-semibold"
              : "text-muted hover:text-text"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
