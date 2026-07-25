"use client";

import {
  Dialog as DialogPrimitive,
  VisuallyHidden as VisuallyHiddenPrimitive,
} from "radix-ui";
import { Drawer } from "vaul";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 640px)");
}

type DialogVariant = "default" | "sub";

type DialogContextValue = {
  variant: DialogVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue>({
  variant: "default",
  open: false,
  onOpenChange: () => {},
});

type DialogRootProps = ComponentProps<typeof DialogPrimitive.Root>;

function Dialog({
  variant = "default",
  open,
  onOpenChange,
  ...props
}: DialogRootProps & { variant?: DialogVariant }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = open !== undefined;
  const resolvedOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const ctx = useMemo(
    () => ({ variant, open: resolvedOpen, onOpenChange: handleOpenChange }),
    [variant, resolvedOpen],
  );

  return (
    <DialogContext.Provider value={ctx}>
      <DialogPrimitive.Root
        open={resolvedOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DialogContext.Provider>
  );
}

function DialogTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

const sizeStyles = {
  sm: "w-[min(400px,calc(100vw-32px))]",
  md: "w-[min(560px,calc(100vw-32px))]",
  lg: "w-[min(800px,calc(100vw-32px))]",
  xl: "w-[min(1100px,calc(100vw-24px))]",
} as const;

type DialogSize = "sm" | "md" | "lg" | "xl";

type DialogContentProps = {
  children: ReactNode;
  className?: string;
  size?: DialogSize;
  onEscapeKeyDown?: ComponentProps<
    typeof DialogPrimitive.Content
  >["onEscapeKeyDown"];
  onInteractOutside?: ComponentProps<
    typeof DialogPrimitive.Content
  >["onInteractOutside"];
  drawerRootProps?: ComponentProps<typeof Drawer.Root>;
} & Omit<
  ComponentProps<typeof DialogPrimitive.Content>,
  "children" | "className"
>;

function DialogContent({
  children,
  className,
  size = "md",
  onEscapeKeyDown,
  onInteractOutside,
  drawerRootProps,
  ...props
}: DialogContentProps) {
  const isMobile = useIsMobile();
  const { variant, open, onOpenChange } = useContext(DialogContext);
  const isSub = variant === "sub";

  if (isMobile && !isSub) {
    return (
      <Sheet
        className={className}
        open={open}
        onOpenChange={onOpenChange}
        drawerRootProps={drawerRootProps}
      >
        {children}
      </Sheet>
    );
  }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/35 backdrop-blur-[18px]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "duration-200",
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "flex flex-col overflow-hidden",
          "max-h-[min(90vh,720px)]",
          "bg-background border border-border rounded-[var(--radius-xl)]",
          "shadow-[0_24px_80px_rgba(0,0,0,0.28),0_8px_24px_rgba(0,0,0,0.18)]",
          "overscroll-behavior-contain outline-none",
          "duration-200",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=closed]:duration-150",
          sizeStyles[size],
          className,
        )}
        onEscapeKeyDown={onEscapeKeyDown}
        onInteractOutside={onInteractOutside}
        {...props}
      >
        <VisuallyHiddenPrimitive.Root>
          <DialogPrimitive.Title>Dialog</DialogPrimitive.Title>
          <DialogPrimitive.Description>
            Dialog content
          </DialogPrimitive.Description>
        </VisuallyHiddenPrimitive.Root>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

type SheetProps = {
  children: ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  drawerRootProps?: ComponentProps<typeof Drawer.Root>;
};

function Sheet({
  children,
  className,
  open,
  onOpenChange,
  drawerRootProps,
}: SheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} {...drawerRootProps}>
      <Drawer.Portal>
        <Drawer.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/35 backdrop-blur-[18px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "duration-200",
          )}
        />
        <Drawer.Content
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50",
            "flex flex-col w-full max-h-[92dvh]",
            "bg-background border-t border-border",
            "rounded-t-[var(--radius-xl)]",
            "shadow-[0_-8px_32px_rgba(0,0,0,0.12),0_-24px_64px_rgba(0,0,0,0.18)]",
            "will-change-transform outline-none",
            className,
          )}
        >
          <DrawerHandle />
          <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-behavior-contain [webkit-overflow-scrolling:touch]">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function DrawerHandle() {
  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-center shrink-0 pt-3.5 pb-2 bg-background rounded-t-inherit"
      aria-hidden="true"
    >
      <div className="w-[42px] h-[5px] rounded-full bg-border-strong opacity-90" />
    </div>
  );
}

type DialogHeaderProps = {
  title: string;
  description?: string;
  onClose?: () => void;
  icon?: ReactNode;
  iconVariant?: "default" | "danger" | "warning" | "success";
  className?: string;
};

const iconVariantStyles = {
  default: "bg-elevated text-foreground border border-border",
  danger: "bg-destructive-muted text-destructive border border-destructive/20",
  warning: "bg-warning-muted text-warning border border-warning/20",
  success: "bg-success-muted text-success border border-success/20",
} as const;

function DialogHeader({
  title,
  description,
  onClose,
  icon,
  iconVariant = "default",
  className,
}: DialogHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3",
        "px-5 pt-5 pb-4",
        "border-b border-border shrink-0",
        className,
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-px",
              "[&_svg]:w-[18px] [&_svg]:h-[18px]",
              iconVariantStyles[iconVariant],
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-[3px] min-w-0 pt-px">
          <h2 className="font-display text-base font-bold text-foreground tracking-tight leading-snug">
            {title}
          </h2>
          {description && (
            <p className="text-[0.8125rem] text-muted-foreground leading-normal">
              {description}
            </p>
          )}
        </div>
      </div>

      {onClose && (
        <Button
          onClick={onClose}
          size="icon-sm"
          aria-label="Close dialog"
          variant="outline"
        >
          <CloseIcon />
        </Button>
      )}
    </div>
  );
}

type DialogBodyProps = {
  children: ReactNode;
  className?: string;
};

function DialogBody({ children, className }: DialogBodyProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        "px-5 py-5",
        "flex-1 overflow-y-auto overflow-x-hidden min-h-0",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border-strong",
        "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full",
        className,
      )}
    >
      {children}
    </div>
  );
}

type DialogFooterProps = {
  children: ReactNode;
  bordered?: boolean;
  className?: string;
};

function DialogFooter({
  children,
  bordered = true,
  className,
}: DialogFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2",
        "px-5 py-3.5",
        "shrink-0",
        bordered && "border-t border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DialogClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 1.5L12.5 12.5M12.5 1.5L1.5 12.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogClose,
  useMediaQuery,
  useIsMobile,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogBodyProps,
  type DialogFooterProps,
  type DialogSize,
};