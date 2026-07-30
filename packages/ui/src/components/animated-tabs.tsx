"use client";

import { motion } from "motion/react";
import { cn } from "@repo/ui/lib/utils";

export interface AnimatedTab {
  id: string;
  label: string;
}

interface AnimatedTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  items: AnimatedTab[];
  className?: string;
}

export function AnimatedTabs({
  value,
  onValueChange,
  items,
  className,
}: AnimatedTabsProps) {
  return (
    <div
      className={cn(
        `
        inline-flex
        items-center
        gap-1

        rounded-[var(--radius-md)]
        border

        border-[var(--color-border)]
        bg-[var(--color-surface-elevated)]

        p-1
        `,
        className,
      )}
    >
      {items.map((item) => {
        const active = item.id === value;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onValueChange(item.id)}
            className="
              relative

              h-7
              px-3

              text-sm
              font-medium

              transition-colors

              rounded-[calc(var(--radius-md)-4px)]
            "
          >
            {active && (
              <motion.div
                layoutId="animated-tabs-indicator"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                className="
                  absolute
                  inset-0

                  rounded-[calc(var(--radius-md)-4px)]

                  bg-[var(--color-surface)]
                "
              />
            )}

            <span
              className={cn(
                `
                relative
                z-10
                transition-colors
                `,
                active
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-muted)]",
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}