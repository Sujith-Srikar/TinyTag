"use client";

import { Portal } from "radix-ui";
import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
} from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

type DialogStackContextType = {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  totalDialogs: number;
  setTotalDialogs: Dispatch<SetStateAction<number>>;
  isOpen: boolean;
  setIsOpen: (next: boolean) => void;
  clickable: boolean;
};

const DialogStackContext = createContext<DialogStackContextType | null>(null);

function useDialogStack() {
  const ctx = useContext(DialogStackContext);
  if (!ctx) {
    throw new Error("DialogStack compound components must be used within <DialogStack>.");
  }
  return ctx;
}

/* -------------------------------------------------------------------------------------------------
 * DialogStack (root)
 * -----------------------------------------------------------------------------------------------*/

type DialogStackRootProps = {
  children: ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  clickable?: boolean;
} & Omit<ComponentProps<"div">, "children" | "className" | "ref">;

function DialogStackRoot({
  children,
  className,
  open: openProp,
  onOpenChange,
  clickable = false,
  ...props
}: DialogStackRootProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp : internalOpen;

  const setIsOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  // Reset active index when the stack closes.
  useEffect(() => {
    if (!isOpen) setActiveIndex(0);
  }, [isOpen]);

  const ctx = useMemo<DialogStackContextType>(
    () => ({
      activeIndex,
      setActiveIndex,
      totalDialogs: 0,
      setTotalDialogs: () => {},
      isOpen,
      setIsOpen,
      clickable,
    }),
    [activeIndex, isOpen, clickable, setIsOpen],
  );

  return (
    <DialogStackContext.Provider value={ctx}>
      <div className={className} {...props}>
        {children}
      </div>
    </DialogStackContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DialogStackTrigger
 * -----------------------------------------------------------------------------------------------*/

type DialogStackTriggerProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
} & ComponentProps<"button">;

function DialogStackTrigger({
  children,
  className,
  asChild,
  onClick,
  ...props
}: DialogStackTriggerProps) {
  const { setIsOpen } = useDialogStack();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen(true);
      onClick?.(e);
    },
    [setIsOpen, onClick],
  );

  if (asChild) {
    return (
      <Button asChild className={className} onClick={handleClick} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <Button onClick={handleClick} className={className} {...props}>
      {children}
    </Button>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DialogStackOverlay
 * -----------------------------------------------------------------------------------------------*/

type DialogStackOverlayProps = {
  className?: string;
} & ComponentProps<"div">;

function DialogStackOverlay({ className, ...props }: DialogStackOverlayProps) {
  const { isOpen, setIsOpen } = useDialogStack();

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className={cn(
        "fixed inset-0 z-50 bg-[var(--color-overlay)] backdrop-blur-[var(--blur-medium)]",
        "data-[state=closed]:animate-out data-[state=open]:animate-in",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "duration-[var(--duration-slow)]",
        className,
      )}
      onClick={() => setIsOpen(false)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------------------------------
 * DialogStackBody (portal container — all cards live here)
 * -----------------------------------------------------------------------------------------------*/

type DialogStackBodyProps = {
  children: ReactElement<DialogStackChildProps> | ReactElement<DialogStackChildProps>[];
  className?: string;
} & Omit<ComponentProps<"div">, "children" | "className" | "ref">;

function DialogStackBody({
  children,
  className,
  ...props
}: DialogStackBodyProps) {
  const ctx = useDialogStack();
  const [totalDialogs, setTotalDialogs] = useState(() => Children.count(children));

  useEffect(() => {
    setTotalDialogs(Children.count(children));
  }, [children]);

  if (!ctx.isOpen) return null;

  return (
    <DialogStackContext.Provider value={{ ...ctx, totalDialogs, setTotalDialogs }}>
      <Portal.Root>
        <div
          className={cn(
            "pointer-events-none fixed inset-0 z-50 mx-auto flex w-full max-w-lg flex-col items-center justify-center p-4",
            className,
          )}
          {...props}
        >
          <div className="pointer-events-auto relative flex w-full flex-col items-center justify-center">
            {Children.map(children, (child, index) =>
              cloneElement(child as ReactElement<DialogStackChildProps>, { index }),
            )}
          </div>
        </div>
      </Portal.Root>
    </DialogStackContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DialogStackContent (individual stacked card)
 * -----------------------------------------------------------------------------------------------*/

type DialogStackChildProps = {
  index?: number;
};

type DialogStackContentProps = {
  children: ReactNode;
  className?: string;
  index?: number;
  offset?: number;
} & Omit<ComponentProps<"div">, "children" | "className" | "ref">;

function DialogStackContent({
  children,
  className,
  index = 0,
  offset = 10,
  ...props
}: DialogStackContentProps) {
  const { activeIndex, clickable, setActiveIndex, isOpen } = useDialogStack();

  if (!isOpen) return null;

  const distance = index - activeIndex;
  const absDistance = Math.abs(distance);
  const isBehind = distance > 0;
  const isAhead = distance < 0;

  const handleClick = () => {
    if (clickable && activeIndex > index) {
      setActiveIndex(index);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "h-auto w-full rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--surface)] p-6",
        "shadow-[var(--shadow-high)]",
        "transition-all duration-[var(--duration-slow)] ease-[var(--ease-enter)]",
        clickable && activeIndex > index && "cursor-pointer",
        className,
      )}
      style={{
        top: 0,
        transform: `translateY(${isAhead ? "-" : ""}${absDistance * offset}px)`,
        width: `calc(100% - ${absDistance * 10}px)`,
        zIndex: 50 - absDistance,
        position: distance !== 0 ? "absolute" : "relative",
        opacity: isBehind ? 0 : 1,
      }}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full transition-opacity duration-[var(--duration-slow)]",
          activeIndex !== index && "pointer-events-none select-none opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DialogStackHeader
 * -----------------------------------------------------------------------------------------------*/

type DialogStackHeaderProps = {
  className?: string;
} & ComponentProps<"div">;

function DialogStackHeader({ className, ...props }: DialogStackHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-[3px]", className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------------------------------
 * DialogStackTitle
 * -----------------------------------------------------------------------------------------------*/

type DialogStackTitleProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<"h2">, "children" | "className" | "ref">;

function DialogStackTitle({ children, className, ...props }: DialogStackTitleProps) {
  return (
    <h2
      className={cn(
        "font-display text-base font-semibold text-foreground tracking-tight leading-snug",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DialogStackDescription
 * -----------------------------------------------------------------------------------------------*/

type DialogStackDescriptionProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<"p">, "children" | "className" | "ref">;

function DialogStackDescription({
  children,
  className,
  ...props
}: DialogStackDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-muted-foreground leading-normal", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DialogStackFooter
 * -----------------------------------------------------------------------------------------------*/

type DialogStackFooterProps = {
  children: ReactNode;
  className?: string;
} & ComponentProps<"div">;

function DialogStackFooter({ children, className, ...props }: DialogStackFooterProps) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2 pt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DialogStackNext / DialogStackPrevious
 * -----------------------------------------------------------------------------------------------*/

type DialogStackNavProps = {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
} & ComponentProps<"button">;

function DialogStackNext({
  children,
  className,
  asChild,
  onClick,
  ...props
}: DialogStackNavProps) {
  const { activeIndex, totalDialogs, setActiveIndex } = useDialogStack();

  const handleNext = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (activeIndex < totalDialogs - 1) setActiveIndex(activeIndex + 1);
      onClick?.(e);
    },
    [activeIndex, totalDialogs, setActiveIndex, onClick],
  );

  if (asChild) {
    return (
      <Button
        asChild
        onClick={handleNext}
        className={className}
        disabled={activeIndex >= totalDialogs - 1}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleNext}
      className={className}
      disabled={activeIndex >= totalDialogs - 1}
      {...props}
    >
      {children ?? "Next"}
    </Button>
  );
}

function DialogStackPrevious({
  children,
  className,
  asChild,
  onClick,
  ...props
}: DialogStackNavProps) {
  const { activeIndex, setActiveIndex } = useDialogStack();

  const handlePrevious = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (activeIndex > 0) setActiveIndex(activeIndex - 1);
      onClick?.(e);
    },
    [activeIndex, setActiveIndex, onClick],
  );

  if (asChild) {
    return (
      <Button
        asChild
        onClick={handlePrevious}
        className={className}
        disabled={activeIndex <= 0}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePrevious}
      className={className}
      disabled={activeIndex <= 0}
      {...props}
    >
      {children ?? "Previous"}
    </Button>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

export {
  DialogStackRoot as DialogStack,
  DialogStackTrigger,
  DialogStackOverlay,
  DialogStackBody,
  DialogStackContent,
  DialogStackHeader,
  DialogStackTitle,
  DialogStackDescription,
  DialogStackFooter,
  DialogStackNext,
  DialogStackPrevious,
  type DialogStackRootProps,
  type DialogStackTriggerProps,
  type DialogStackOverlayProps,
  type DialogStackBodyProps,
  type DialogStackContentProps,
  type DialogStackHeaderProps,
  type DialogStackTitleProps,
  type DialogStackDescriptionProps,
  type DialogStackFooterProps,
  type DialogStackNavProps as DialogStackNextProps,
  type DialogStackNavProps as DialogStackPreviousProps,
};
