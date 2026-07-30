import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedContainer({
  children,
  delay = 0,
  className,
}: AnimatedContainerProps) {
  return (
    <motion.div
      layout
      className={className}
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -8,
      }}
      transition={{
        duration: 0.18,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
