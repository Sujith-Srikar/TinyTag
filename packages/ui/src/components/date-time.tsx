"use client";

import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { TimePicker } from "./time";

interface DateTimePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DateTimePickerProps) {
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!value) {
      onChange?.(newDay);
      return;
    }
    const diff = newDay.getTime() - value.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(value, { days: Math.ceil(diffInDays) });
    onChange?.(newDateFull);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start gap-2 pr-8 text-left font-normal",
              !value && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="size-4 shrink-0" />
            {value ? format(value, "PPP HH:mm:ss") : <span>{placeholder}</span>}
          </Button>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 z-10 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear date"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(d) => handleSelect(d)}
        />
        <div className="p-3 border-t border-border">
          <TimePicker date={value ?? undefined} setDate={(d) => onChange?.(d ?? null)} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
