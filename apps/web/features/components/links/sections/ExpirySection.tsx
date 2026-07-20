"use client";

import { DateTimeField } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";

function formatExpiry(date: Date): string {
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / 86_400_000);

  if (diffDays <= 0) return "Expired";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `Expires in ${diffDays} days`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

const isPastDate = (date: Date) =>
  date < new Date(new Date().setHours(0, 0, 0, 0));

export function ExpirySection() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<LinkBuilderFields>();

  const expiresAt = watch("expiresAt");
  const value =
    expiresAt instanceof Date
      ? expiresAt
      : expiresAt
        ? new Date(expiresAt)
        : undefined;

  return (
    <DateTimeField
      value={value}
      onChange={(date) => setValue("expiresAt", date, { shouldDirty: true })}
      label="Link Expiration"
      description="Automatically disable this link after a specific date and time."
      placeholder="Expiration"
      clearLabel="Remove Expiration"
      disabledDates={isPastDate}
      formatValue={formatExpiry}
      error={errors.expiresAt?.message as string | undefined}
    />
  );
}