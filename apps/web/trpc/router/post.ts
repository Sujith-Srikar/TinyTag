import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { logger } from "@repo/shared";
import { z } from "zod";
import { create_short_url, delete_url, edit_long_url } from "@repo/db";
import { LinkBuilderFormSchema } from "@repo/shared";
import { deleteData } from "@repo/cache";

export const postRouter = createTRPCRouter({
  shortenUrl: protectedProcedure
    .meta({
      name: "Create Short URL",
      docs: {
        description:
          "Creates and stores a shortened URL with collision-safe slug generation.",
        tags: ["urls", "shortener", "links", "create"],
        auth: true
      },
    })
    .input(LinkBuilderFormSchema)
    .mutation(async (opts) => {
      try {
        const input = opts.input;
        const error = await create_short_url(input, opts.ctx.user.id);

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

  editLongUrl: protectedProcedure
    .meta({
      name: "Edit Long URL",
      docs: {
        description:
          "Updates the destination URL associated with an existing short URL slug.",
        tags: ["urls", "shortener", "links", "edit"],
        auth: true
      },
    })
    .input(LinkBuilderFormSchema)
    .mutation(async (opts) => {
      try {
        const error = await edit_long_url(opts.input, opts.ctx.user.id);

        if (!error) {
          deleteData(opts.input.slug);
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

  deleteUrl: protectedProcedure
    .meta({
      name: "Delete URL",
      docs: {
        description:
          "Deletes an already existing short URL slug and its associated data.",
        tags: ["urls", "shortener", "links", "delete"],
        auth: true
      },
    })
    .input(
      z.object({
        slug: z.string().min(4).max(10),
      }),
    )
    .mutation(async (opts) => {
      try {
        const { data } = await delete_url(opts.input.slug, opts.ctx.user.id);

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
