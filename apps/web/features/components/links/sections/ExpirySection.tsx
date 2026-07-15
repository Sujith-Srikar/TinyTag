"use client";

import { InfoTooltip, Button } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";
import { CalendarClock, X } from "lucide-react";
import styles from "../LinkBuilder.module.scss";
import { useRef } from "react";

export const ExpirySection = () => {
  const {
    watch,
    setValue,
  } = useFormContext<LinkBuilderFields>();

  const expiresAt = watch("expiresAt");
  const enabled = !!expiresAt;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (enabled) {
      setValue("expiresAt", "", { shouldDirty: true });
    } else {
      setValue("expiresAt", "", { shouldDirty: true });
      setTimeout(() => inputRef.current?.showPicker?.(), 50);
    }
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.toggleRow}>
        <div className={styles.toggleLabel}>
          <CalendarClock size={14} className="text-muted-foreground" />
          <span className={styles.toggleLabelTitle}>Expiry</span>
          <InfoTooltip content="Set a date and time after which this link will no longer work. Leave empty for no expiry." />
        </div>

        <Button
          variant={enabled ? "destructive" : "ghost"}
          size="xs"
          type="button"
          onClick={handleToggle}
        >
          {enabled ? (
            <>
              <X size={10} />
              Remove
            </>
          ) : (
            "Add expiry"
          )}
        </Button>
      </div>

      <div className={`${styles.expandWrapper} ${enabled ? styles.expanded : ""}`}>
        <div className={styles.expandInner}>
          <div className={styles.expandContent}>
            <input
              ref={inputRef}
              type="datetime-local"
              className={styles.datetimeInput}
              value={expiresAt ?? ""}
              onChange={(e) =>
                setValue("expiresAt", e.target.value, { shouldDirty: true })
              }
            />
            <span className={styles.hint}>
              Link will stop working after this date and time.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
