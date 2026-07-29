"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@repo/ui/lib/utils";

export interface AnimatedSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

export interface AnimatedSelectProps {
  value: string;
  options: AnimatedSelectOption[];
  onValueChange: (value: string) => void;

  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AnimatedSelect({
  value,
  options,
  onValueChange,
  placeholder = "Select option",
  disabled,
  className,
}: AnimatedSelectProps) {
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <motion.button
        type="button"
        disabled={disabled}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className="
          flex
          h-8
          items-center
          gap-2

          rounded-[var(--radius-sm)]
          border

          border-[var(--border-default)]
          bg-[var(--bg-elevated)]

          px-3

          text-sm
          text-[var(--text-secondary)]

          transition-colors

          hover:border-[var(--border-strong)]
          hover:text-[var(--text-primary)]

          focus:outline-none
          focus:border-[var(--border-focus)]

          disabled:pointer-events-none
          disabled:opacity-[var(--opacity-disabled)]
        "
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>

        <motion.span
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.18,
            ease: "easeOut",
          }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listboxId}
            role="listbox"
            initial={{
              opacity: 0,
              scale: 0.98,
              y: -4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              y: -4,
            }}
            transition={{
              duration: 0.12,
              ease: "easeOut",
            }}
            className="
              absolute
              right-0
              top-[calc(100%+8px)]
              z-[var(--z-dropdown)]

              min-w-full

              rounded-[var(--radius-md)]
              border

              border-[var(--border-default)]
              bg-[var(--bg-surface)]

              p-1

              border-[var(--border-strong)]
            "
          >
            {options.map((option) => {
              const active = option.value === value;

              return (
                <motion.button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  transition={{
                    duration: 0.12,
                  }}
                  onClick={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    gap-2

                    rounded-[var(--radius-sm)]

                    px-3
                    py-2

                    text-left
                    text-sm

                    transition-colors

                    hover:bg-[var(--bg-elevated)]
                  "
                >
                  {option.icon}

                  <div className="flex-1 min-w-0">
                    <div className="truncate text-[var(--text-primary)]">
                      {option.label}
                    </div>

                    {option.description && (
                      <div className="truncate text-xs text-[var(--text-muted)]">
                        {option.description}
                      </div>
                    )}
                  </div>

                  {active && (
                    <motion.span
                      layoutId="animated-select-indicator"
                      className="
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center

                        rounded-full

                        bg-[var(--accent-dim)]
                        text-[var(--brand-accent)]
                      "
                    >
                      <Check size={12} />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
