"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

export function TooltipProvider({
  delayDuration = 120,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

export function Tooltip(
  props: React.ComponentProps<typeof TooltipPrimitive.Root>,
) {
  return <TooltipPrimitive.Root {...props} />;
}

export function TooltipTrigger(
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>,
) {
  return <TooltipPrimitive.Trigger {...props} />;
}

interface TooltipContentProps extends React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
> {}

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 8, children, ...props }, ref) => {
  return (
    <TooltipPrimitive.Portal>
      <AnimatePresence>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          forceMount
          className="z-[var(--z-dropdown)] outline-none"
          {...props}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              y: 2,
            }}
            transition={{
              duration: 0.12,
              ease: "easeOut",
            }}
            className={cn(
              `
              inline-flex
              items-center
              gap-1.5
              max-w-xs
              rounded-[var(--radius-md)]
              border
              bg-[var(--bg-elevated)]
              border-[var(--border)]
              px-3
              py-1.5
              text-xs
              font-medium
              text-[var(--text-primary)]
              `,
              className,
            )}
          >
            {children}
          </motion.div>

          <TooltipPrimitive.Arrow
            className="
              fill-[var(--bg-surface)]
              stroke-[var(--border)]
            "
            width={10}
            height={6}
          />
        </TooltipPrimitive.Content>
      </AnimatePresence>
    </TooltipPrimitive.Portal>
  );
});

TooltipContent.displayName = "TooltipContent";