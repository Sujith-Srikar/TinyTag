"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { TRPCProvider, makeTRPCClient, makeQueryClient } from "../trpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  const [trpcClient] = useState(makeTRPCClient);

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
