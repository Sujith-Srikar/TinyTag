"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@repo/shared";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DateTimePicker,
  Field,
  FieldLabel,
  getExpiryInfo
} from "@repo/ui";
import { CalendarClock } from "lucide-react";

export function ExpirySection() {
  const { watch, setValue } = useFormContext<LinkBuilderFields>();
  const [open, setOpen] = useState(false);

  const currentExpiry = watch("expiresAt");
  const value =
    currentExpiry instanceof Date
      ? currentExpiry
      : currentExpiry
        ? new Date(currentExpiry)
        : undefined;

  const [draft, setDraft] = useState<Date | null>(value ?? null);

  const handleOpen = () => {
    setDraft(value ?? null);
    setOpen(true);
  };

  const handleConfirm = () => {
    setValue("expiresAt", draft ?? undefined, { shouldDirty: true });
    setOpen(false);
  };

  const handleRemove = () => {
    setValue("expiresAt", undefined, { shouldDirty: true });
    setDraft(null);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={handleOpen}
        className="gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <CalendarClock size={14} />
        {value ? getExpiryInfo(value).label : "Set expiration"}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) setOpen(false);
        }}
        variant="sub"
      >
        <DialogContent size="sm">
          <DialogHeader
            title="Link Expiration"
            onClose={() => setOpen(false)}
            icon={<CalendarClock size={18} />}
          />

          <DialogBody>
            <Field>
              <FieldLabel>Date & Time</FieldLabel>
              <DateTimePicker value={draft} onChange={setDraft} />
            </Field>
          </DialogBody>

          <DialogFooter className="justify-between">
            {currentExpiry && (
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={handleRemove}
              >
                Remove
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" type="button" onClick={handleConfirm}>
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
