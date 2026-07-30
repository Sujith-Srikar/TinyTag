import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-transparent bg-clip-padding text-sm font-medium leading-none whitespace-nowrap font-body transition-all outline-none select-none focus-visible:border-[var(--color-border-focus)] focus-visible:ring-3 focus-visible:ring-[var(--color-brand)]/20 active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)] aria-invalid:border-[var(--color-danger)] aria-invalid:ring-3 aria-invalid:ring-[var(--color-danger)]/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--interactive)] text-[var(--color-on-accent)] hover:bg-[var(--interactive-hover)]",
        outline:
          "border-[var(--color-border)] bg-transparent hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] aria-expanded:bg-[var(--surface-hover)] aria-expanded:text-[var(--foreground)]",
        secondary:
          "bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--surface)] aria-expanded:bg-[var(--surface-elevated)] aria-expanded:text-[var(--foreground)]",
        ghost:
          "hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] aria-expanded:bg-[var(--surface-hover)] aria-expanded:text-[var(--foreground)]",
        destructive:
          "bg-[var(--status-danger-muted)] text-[var(--status-danger)] hover:bg-[var(--color-danger-muted)] focus-visible:border-[var(--color-danger)]/40 focus-visible:ring-[var(--color-danger)]/20",
        link: "text-[var(--interactive)] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-6 gap-1 px-2 text-xs in-data-[slot=button-group]:rounded-[var(--radius-xs)] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 text-sm in-data-[slot=button-group]:rounded-[var(--radius-xs)] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
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
