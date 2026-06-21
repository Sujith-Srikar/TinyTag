"use client";

import { useEffect, useState } from "react";
import { TextParticle } from "@repo/ui";
import styles from "./ComingSoon.module.scss";
import { useBreakPoint } from "@/hooks/useBreakPoint";
import { useTheme } from "next-themes";

const messages = [
  "Still cooking...",
  "Waiting for a few more commits.",
  "Powered by caffeine and false optimism.",
  "Deploying soon™.",
  "Works perfectly in our imagination.",
  "Currently in a committed relationship with the backlog.",
];

export function ComingSoon() {
  const [index, setIndex] = useState(0);
  const { isMobile } = useBreakPoint();
  const { resolvedTheme } = useTheme();

  const particleColor = resolvedTheme === "dark" ? "#cbff47" : "#141412";

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.glow} />

      <div className={styles.hero}>
        <TextParticle
          text="COMING"
          fontSize={isMobile ? 60 : 130}
          particleColor={particleColor}
          particleSize={1}
          particleDensity={5}
        />

        <TextParticle
          text="SOON"
          fontSize={isMobile ? 64 : 140}
          particleColor={particleColor}
          particleSize={1}
          particleDensity={5}
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>
          We're shortening URLs faster than we're building this page.
        </h2>

        <div key={index} className={styles.rotating}>
          {messages[index]}
        </div>

        <div className={styles.divider} />

        <div className={styles.status}>
          <span>✓ Dashboard</span>
          <span>✓ Redirects</span>
          <span className={styles.pending}>◌ This page</span>
        </div>
      </div>
    </div>
  );
}
