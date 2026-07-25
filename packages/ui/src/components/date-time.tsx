"use client";

import { useState, useEffect, useRef } from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { parseDateTime } from "../lib/parse-datetime";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { TimePicker } from "./time";
import { Input } from "./input";
import { Button } from "./button";

function formatDisplay(date: Date): string {
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

interface DateTimePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Eg. "tomorrow at 5pm" or "in 2 hours"',
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? formatDisplay(value) : "",);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value ? formatDisplay(value) : "");
  }, [value]);

  const handleBlur = () => {
    const text = inputRef.current?.value ?? "";
    if (text.length === 0) {
      setInputValue("");
      onChange?.(null);
      return;
    }
    const parsed = parseDateTime(text);
    if (parsed) {
      onChange?.(parsed);
      setInputValue(formatDisplay(parsed));
    } else {
      setInputValue(value ? formatDisplay(value) : "");
    }
  };

  const handleCalendarSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    const current = value ?? new Date();
    const diff = newDay.getTime() - current.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(current, { days: Math.ceil(diffInDays) });
    onChange?.(newDateFull);
    setInputValue(formatDisplay(newDateFull));
  };

  const handleTimeChange = (d: Date | undefined) => {
    if (!d) return;
    onChange?.(d);
    setInputValue(formatDisplay(d));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              inputRef.current?.blur();
            }
          }}
          placeholder={placeholder}
          className={cn(
            !value && "text-muted-foreground",
            className,
          )}
        />
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 h-4 text-muted-foreground hover:text-foreground"
          >
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={handleCalendarSelect}
        />
        <div className="p-3 border-t border-border">
          <TimePicker date={value ?? undefined} setDate={handleTimeChange} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
