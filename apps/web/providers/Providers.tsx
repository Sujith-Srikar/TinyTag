"use client";

import { ReactNode } from "react";

import { ThemeProvider } from "./ThemeProvider";
import { AppTRPCProvider } from "./TRPCProvider";
import { TooltipProvider } from "@repo/ui";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <AppTRPCProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </AppTRPCProvider>
    </ThemeProvider>
  );
}
