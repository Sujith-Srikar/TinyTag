"use client";

import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@/types/linkBuilder";
import { Button, Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter } from "@repo/ui";
import { Eye, EyeOff, Dices, Shield } from "lucide-react";
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
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }} variant="sub">
      <DialogContent size="sm">
        <DialogHeader
          title="Password Protection"
          onClose={onClose}
          icon={<Shield size={18} />}
        />

        <DialogBody>
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
        </DialogBody>

        <DialogFooter className="justify-between">
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
