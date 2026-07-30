"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { Button } from "@repo/ui";

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard write failure is non-critical
    }
  };

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={handleCopy}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={copied ? "check" : "copy"}
          initial={{
            scale: 0.6,
            opacity: 0,
            rotate: -20,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: 0,
          }}
          exit={{
            scale: 0.6,
            opacity: 0,
            rotate: 20,
          }}
          transition={{
            duration: 0.12,
          }}
        >
          {copied ? (
            <Check size={14} />
          ) : (
            <Copy size={14} />
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}