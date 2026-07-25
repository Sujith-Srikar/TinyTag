import { TRPCError } from "@trpc/server";
import { publicProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { logger, RESERVED_SLUGS } from "@repo/shared";
import { slugExists, getMyLinks } from "@repo/db";
import { type LinkRecord } from "@repo/shared";
import z from "zod";
import { generateRandomSlug, generateSlugFromUrl } from "@/utils/generate-slug";

const isReserved = (slug: string) => {
  return RESERVED_SLUGS.has(slug.trim().toLowerCase());
};

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

  getMyUrls: protectedProcedure
    .meta({
      name: "Get User Specific Urls",
      docs: {
        description: "Fetch All Urls for a particular User",
        tags: ["urls", "get", "all"],
        auth: true,
      },
    })
    .query(async ({ ctx }) => {
      try {
        const res = await getMyLinks(ctx.supabase);

        const mappedResponse: LinkRecord[] = res.map((link) => ({
          id: link.id,
          slug: link.slug,
          destinationUrl: link.destination_url,
          clicksCount: link.clicks_count,
          expiresAt: link.expires_at,
          createdAt: link.created_at,
          isActive: link.is_active,
          hasPassword: link.has_password,
          comments: link.comments ?? undefined,
          tags: link.tags ?? undefined,
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

  getMe: protectedProcedure
    .meta({
      name: "Get Current User",
      docs: {
        description:
          "Returns information about the currently authenticated user.h",
        tags: ["Authentication", "User"],
        auth: true,
      },
    })
    .query((opts) => {
      const user = opts.ctx.user;
      return user;
    }),

  generateAvailableSlug: publicProcedure
    .meta({
      name: "Generate Available Slug",
      docs: {
        description:
          "Generates a unique slug that is not currently in use. If a destination URL is provided, the slug is derived from the URL and adjusted until an available value is found.",
        tags: ["urls", "generation", "slug", "get"],
      },
    })
    .input(z.object({ destinationUrl: z.string().optional() }))
    .query(async (opts) => {
      const MAX_ATTEMPTS = 20;
      const prevSlugs: string[] = [];
      let attempts = 0;
      while (attempts < MAX_ATTEMPTS) {
        attempts++;
        const slug = opts.input.destinationUrl
          ? generateSlugFromUrl(opts.input.destinationUrl)
          : generateRandomSlug();

        if (prevSlugs.includes(slug) || isReserved(slug)) {
          continue;
        }

        const res = await slugExists(slug);
        if (!res) {
          return { data: slug };
        }
        prevSlugs.push(slug);
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate available slug after multiple attempts",
      });
    }),

  validateSlugAvailability: publicProcedure
    .meta({
      name: "Validate Slug Availability",
      docs: {
        description:
          "Checks whether a slug is available for use. Returns success if the slug is unused, otherwise throws a CONFLICT error.",
        tags: ["urls", "get", "slug", "validation"],
      },
    })
    .input(z.object({ slug: z.string() }))
    .query(async (opts) => {
      
      if (isReserved(opts.input.slug)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Slug already exists",
        });
      }

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
