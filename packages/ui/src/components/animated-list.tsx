"use client";

import { AnimatePresence, motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.ul layout className={className}>
        {children}
      </motion.ul>
    </AnimatePresence>
  );
}