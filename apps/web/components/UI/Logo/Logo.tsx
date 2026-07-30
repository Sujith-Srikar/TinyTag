// ─────────────────────────────────────────────────────────────────────────────
// File: apps/web/components/ui/Logo.tsx
// ─────────────────────────────────────────────────────────────────────────────

import styles from "./Logo.module.scss";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 16 },
    md: { icon: 28, text: 18 },
    lg: { icon: 36, text: 24 },
  };

  const s = sizes[size];

  return (
    <div className={styles.logo}>
      {/* Chain-link icon — two interlinked rounded rectangles */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        aria-hidden="true"
      >
        {/* Left link ring */}
        <rect
          x="2"
          y="9"
          width="14"
          height="10"
          rx="5"
          stroke="var(--accent)"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Right link ring */}
        <rect
          x="12"
          y="9"
          width="14"
          height="10"
          rx="5"
          stroke="var(--color-text-primary)"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Overlap mask — left ring front */}
        <rect x="2" y="10.5" width="11" height="7" fill="var(--color-surface)" />
        {/* Redraw left ring front arc */}
        <path
          d="M7 9 A5 5 0 0 0 7 19"
          stroke="var(--accent)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <line
          x1="7"
          y1="9"
          x2="13"
          y2="9"
          stroke="var(--accent)"
          strokeWidth="2.5"
        />
        <line
          x1="7"
          y1="19"
          x2="13"
          y2="19"
          stroke="var(--accent)"
          strokeWidth="2.5"
        />
      </svg>

      <span className={styles.wordmark} style={{ fontSize: s.text }}>
        Tiny<span className={styles.accent}>Tag</span>
      </span>
    </div>
  );
}
