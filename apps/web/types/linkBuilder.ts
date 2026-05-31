import { z } from "zod";

export const LinkBuilderFormSchema = z.object({
  destinationUrl: z.url("Please enter a valid URL (include https://)"),
  slug: z.union([
    z
      .string()
      .min(3, "Slug must be at least 3 characters")
      .max(10, "Slug must be at max 10 characters")
      .regex(
        /^[a-zA-Z0-9-]+$/,
        "Only lowercase & uppercase letters, numbers, and hyphens",
      ),
    z.literal(""),
  ]),
  domain: z.string().optional(),
  tags: z.array(z.string()).optional(),
  comments: z.string().optional(),
  expiresAt: z.string().optional(),
  password: z.string().optional(),
});

export type LinkBuilderFields = z.infer<typeof LinkBuilderFormSchema>;

export const LINK_BUILDER_DEFAULTS: LinkBuilderFields = {
  destinationUrl: "",
  slug: "",
  domain: "tt.vercel.app",
  tags: [""],
  comments: "",
  expiresAt: "",
  password: "",
};
