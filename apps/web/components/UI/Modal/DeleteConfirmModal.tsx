"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui";
import { type LinkRecord } from "@/utils/mock-data";
import styles from "./DeleteConfirmModal.module.scss";

interface DeleteConfirmModalProps {
  open: boolean;
  link?: LinkRecord | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  open,
  link,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open || !link) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 500));
    setDeleting(false);
    onConfirm();
  };

  return (
    <div
      className={styles.root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div className={styles.backdrop} onClick={onCancel} aria-hidden="true" />

      <div className={styles.dialog}>
        <div className={styles.iconWrap}>
          <svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
            <path
              d="M12 9v4M12 17h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className={styles.title} id="delete-title">
          Delete link?
        </h2>
        <p className={styles.body}>
          <span className={styles.slug}>/{link.slug}</span> will be permanently
          deleted. This action cannot be undone.
        </p>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
