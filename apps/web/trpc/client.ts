"use client";

import { QueryClient } from "@tanstack/react-query";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { AppRouter } from "./router/app";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const makeQueryClient = () => {
  return new QueryClient();
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export function makeTRPCClient(){
    return createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    });
}
