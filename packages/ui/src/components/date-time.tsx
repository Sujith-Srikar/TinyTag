"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarClock, CalendarIcon, Clock } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Calendar } from "./calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  type DialogSize,
} from "./modal";
import { cn } from "../lib/utils";

/**
 * DateTimeField
 * ─────────────
 * DateTimeField
 * ├── Read-only Input        (committed value only, never the draft)
 * ├── Calendar Icon          (same click target as the input)
 * └── DateTimeDialog
 *     ├── Calendar           (existing component, reused as-is)
 *     ├── Time Picker        (24h — the one genuinely custom piece)
 *     ├── Remove Expiration  (disabled until a draft exists)
 *     ├── Cancel             (discards draft)
 *     └── Save               (commits draft -> value)
 *
 * State model: exactly two pieces of state.
 *   value  — committed, what the input displays.
 *   draft  — local to the open dialog, seeded from `value` on open,
 *            thrown away on Cancel/outside-click/Escape (all three just
 *            close the Dialog without ever calling onChange).
 *
 * No Popover, no manual positioning, no second floating layer — the
 * Dialog *is* the editor, so there's nothing else to keep in sync.
 */

export interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  clearLabel?: string;
  size?: DialogSize;
  disabledDates?: (date: Date) => boolean;
  disabled?: boolean;
  className?: string;
  /** Formats the committed value for the input. Default: "MMM d, yyyy • HH:mm". */
  formatValue?: (date: Date) => string;
  /** Validation message shown under the input, if any. */
  error?: string;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Applies `day`'s date with `ref`'s time-of-day, defaulting to 00:00. */
export function withTimeOf(day: Date, ref?: Date): Date {
  const next = new Date(day);
  next.setHours(ref?.getHours() ?? 0, ref?.getMinutes() ?? 0, 0, 0);
  return next;
}

function defaultFormat(date: Date) {
  return format(date, "MMM d, yyyy '•' HH:mm");
}

// ─── Time picker (24h, keyboard accessible) ────────────────────────────────

function TimeUnitInput({
  value,
  onCommit,
  onStep,
  ariaLabel,
  max,
}: {
  value: number;
  onCommit: (n: number) => void;
  onStep: (dir: 1 | -1) => void;
  ariaLabel: string;
  max: number;
}) {
  const [draft, setDraft] = React.useState(String(value).padStart(2, "0"));

  React.useEffect(() => {
    setDraft(String(value).padStart(2, "0"));
  }, [value]);

  return (
    <input
      role="spinbutton"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      inputMode="numeric"
      maxLength={2}
      value={draft}
      onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(-2))}
      onBlur={() => onCommit(clamp(parseInt(draft || "0", 10), 0, max))}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onCommit(clamp(parseInt(draft || "0", 10), 0, max));
          (e.target as HTMLInputElement).blur();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          onStep(1);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          onStep(-1);
        }
      }}
      className={cn(
        "h-8 w-8 rounded-[6px] bg-transparent text-center font-mono text-sm tabular-nums text-foreground outline-none",
        "transition-colors duration-[120ms] ease-out hover:bg-muted focus:bg-[#e8ffaa]",
      )}
    />
  );
}

function TimePicker({
  date,
  onChange,
  className,
}: {
  date: Date;
  onChange: (next: Date) => void;
  className?: string;
}) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const setTime = (h: number, m: number) => {
    const next = new Date(date);
    next.setHours(h, m, 0, 0);
    onChange(next);
  };

  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 rounded-[10px] border border-border px-3 py-2",
        className,
      )}
    >
      <Clock
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-muted-foreground"
      />
      <TimeUnitInput
        ariaLabel="Hours"
        value={hours}
        max={23}
        onStep={(dir) => setTime((hours + dir + 24) % 24, minutes)}
        onCommit={(n) => setTime(n, minutes)}
      />
      <span className="font-mono text-sm text-muted-foreground">:</span>
      <TimeUnitInput
        ariaLabel="Minutes"
        value={minutes}
        max={59}
        onStep={(dir) => setTime(hours, (minutes + dir + 60) % 60)}
        onCommit={(n) => setTime(hours, n)}
      />
    </div>
  );
}

// ─── Dialog (editor for the draft only) ────────────────────────────────────

function DateTimeDialog({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  onSave,
  onClear,
  label,
  description,
  clearLabel,
  size,
  disabledDates,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Date | undefined;
  onDraftChange: (d: Date | undefined) => void;
  onSave: () => void;
  onClear: () => void;
  label: string;
  description?: string;
  clearLabel: string;
  size: DialogSize;
  disabledDates?: (date: Date) => boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size={size}>
        <DialogHeader
          title={label}
          description={description}
          onClose={() => onOpenChange(false)}
          icon={<CalendarClock size={18} />}
        />

        <DialogBody className="items-center">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-center">
            <Calendar
              mode="single"
              selected={draft}
              disabled={disabledDates}
              defaultMonth={draft ?? new Date()}
              onSelect={(day) => {
                if (!day) return;
                onDraftChange(withTimeOf(day, draft));
              }}
            />
            <TimePicker
              date={draft ?? withTimeOf(new Date())}
              onChange={onDraftChange}
              className="md:mt-2"
            />
          </div>
        </DialogBody>

        <DialogFooter className="justify-between">
          <Button
            variant="destructive"
            size="sm"
            type="button"
            disabled={!draft}
            onClick={onClear}
          >
            {clearLabel}
          </Button>
          <div className="ml-auto flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button size="sm" type="button" disabled={!draft} onClick={onSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── DateTimeField ──────────────────────────────────────────────────────

export function DateTimeField({
  value,
  onChange,
  label = "Select date & time",
  description,
  placeholder = "Pick a date & time",
  clearLabel = "Clear",
  size = "sm",
  disabledDates,
  disabled,
  className,
  formatValue = defaultFormat,
  error,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Date | undefined>(value);

  // Every time the dialog opens, re-seed the draft from the committed
  // value — this is the only place `draft` is set from `value`.
  React.useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const openDialog = () => {
    if (!disabled) setOpen(true);
  };

  return (
    <div className={className}>
      <div className="relative">
        <button
          type="button"
          aria-label="Open date picker"
          disabled={disabled}
          onClick={openDialog}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground disabled:opacity-50"
        >
          <CalendarIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        <Input
          readOnly
          disabled={disabled}
          value={value ? formatValue(value) : ""}
          placeholder={placeholder}
          onClick={openDialog}
          aria-haspopup="dialog"
          className={cn("cursor-pointer pl-9", value && "font-mono")}
        />
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-normal text-destructive">
          {error}
        </p>
      )}

      <DateTimeDialog
        open={open}
        onOpenChange={setOpen}
        draft={draft}
        onDraftChange={setDraft}
        onSave={() => {
          onChange(draft);
          setOpen(false);
        }}
        onClear={() => {
          onChange(undefined);
          setOpen(false);
        }}
        label={label}
        description={description}
        clearLabel={clearLabel}
        size={size}
        disabledDates={disabledDates}
      />
    </div>
  );
}