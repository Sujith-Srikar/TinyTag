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
  ]),
  domain: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  comments: z.string().nullable(),
  expiresAt: z.string().nullable(),
  password: z.string().nullable(),
});

export type LinkBuilderValues = z.infer<typeof LinkBuilderFormSchema>;

export type LinkRecord = {
  clicksCount: number;
  comments?: string;
  destinationUrl: string;
  expiresAt?: string;
  id: string;
  password?: string;
  slug: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  hasPassword: boolean;
}

export interface User {
  id: string;
  isAnonymous: boolean;
  email: string | null;
}