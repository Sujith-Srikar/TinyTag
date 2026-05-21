import { TRPCError } from "@trpc/server";
import { publicProcedure, createTRPCRouter } from "../init";
import { logger } from "@repo/shared";

export const getRouter = createTRPCRouter({
  health: publicProcedure
    .meta({
      name: "Health Check",
      docs: {
        description: "Checks server health",
        tags: ["System"],
      },
    })
    .query(() => {
      try {
        return {
          success: true,
          message: "OK",
        };
      } catch (error) {
        logger.error("Server is not healthy", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
