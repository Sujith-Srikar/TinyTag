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
        y: 12,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: -12,
        filter: "blur(6px)",
      }}
      transition={{
        duration: 0.22,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
