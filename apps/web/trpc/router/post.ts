import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";
import { logger, COOKIE_MAX_AGE, LinkMutationInput, LinkBuilderFormSchema } from "@repo/shared";
import { z } from "zod";
import { create_short_url, delete_url, edit_long_url, getLinkPasswordBySlug, updateClicksCount } from "@repo/db";
import { deleteData } from "@repo/cache";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { createPasswordToken, createPasswordCookieName } from "@/utils/password";
import { serverEnv } from "@repo/shared/env/server";

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
        const hashedPassword = opts.input.password ? await hash(opts.input.password) : null;
        const passwordToken = hashedPassword ? createPasswordToken() : null;

        const link: LinkMutationInput = {
          ...opts.input,
          userId: opts.ctx.user.id,
          hashedPassword,
          passwordToken
        }

        await create_short_url(
          link,
          opts.ctx.supabase,
        );
        return {
          success: true,
          message: "ShortUrl Created Successfully",
          slug: opts.input.slug,
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
        let hashedPassword: string | null | undefined;
        let passwordToken: string | null | undefined;

        if (opts.input.password === undefined) {
          hashedPassword = undefined;
          passwordToken = undefined;
        } else if (opts.input.password === null) {
          hashedPassword = null;
          passwordToken = null;
        } else {
          hashedPassword = await hash(opts.input.password);
          passwordToken = createPasswordToken();
        }

        const link: LinkMutationInput = {
          ...opts.input,
          userId: opts.ctx.user.id,
          hashedPassword,
          passwordToken
        }

        await edit_long_url(
          link,
          opts.ctx.supabase,
        );

        deleteData(opts.input.slug);
        return {
          success: true,
          message: "Updated Long Url Successfully",
        };
      } catch (error) {
        logger.error("Error while updating the longurl", error);

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
        const deleted = await delete_url(opts.input.slug, opts.ctx.user.id, opts.ctx.supabase);

        if (deleted) {
          deleteData(opts.input.slug);
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
          message: "Error while Deleting URL",
        });
      }
    }),

  verifyPassword: publicProcedure
    .meta({
      name: "Verify Password",
      docs: {
        description:
          "Verifies a password for a password-protected link. Sets a verification cookie on success.",
        tags: ["urls", "password", "verify"],
      },
    })
    .input(
      z.object({
        slug: z.string().min(3).max(10),
        password: z.string().min(1),
      }),
    )
    .mutation(async (opts) => {
      try {
        const { slug, password } = opts.input;

        const link = await getLinkPasswordBySlug(slug);
        if (!link || !link.passwordHash || !link.passwordToken) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Link not found",
          });
        }

        const valid = await verify(link.passwordHash, password);
        if (!valid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid password",
          });
        }

        const cookieStore = await cookies();
        cookieStore.set(createPasswordCookieName(slug), link.passwordToken, {
          httpOnly: true,
          secure: serverEnv.NODE_ENV === 'production',
          sameSite: "lax",
          path: "/",
          maxAge: COOKIE_MAX_AGE,
        });

        void updateClicksCount(slug).catch((err) =>
          logger.error("Failed to increment click count", { slug, err }),
        );

        return { redirectUrl: link.destinationUrl };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        logger.error("Password verification failed", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify password",
        });
      }
    }),
});
