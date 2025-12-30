"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";
import { LuMoon, LuSun, LuZap } from "react-icons/lu";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This pattern is necessary to prevent SSR/client mismatch with next-themes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 px-2 py-1.5 border border-border rounded-lg bg-surface">
        <span className="text-xs text-muted">...</span>
      </div>
    );
  }

  const themes = [
    { value: "dark", label: "dark", icon: LuMoon },
    { value: "light", label: "light", icon: LuSun },
    { value: "system", label: "auto", icon: LuZap },
  ];

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 border border-border rounded-lg bg-surface">
      {themes.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
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
