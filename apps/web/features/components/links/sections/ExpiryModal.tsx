"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";
import { Button } from "@repo/ui";
import { X, CalendarClock } from "lucide-react";
import styles from "../LinkBuilder.module.scss";

interface ExpiryModalProps {
  onClose: () => void;
}

export const ExpiryModal = ({ onClose }: ExpiryModalProps) => {
  const { watch, setValue } = useFormContext<LinkBuilderFields>();
  const currentExpiry = watch("expiresAt");
  const [draft, setDraft] = useState(currentExpiry ?? "");

  const handleConfirm = () => {
    setValue("expiresAt", draft, { shouldDirty: true });
    onClose();
  };

  const handleRemove = () => {
    setValue("expiresAt", "", { shouldDirty: true });
    onClose();
  };

  return (
    <div className={styles.subModalOverlay} onClick={onClose}>
      <div
        className={styles.subModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Link expiration"
      >
        <div className={styles.subModalHeader}>
          <div className={styles.subModalTitle}>
            <CalendarClock size={14} />
            <span>Link Expiration</span>
          </div>
          <button
            type="button"
            className={styles.subModalClose}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className={styles.subModalBody}>
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
        </div>

        <div className={styles.subModalFooter}>
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
          <div className={styles.subModalFooterRight}>
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="button" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
