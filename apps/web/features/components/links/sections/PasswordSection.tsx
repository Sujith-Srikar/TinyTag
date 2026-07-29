"use client";

import {
  Button, Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Field,
  FieldLabel,
  Input,
  InfoTooltip,
} from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { LinkBuilderFields } from "@repo/shared";
import { KeyRound, Eye, EyeOff, Sparkles } from "lucide-react";
import styles from "../LinkBuilder.module.scss";
import { useState, useEffect } from "react";
import { useLinkBuilderStore } from "@/hooks/useLinkBuilder";

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

const MASK_PLACEHOLDER = generatePassword();

export const PasswordSection = () => {

  const { watch, setValue, register } = useFormContext<LinkBuilderFields>();
  const { selectedLink } = useLinkBuilderStore();
  const [open, setOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [masked, setMasked] = useState<boolean>(false);
  const currentPw = watch('password');
  const hasExistingPassword = selectedLink?.hasPassword && !currentPw;

  useEffect(() => {
    if (masked) {
      setValue('password', MASK_PLACEHOLDER);
    }
  }, [masked, setValue]);

  const handleOpen = () => {
    if (selectedLink?.hasPassword) {
      setMasked(true);
      setIsVisible(false);
    }
    setOpen(true);
  };

  const handleRemove = () => {
    setValue('password', null, { shouldDirty: true });
    setMasked(false);
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
  };

  const handleMaskFocus = () => {
    if (masked) {
      setMasked(false);
      setValue('password', undefined, { shouldDirty: true });
    }
  };

  const handleGeneratePassword = () => {
    const pw = generatePassword();
    setValue('password', pw, { shouldDirty: true });
    setMasked(false);
    setIsVisible(true);
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
        <KeyRound size={14} />
        {hasExistingPassword ? "Password set" : "Password"}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) {
            setMasked(false);
            setOpen(false);
          }
        }}
        variant="sub"
      >
        <DialogContent size="sm">
          <DialogHeader
            title="Link Password"
            onClose={() => setOpen(false)}
            icon={<KeyRound size={18} />}
          />

          <DialogBody>
            <Field>
              <div className={styles.shortLinkHeaderRow}>
                <div className={styles.labelWithTooltip}>
                  <FieldLabel>Password</FieldLabel>
                  {masked && (
                    <InfoTooltip content="The current password can't be viewed because it is securely stored. Enter a new password to replace it, or leave this field unchanged to keep the existing password." />
                  )}
                </div>
                <div className={styles.shortLinkActions}>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setIsVisible((prev) => !prev)}
                    disabled={masked}
                    aria-label="Toggle Visibility"
                    title="Toggle Visibility"
                  >
                    {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleGeneratePassword}
                    aria-label="Generate password"
                    title="Generate password"
                  >
                    <Sparkles size={12} />
                  </Button>
                </div>
              </div>
              <Input
                id='pw'
                type={masked || !isVisible ? 'password' : 'text'}
                placeholder="Enter Password"
                onFocus={masked ? handleMaskFocus : undefined}
                {...register('password')}
              />
            </Field>
          </DialogBody>

          <DialogFooter className="justify-between">
            {(currentPw || (selectedLink?.hasPassword && !masked)) && (
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
};
