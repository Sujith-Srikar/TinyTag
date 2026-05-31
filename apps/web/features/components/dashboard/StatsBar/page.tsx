// ─────────────────────────────────────────────────────────────────────────────
// File: apps/web/components/dashboard/StatsBar.tsx
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change?: number; // % change, positive = green, negative = red
  icon: React.ReactNode;
  delay?: number;
  format?: "number" | "compact" | "percent";
}

function useCountUp(target: number, duration = 900, delay = 0) {
  const [current, setCurrent] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(eased * target));
        if (progress < 1) {
          raf.current = requestAnimationFrame(step);
        }
      };
      raf.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, delay]);

  return current;
}

function formatValue(
  n: number,
  format: StatCardProps["format"] = "compact",
): string {
  if (format === "percent") return `${n.toFixed(1)}%`;
  if (format === "compact") {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  }
  return n.toLocaleString();
}

function StatCard({
  label,
  value,
  suffix,
  prefix,
  change,
  icon,
  delay = 0,
  format = "compact",
}: StatCardProps) {
  const animatedValue = useCountUp(value, 900, delay);
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className={styles.card} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.cardHeader}>
        <span className={styles.cardLabel}>{label}</span>
        <span className={styles.cardIcon}>{icon}</span>
      </div>

      <div className={styles.cardValue}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <span className={styles.number}>
          {formatValue(animatedValue, format)}
        </span>
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>

      {change !== undefined && (
        <div
          className={[
            styles.change,
            isPositive ? styles.positive : "",
            isNegative ? styles.negative : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <svg
            viewBox="0 0 10 10"
            fill="none"
            style={{ transform: isNegative ? "rotate(180deg)" : "none" }}
          >
            <path d="M5 2L9 7H1L5 2Z" fill="currentColor" />
          </svg>
          <span>{Math.abs(change)}% vs last month</span>
        </div>
      )}
    </div>
  );
}

interface StatsBarProps {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  avgCtr: number;
}

export function StatsBar({
  totalLinks,
  totalClicks,
  activeLinks,
  avgCtr,
}: StatsBarProps) {
  return (
    <div className={styles.grid}>
      <StatCard
        label="Total Links"
        value={totalLinks}
        format="number"
        delay={0}
        change={12.5}
        icon={
          <svg viewBox="0 0 18 18" fill="none">
            <path
              d="M7.5 10.5a4.5 4.5 0 0 0 6.364 0l2-2a4.5 4.5 0 0 0-6.364-6.364l-1 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10.5 7.5a4.5 4.5 0 0 0-6.364 0l-2 2a4.5 4.5 0 0 0 6.364 6.364l1-1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        }
      />
      <StatCard
        label="Total Clicks"
        value={totalClicks}
        format="compact"
        delay={80}
        change={8.2}
        icon={
          <svg viewBox="0 0 18 18" fill="none">
            <path
              d="M6.5 2.5L15.5 9L9.5 10.5L7 16L6.5 2.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
      <StatCard
        label="Active Links"
        value={activeLinks}
        format="number"
        delay={160}
        change={0}
        icon={
          <svg viewBox="0 0 18 18" fill="none">
            <circle
              cx="9"
              cy="9"
              r="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M9 1v2M9 15v2M1 9h2M15 9h2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        }
      />
      <StatCard
        label="Avg. CTR"
        value={avgCtr}
        format="percent"
        delay={240}
        change={-1.4}
        icon={
          <svg viewBox="0 0 18 18" fill="none">
            <path
              d="M2 13L6 8L9.5 11L13 6L16 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </div>
  );
}
