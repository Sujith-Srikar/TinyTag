"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@repo/ui";
import { CalendarClock } from "lucide-react";
import styles from "../LinkBuilder.module.scss";

interface ExpiryModalProps {
  onClose: () => void;
}

function dateToLocalString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

function localStringToDate(value: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export const ExpiryModal = ({ onClose }: ExpiryModalProps) => {
  const { watch, setValue } = useFormContext<LinkBuilderFields>();
  const currentExpiry = watch("expiresAt");
  const [draft, setDraft] = useState(
    currentExpiry instanceof Date ? dateToLocalString(currentExpiry) : "",
  );

  const handleConfirm = () => {
    const date = localStringToDate(draft);
    setValue("expiresAt", date, { shouldDirty: true });
    onClose();
  };

  const handleRemove = () => {
    setValue("expiresAt", undefined, { shouldDirty: true });
    onClose();
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      variant="sub"
    >
      <DialogContent size="sm">
        <DialogHeader
          title="Link Expiration"
          onClose={onClose}
          icon={<CalendarClock size={18} />}
        />

        <DialogBody>
          <input
            type="datetime-local"
            className={styles.datetimeInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <span className={styles.hint}>
            Link will stop working after this date and time.
          </span>
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
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="button" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
