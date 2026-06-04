"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@repo/ui/lib/utils";

function TooltipProvider({
  delayDuration = 80,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger(
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>,
) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 8,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          `
          z-50
          inline-flex
          w-fit
          max-w-xs
          items-center
          gap-1.5
          rounded-md
          bg-foreground
          px-3
          py-1.5
          text-xs
          text-background

          origin-[var(--radix-tooltip-content-transform-origin)]

          shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.05),0_4px_42px_rgba(0,0,0,0.06)]

          transition-[opacity,transform]
          ease-out

          data-[state=closed]:opacity-0
          data-[state=closed]:scale-[0.98]

          data-[state=instant-open]:opacity-100
          data-[state=instant-open]:scale-100

          data-[state=delayed-open]:opacity-100
          data-[state=delayed-open]:scale-100

          has-data-[slot=kbd]:pr-1.5
          **:data-[slot=kbd]:relative
          **:data-[slot=kbd]:isolate
          **:data-[slot=kbd]:z-50
          **:data-[slot=kbd]:rounded-sm
          `,
          className,
        )}
        {...props}
      >
        {children}

        <TooltipPrimitive.Arrow
          className="
            z-50
            size-2.5
            translate-y-[calc(-50%_-_2px)]
            rotate-45
            rounded-[2px]
            bg-foreground
            fill-foreground
          "
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
