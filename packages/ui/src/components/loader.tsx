import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"

import { cn } from "../lib/utils"

const loaderVariants = cva(
  "relative inline-flex items-center justify-center text-[var(--foreground)]",
  {
    variants: {
      size: {
        sm: "size-4",
        default: "size-5",
        lg: "size-7",
        xl: "size-9",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

const dotSizes = {
  sm: 2.5,
  default: 3,
  lg: 4,
  xl: 5,
} as const;

const gridGap = {
  sm: 1.5,
  default: 2,
  lg: 3,
  xl: 4,
} as const;

const positions: [number, number][] = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1], [2, 1],
  [0, 2], [1, 2], [2, 2],
]

type LoaderSize = keyof typeof dotSizes;

interface LoaderProps
  extends Omit<React.ComponentProps<"div">, "children">,
    VariantProps<typeof loaderVariants> {
  label?: string
}

function Loader({
  className,
  size = "default",
  label = "Loading...",
  ...props
}: LoaderProps) {
  const dot = dotSizes[size as LoaderSize];
  const gap = gridGap[size as LoaderSize];

  return (
    <div
      role="status"
      aria-label={label}
      data-slot="loader"
      data-variant={size}
      className={cn(loaderVariants({ size }), className)}
      {...props}
    >
      {positions.map(([col, row], i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-current"
          style={{
            width: dot,
            height: dot,
            left: col * (dot + gap),
            top: row * (dot + gap),
          }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 3) * 0.1 + Math.floor(i / 3) * 0.1,
          }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  )
}

export { Loader }
