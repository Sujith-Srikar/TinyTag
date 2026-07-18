"use client";

import { useTheme } from "next-themes";
import styles from "./ThemeToggle.module.scss";
import { Button } from "@repo/ui";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  showLabel?: boolean;
  collapsed?: boolean;
}

export function ThemeToggle({
  showLabel = false,
  collapsed = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      className={[styles.toggle, collapsed ? styles.collapsed : ""]
        .filter(Boolean)
        .join(" ")}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
    >
      <span className={styles.iconWrap}>
        {/* Sun */}
        <svg
          className={[styles.icon, styles.sun, !isDark ? styles.active : ""]
            .filter(Boolean)
            .join(" ")}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="10"
            r="4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line
            x1="10"
            y1="2"
            x2="10"
            y2="4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="10"
            y1="16"
            x2="10"
            y2="18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="10"
            x2="4"
            y2="10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="10"
            x2="18"
            y2="10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="4.22"
            y1="4.22"
            x2="5.64"
            y2="5.64"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="14.36"
            y1="14.36"
            x2="15.78"
            y2="15.78"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="4.22"
            y1="15.78"
            x2="5.64"
            y2="14.36"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="14.36"
            y1="5.64"
            x2="15.78"
            y2="4.22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Moon */}
        <svg
          className={[styles.icon, styles.moon, isDark ? styles.active : ""]
            .filter(Boolean)
            .join(" ")}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 11.5A7 7 0 1 1 8.5 3a5 5 0 0 0 8.5 8.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {showLabel && !collapsed && (
        <span className={styles.label}>
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      )}
    </Button>
  );
}
