// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
// import { getHours, getMinutes, setHours, setMinutes } from "date-fns";
// import { Button } from "@repo/ui/components/button";
// import { Calendar } from "@repo/ui/components/calendar";
// import { Label } from "@repo/ui/components/label";

// interface DateTimePickerProps {
//   value?: Date | null;
//   onChange?: (date: Date | null) => void;
//   label?: string;
//   description?: string;
//   placeholder?: string;
//   clearLabel?: string;
//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
//   autoOpen?: boolean;
// }

// export function DateTimeField({
//   value,
//   onChange,
//   label = "Pick a date and time",
//   description,
//   placeholder = "Select date & time…",
//   clearLabel = "Clear",
//   open: controlledOpen,
//   onOpenChange,
//   autoOpen,
// }: DateTimePickerProps) {
//   const [internalOpen, setInternalOpen] = useState(false);
//   const [draft, setDraft] = useState<Date | null>(value ?? null);
//   const [mounted, setMounted] = useState(false);
//   const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const isOpen = controlledOpen ?? internalOpen;
//   const setOpen = useCallback(
//     (next: boolean) => {
//       onOpenChange?.(next);
//       setInternalOpen(next);
//     },
//     [onOpenChange],
//   );

//   useEffect(() => {
//     setDraft(value ?? null);
//   }, [value]);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (autoOpen && mounted) {
//       setOpen(true);
//     }
//   }, [autoOpen, mounted, setOpen]);

//   useEffect(() => {
//     if (!isOpen) return;

//     const compute = () => {
//       const trigger = containerRef.current;
//       if (!trigger) return;
//       const rect = trigger.getBoundingClientRect();
//       const spaceBelow = window.innerHeight - rect.bottom;
//       const DROPDOWN_HEIGHT = 380;
//       setDropdownPos({
//         top: spaceBelow > DROPDOWN_HEIGHT + 8 ? rect.bottom + 4 : rect.top - DROPDOWN_HEIGHT - 4,
//         left: rect.left,
//         width: rect.width,
//       });
//     };

//     compute();
//     window.addEventListener("resize", compute);
//     return () => window.removeEventListener("resize", compute);
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen) return;

//     const handle = (e: MouseEvent) => {
//       const target = e.target as Node;
//       if (containerRef.current?.contains(target)) return;
//       if (dropdownRef.current?.contains(target)) return;
//       setOpen(false);
//     };

//     document.addEventListener("mousedown", handle);
//     return () => document.removeEventListener("mousedown", handle);
//   }, [isOpen, setOpen]);

//   const toggleDropdown = useCallback(() => {
//     setOpen(!isOpen);
//   }, [isOpen, setOpen]);

//   const selectDate = useCallback((d: Date | undefined) => {
//     if (!d) return;
//     setDraft((prev) => {
//       const base = prev ?? new Date();
//       return setMinutes(setHours(d, getHours(base)), getMinutes(base));
//     });
//   }, []);

//   const selectTime = useCallback((h: number, m: number) => {
//     setDraft((prev) => {
//       const base = prev ?? new Date();
//       return setMinutes(setHours(base, h), m);
//     });
//   }, []);

//   const confirm = useCallback(() => {
//     onChange?.(draft);
//     setOpen(false);
//   }, [draft, onChange, setOpen]);

//   const clear = useCallback(() => {
//     setDraft(null);
//     onChange?.(null);
//     setOpen(false);
//   }, [onChange, setOpen]);

//   const formatted = value
//     ? `${value.toLocaleDateString()} ${value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
//     : "";

//   return (
//     <div ref={containerRef} className="relative w-full">
//       {label && <Label className="mb-1.5 block text-sm font-medium">{label}</Label>}
//       Fi

//       <Button
//         onClick={toggleDropdown}
//         className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-left text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
//       >
//         <span className="flex-1 truncate">{formatted || placeholder}</span>
//         <CalendarIcon className="size-4 shrink-0 text-[var(--text-secondary)]" />
//       </Button>

//       {description && <p className="mt-1 text-xs text-[var(--text-secondary)]">{description}</p>}

//       {isOpen &&
//         mounted &&
//         createPortal(
//           <div
//             ref={dropdownRef}
//             role="dialog"
//             aria-label="Pick date and time"
//             className="border-input bg-popover text-popover-foreground z-50 overflow-hidden rounded-lg border shadow-xl"
//             style={{
//               position: "fixed",
//               top: dropdownPos?.top ?? 0,
//               left: dropdownPos?.left ?? 0,
//               width: dropdownPos?.width ?? 280,
//             }}
//             onMouseDown={(e) => e.stopPropagation()}
//           >
//             <div className="bg-muted/50 p-3 pb-0">
//               <Calendar mode="single" selected={draft ?? undefined} onSelect={selectDate} className="w-full" />
//             </div>

