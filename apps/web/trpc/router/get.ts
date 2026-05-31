import { TRPCError } from "@trpc/server";
import { publicProcedure, createTRPCRouter } from "../init";
import { logger } from "@repo/shared";
import { getAllLinks } from "@repo/db";
import { type LinkRecord } from "@repo/shared";

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

  getAllUrls: publicProcedure
    .meta({
      name: "Get All Urls",
      docs: {
        description: "Fetch All Urls for a particular User",
        tags: ["urls", 'get', 'all'],
      },
    })
    .query(async () => {
      try {
        const res = await getAllLinks();

        if(!res) return null;

        const mappedResponse: LinkRecord[] = res.map((link) => ({
          destinationUrl: link.destination_url,
          slug: link.slug,
          comments: link.comments,
          tags: link.tags,
          clicksCount: link.clicks_count,
          expiresAt: link.expires_at,
          id: link.id,
          password: link.password_hash,
          isActive: link.is_active,
          createdAt: link.created_at
        }))

        return mappedResponse;
      } catch (error) {
        logger.error("Error while fetching All Urls:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to Get All Urls",
        });
      }
    }),
});
