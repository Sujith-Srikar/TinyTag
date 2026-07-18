import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-transparent bg-clip-padding text-sm font-medium leading-none whitespace-nowrap font-body transition-all outline-none select-none focus-visible:border-[var(--border-focus)] focus-visible:ring-3 focus-visible:ring-[var(--brand-accent)]/20 active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-[var(--danger)] aria-invalid:ring-3 aria-invalid:ring-[var(--danger)]/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-accent)] text-[var(--accent-fg)] hover:bg-[var(--brand-accent)]/80",
        outline:
          "border-[var(--border-default)] bg-transparent hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] aria-expanded:bg-[var(--bg-elevated)] aria-expanded:text-[var(--text-primary)]",
        secondary:
          "bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] aria-expanded:bg-[var(--bg-elevated)] aria-expanded:text-[var(--text-primary)]",
        ghost:
          "hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] aria-expanded:bg-[var(--bg-elevated)] aria-expanded:text-[var(--text-primary)]",
        destructive:
          "bg-[var(--danger)]/10 text-[var(--danger)] hover:bg-[var(--danger)]/20 focus-visible:border-[var(--danger)]/40 focus-visible:ring-[var(--danger)]/20",
        link: "text-[var(--brand-accent)] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-6 gap-1 px-2 text-xs in-data-[slot=button-group]:rounded-[var(--radius-xs)] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 text-[0.8125rem] in-data-[slot=button-group]:rounded-[var(--radius-xs)] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-11",
        "icon-xs":
          "size-6 rounded-[var(--radius-xs)] in-data-[slot=button-group]:rounded-[var(--radius-xs)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[var(--radius-xs)] in-data-[slot=button-group]:rounded-[var(--radius-xs)]",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
