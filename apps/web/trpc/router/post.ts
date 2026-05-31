import { TRPCError } from "@trpc/server";
import { publicProcedure, createTRPCRouter } from "../init";
import { logger } from "@repo/shared";
import { z } from "zod";
import { create_short_url, delete_url, edit_long_url } from "@repo/db";
import { LinkBuilderFormSchema } from "@repo/shared";

export const postRouter = createTRPCRouter({
  shortenUrl: publicProcedure
    .meta({
      name: "Create Short URL",
      docs: {
        description:
          "Creates and stores a shortened URL with collision-safe slug generation.",
        tags: ["urls", "shortener", "links", "create"],
      },
    })
    .input(LinkBuilderFormSchema)
    .mutation(async (opts) => {
      try {
        const input = opts.input;
        const error = await create_short_url(input);

        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create short url",
          });
        }

        return {
          success: true,
          message: "ShortUrl Created Successfully",
          slug: input.slug,
        };
      } catch (error) {
        logger.error("Error while creating a shortUrl", error);

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
        tags: ["urls", "shortener", "links", "edit"],
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

  deleteUrl: publicProcedure
    .meta({
      name: "Delete URL",
      docs: {
        description:
          "Deletes an already existing short URL slug and its associated data.",
        tags: ["urls", "shortener", "links", "delete"],
      },
    })
    .input(
      z.object({
        slug: z.string().min(4).max(10),
      }),
    )
    .mutation(async (opts) => {
      try {
        const { data } = await delete_url(opts.input.slug);

        if (data && data.length != 0) {
          return {
            success: true,
            message: "Deleted URL Successfully",
          };
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Slug Not Found to Delete",
        });
      } catch (error) {
        logger.error("Error while deleting url", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erroe while Deleting URL",
        });
      }
    }),
});
