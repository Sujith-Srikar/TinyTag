import { TRPCError } from "@trpc/server";
import { publicProcedure, createTRPCRouter } from "../init";
import { logger } from "@repo/shared";
import { slugExists, getAllLinks } from "@repo/db";
import { type LinkRecord } from "@repo/shared";
import z from "zod";
import { generateRandomSlug, generateSlugFromUrl } from "@/utils/generate-slug";

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
        tags: ["urls", "get", "all"],
      },
    })
    .query(async () => {
      try {
        const res = await getAllLinks();

        if (!res) return null;

        const mappedResponse: LinkRecord[] = res.map((link) => ({
          destinationUrl: link.destination_url,
          slug: link.slug,
          comments: link.comments ?? undefined,
          tags: link.tags ?? undefined,
          clicksCount: link.clicks_count,
          expiresAt: link.expires_at ?? undefined,
          id: link.id,
          password: link.password_hash ?? undefined,
          isActive: link.is_active,
          createdAt: link.created_at,
        }));

        return mappedResponse;
      } catch (error) {
        logger.error("Error while fetching All Urls:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to Get All Urls",
        });
      }
    }),

  generateAvailableSlug: publicProcedure
    .input(z.object({ destinationUrl: z.string().optional() }))
    .query(async (opts) => {
      let prevSlugs: string[] = ['dashboard'];
      while (true) {
        const slug = opts.input.destinationUrl
          ? generateSlugFromUrl(opts.input.destinationUrl)
          : generateRandomSlug();

        if(prevSlugs.includes(slug)){
          continue;
        }

        const res = await slugExists(slug);
        if (!res) {
          return { data: slug };
        }
        prevSlugs.push(slug);
      }
    }),

  validateSlugAvailability: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async (opts) => {
      console.log('Vaidate slug availability:', opts.input.slug);
      const res = await slugExists(opts.input.slug);

      if (res) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Slug already exists",
        });
      }

      return { error: null };
    }),
});