//             <div className="border-t border-[var(--border-default)] px-3 pt-2">
//               <div className="flex items-center gap-2 pb-3">
//                 <Clock className="size-4 text-[var(--text-secondary)]" />
//                 <TimePicker value={draft} onChange={selectTime} />
//               </div>
//             </div>
//           </div>,
//           document.body,
//         )}
//     </div>
//   );
// }

// interface TimePickerProps {
//   value?: Date | null;
//   onChange: (hours: number, minutes: number) => void;
// }

// function TimePicker({ value, onChange }: TimePickerProps) {
//   const hours = value ? getHours(value) : new Date().getHours();
//   const minutes = value ? getMinutes(value) : 0;

//   return (
//     <div className="flex items-center gap-2">
//       <select
//         value={hours}
//         onChange={(e) => onChange(Number(e.target.value), minutes)}
//         className="h-8 flex-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-2 text-sm text-[var(--text-primary)] focus:border-[var(--ring)] focus:outline-none"
//       >
//         {Array.from({ length: 24 }, (_, i) => (
//           <option key={i} value={i}>
//             {String(i).padStart(2, "0")}
//           </option>
//         ))}
//       </select>
//       <span className="text-[var(--text-secondary)]">:</span>
//       <select
//         value={minutes}
//         onChange={(e) => onChange(hours, Number(e.target.value))}
//         className="h-8 flex-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-2 text-sm text-[var(--text-primary)] focus:border-[var(--ring)] focus:outline-none"
//       >
//         {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
//           <option key={m} value={m}>
//             {String(m).padStart(2, "0")}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

import { Input } from "./input";

import { cn } from "../lib/utils";
import React from "react";
import {
  Period,
  TimePickerType,
  getArrowByType,
  getDateByType,
  setDateByType,
} from "../lib/time-picker-utils";

export interface TimePickerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  period?: Period;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  TimePickerInputProps
>(
  (
    {
      className,
      type = "tel",
      value,
      id,
      name,
      date = new Date(new Date().setHours(0, 0, 0, 0)),
      setDate,
      onChange,
      onKeyDown,
      picker,
      period,
      onLeftFocus,
      onRightFocus,
      ...props
    },
    ref,
  ) => {
    const [flag, setFlag] = React.useState<boolean>(false);
    const [prevIntKey, setPrevIntKey] = React.useState<string>("0");

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    React.useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [flag]);

    const calculatedValue = React.useMemo(() => {
      return getDateByType(date, picker);
    }, [date, picker]);

    const calculateNewValue = (key: string) => {
      /*
       * If picker is '12hours' and the first digit is 0, then the second digit is automatically set to 1.
       * The second entered digit will break the condition and the value will be set to 10-12.
       */
      if (picker === "12hours") {
        if (flag && calculatedValue.slice(1, 2) === "1" && prevIntKey === "0")
          return "0" + key;
      }

      return !flag ? "0" + key : calculatedValue.slice(1, 2) + key;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") return;
      e.preventDefault();
      if (e.key === "ArrowRight") onRightFocus?.();
      if (e.key === "ArrowLeft") onLeftFocus?.();
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        const step = e.key === "ArrowUp" ? 1 : -1;
        const newValue = getArrowByType(calculatedValue, step, picker);
        if (flag) setFlag(false);
        const tempDate = new Date(date);
        setDate(setDateByType(tempDate, newValue, picker, period));
      }
      if (e.key >= "0" && e.key <= "9") {
        if (picker === "12hours") setPrevIntKey(e.key);

        const newValue = calculateNewValue(e.key);
        if (flag) onRightFocus?.();
        setFlag((prev) => !prev);
        const tempDate = new Date(date);
        setDate(setDateByType(tempDate, newValue, picker, period));
      }
    };

    return (
      <Input
        ref={ref}
        id={id || picker}
        name={name || picker}
        className={cn(
          "w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:border-[var(--brand-accent)] focus:text-[var(--brand-accent)] [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
        value={value || calculatedValue}
        onChange={(e) => {
          e.preventDefault();
          onChange?.(e);
        }}
        type={type}
        inputMode="decimal"
        onKeyDown={(e) => {
          onKeyDown?.(e);
          handleKeyDown(e);
        }}
        {...props}
      />
    );
  },
);

TimePickerInput.displayName = "TimePickerInput";

export { TimePickerInput };

import { Clock } from "lucide-react";
import { Label } from "./label";


interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;

  showSeconds?: boolean;
}

export function TimePicker({
  date,
  setDate,
  showSeconds = true,
}: TimePickerProps) {
  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours">Hours</Label>

        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>

      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes">Minutes</Label>

        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() =>
            showSeconds ? secondRef.current?.focus() : undefined
          }
        />
      </div>

      {showSeconds && (
        <div className="grid gap-1 text-center">
          <Label htmlFor="seconds">Seconds</Label>

          <TimePickerInput
            picker="seconds"
            date={date}
            setDate={setDate}
            ref={secondRef}
            onLeftFocus={() => minuteRef.current?.focus()}
          />
        </div>
      )}

      <div className="flex h-8 items-center">
        <Clock className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}