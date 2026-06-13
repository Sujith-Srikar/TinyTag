import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

export function useSlugGenerator() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const generateRandomSlug = async () => {
    const result = await queryClient.fetchQuery(
      trpc.get.generateAvailableSlug.queryOptions({}),
    );

    return result.data;
  };

  const generateSmartSlug = async (destinationUrl: string) => {
    const result = await queryClient.fetchQuery(
      trpc.get.generateAvailableSlug.queryOptions({
        destinationUrl,
      }),
    );

    return result.data;
  };

  return {
    generateRandomSlug,
    generateSmartSlug,
  };
}