"use client";

import { InfoTooltip, Button } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@repo/shared";
import { Shield, Eye, EyeOff, X, Dices } from "lucide-react";
import styles from "../LinkBuilder.module.scss";
import { useState, useCallback } from "react";

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const specials = "!@#$%&*";
  let pw = "";
  for (let i = 0; i < 16; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  const pos = Math.floor(Math.random() * (pw.length - 1)) + 1;
  pw = pw.slice(0, pos) + specials[Math.floor(Math.random() * specials.length)] + pw.slice(pos);
  return pw;
}

export const PasswordSection = () => {
  const {
    watch,
    setValue,
  } = useFormContext<LinkBuilderFields>();

  const password = watch("password");
  const enabled = !!password;
  const [visible, setVisible] = useState(false);

  const handleToggle = () => {
    if (enabled) {
      setValue("password", "", { shouldDirty: true });
      setVisible(false);
    }
  };

  const handleGenerate = useCallback(() => {
    setValue("password", generatePassword(), { shouldDirty: true });
    setVisible(true);
  }, [setValue]);

  return (
    <div className={styles.sectionCard}>
      <div className={styles.toggleRow}>
        <div className={styles.toggleLabel}>
          <Shield size={14} className="text-muted-foreground" />
          <span className={styles.toggleLabelTitle}>Password</span>
          <InfoTooltip content="Protect this link with a password. Only you can view or change it later." />
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
            "Add password"
          )}
        </Button>
      </div>

      <div className={`${styles.expandWrapper} ${enabled ? styles.expanded : ""}`}>
        <div className={styles.expandInner}>
          <div className={`${styles.expandContent} ${styles.fadeIn}`}>
            <div className={styles.inputWithActions}>
              <input
                type={visible ? "text" : "password"}
                placeholder="Enter a password"
                autoComplete="off"
                className={styles.passwordInput}
                value={password ?? ""}
                onChange={(e) =>
                  setValue("password", e.target.value, { shouldDirty: true })
                }
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
              You can view or change this password later from the link settings.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
