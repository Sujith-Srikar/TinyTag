import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useSlugGenerator() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const generateRandomSlug = useCallback(async () => {
    const result = await queryClient.fetchQuery(
      trpc.get.generateAvailableSlug.queryOptions({}),
    );

    return result.data;
  }, [queryClient, trpc]);

  const generateSmartSlug = useCallback(async (destinationUrl: string) => {
    const result = await queryClient.fetchQuery(
      trpc.get.generateAvailableSlug.queryOptions({
        destinationUrl,
      }),
    );

    return result.data;
  }, [queryClient, trpc]); 

  return {
    generateRandomSlug,
    generateSmartSlug,
  };
}