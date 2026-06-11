import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "nova-forma-theme";

function getStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = getStoredTheme();
  return stored ?? "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const dark = theme === "dark";
  root.classList.toggle("dark", dark);
  root.dataset.theme = theme;
  root.style.backgroundColor = dark ? "#050c12" : "#f7fcfc";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // The visual theme still changes even if storage is unavailable.
      }
      return next;
    });
  };

  return { theme, toggleTheme };
}
