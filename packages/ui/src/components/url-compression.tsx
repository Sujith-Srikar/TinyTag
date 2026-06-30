"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const URLS = [
  "https://github.com/vercel/next.js/tree/canary/packages/next/src/client/components/app-router.tsx",
  "github.com/vercel/next.js",
  "tinytags.dev/nextjs",
  "ttags.dev/x8FaL",
];

export function UrlCompression() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const longOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const mediumOpacity = useTransform(scrollYProgress, [0.2, 0.35, 0.5], [0, 1, 0]);
  const brandedOpacity = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [0, 1, 0]);
  const shortOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  const longScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.96]);
  const mediumScale = useTransform(scrollYProgress, [0.2, 0.5], [0.96, 1]);
  const brandedScale = useTransform(scrollYProgress, [0.5, 0.8], [0.96, 1]);
  const shortScale = useTransform(scrollYProgress, [0.8, 1], [0.94, 1.08]);

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-background">
        <div className="relative flex h-32 w-full max-w-6xl items-center justify-center px-8">
          <motion.p
            style={{
              opacity: longOpacity,
              scale: longScale,
            }}
            className="absolute font-mono text-lg text-muted-foreground"
          >
            {URLS[0]}
          </motion.p>

          <motion.p
            style={{
              opacity: mediumOpacity,
              scale: mediumScale,
            }}
            className="absolute font-mono text-2xl text-foreground"
          >
            {URLS[1]}
          </motion.p>

          <motion.p
            style={{
              opacity: brandedOpacity,
              scale: brandedScale,
            }}
            className="absolute font-mono text-4xl font-medium text-primary"
          >
            {URLS[2]}
          </motion.p>

          <motion.p
            style={{
              opacity: shortOpacity,
              scale: shortScale,
            }}
            className="absolute font-mono text-6xl font-bold tracking-tight text-primary"
          >
            {URLS[3]}
          </motion.p>
        </div>
      </div>
    </section>
  );
}