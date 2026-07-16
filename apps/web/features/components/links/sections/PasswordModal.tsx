"use client";

import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";
import { Button } from "@repo/ui";
import { Eye, EyeOff, Dices, X, Shield } from "lucide-react";
import styles from "../LinkBuilder.module.scss";

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const specials = "!@#$%&*";
  let pw = "";
  for (let i = 0; i < 16; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  const pos = Math.floor(Math.random() * (pw.length - 1)) + 1;
  pw =
    pw.slice(0, pos) +
    specials[Math.floor(Math.random() * specials.length)] +
    pw.slice(pos);
  return pw;
}

interface PasswordModalProps {
  onClose: () => void;
}

export const PasswordModal = ({ onClose }: PasswordModalProps) => {
  const { watch, setValue } = useFormContext<LinkBuilderFields>();
  const currentPassword = watch("password");
  const [draft, setDraft] = useState(currentPassword ?? "");
  const [visible, setVisible] = useState(false);

  const handleGenerate = useCallback(() => {
    setDraft(generatePassword());
    setVisible(true);
  }, []);

  const handleConfirm = () => {
    setValue("password", draft, { shouldDirty: true });
    onClose();
  };

  const handleRemove = () => {
    setValue("password", "", { shouldDirty: true });
    onClose();
  };

  return (
    <div className={styles.subModalOverlay} onClick={onClose}>
      <div
        className={styles.subModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Password protection"
      >
        <div className={styles.subModalHeader}>
          <div className={styles.subModalTitle}>
            <Shield size={14} />
            <span>Password Protection</span>
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
          <div className={styles.passwordInputRow}>
            <input
              type={visible ? "text" : "password"}
              placeholder="Enter a password"
              autoComplete="off"
              className={styles.passwordInput}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
              }}
              autoFocus
            />
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleGenerate}
              aria-label="Generate random password"
              title="Generate random password"
            >
              <Dices size={14} />
            </button>
          </div>
          <span className={styles.hint}>
            Only you can view or change this password.
          </span>
        </div>

        <div className={styles.subModalFooter}>
          {currentPassword && (
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
