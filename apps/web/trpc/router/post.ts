import { TRPCError } from "@trpc/server";
import { publicProcedure, createTRPCRouter } from "../init";
import { logger } from "@repo/shared";
import { z } from "zod";
import { create_short_url, edit_long_url } from "@repo/db";
import { generateSlug } from "../../utils/generate-slug";

export const postRouter = createTRPCRouter({
  shortenUrl: publicProcedure
    .meta({
      name: "Create Short URL",
      docs: {
        description:
          "Creates and stores a shortened URL with collision-safe slug generation.",
        tags: ["urls", "shortener", "links"],
      },
    })
    .input(
      z.object({
        customAlias: z.string().optional(),
        longUrl: z.url(),
      }),
    )
    .mutation(async (opts) => {
      try {
        for (let i = 0; i < 2; i++) {
          const slug: string = opts.input.customAlias ?? generateSlug();

          const error = await create_short_url(slug, opts.input.longUrl);

          if (!error) {
            return {
              success: true,
              message: "ShortUrl Created Successfully",
              slug,
            };
          }

          if (error.code === "23505") {
            continue;
          }

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create short url",
          });
        }
        throw new TRPCError({
          code: "CONFLICT",
          message: "Slug collision occurred",
        });
      } catch (error) {
        logger.error("Error while creating a shortUrl", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create short url",
        });
      }
    }),

  editLongUrl: publicProcedure
    .meta({
      name: "Edit Long URL",
      docs: {
        description:
          "Updates the destination URL associated with an existing short URL slug.",
        tags: ["urls", "shortener", "links"],
      },
    })
    .input(
      z.object({
        slug: z.string(),
        newLongUrl: z.url(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const error = await edit_long_url(
          opts.input.slug,
          opts.input.newLongUrl,
        );

        if (!error) {
          return {
            success: true,
            message: "Updated Long Url Successfully",
          };
        }

        throw error;
      } catch (error) {
        logger.error("Error while updating the longurl", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update long url",
        });
      }
    }),
});
