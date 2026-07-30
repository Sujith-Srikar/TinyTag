import { z } from "zod";

export interface RedirectData {
  destinationUrl: string;
  expiresAt: string | null;
  hasPassword: boolean;
  passwordToken: string | null;
}

export type LinkRecord = {
  id: string;
  slug: string;
  destinationUrl: string;
  clicksCount: number;
  expiresAt: string | null;
  createdAt: string;
  isActive: boolean;
  hasPassword: boolean;
  comments?: string;
  tags?: string[];
};

export interface User {
  id: string;
  isAnonymous: boolean;
  email: string | null;
}

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
  expiresAt: z.union([z.date(), z.null()]).optional(),
  password: z.union([z.string(), z.null()]).optional(),
  hasPassword: z.boolean().optional(),
});

export type LinkBuilderFields = z.infer<typeof LinkBuilderFormSchema>;

export type LinkMutationInput = Omit<LinkBuilderFields, 'password' | 'hasPassword'> & {userId: string; hashedPassword?: string | null; passwordToken?: string | null}

export const LINK_BUILDER_DEFAULTS: LinkBuilderFields = {
  destinationUrl: "",
  slug: "",
  domain: "ttags.vercel.app",
  tags: undefined,
  comments: undefined,
  expiresAt: undefined,
  password: undefined,
};

export const EXPIRY_STATE = {
  EXPIRED: "expired",
  NOW: "now",
  MINUTES: "minutes",
  HOURS: "hours",
  TOMORROW: "tomorrow",
  DAYS: "days",
  DATE: "date",
} as const;

export type ExpiryState = (typeof EXPIRY_STATE)[keyof typeof EXPIRY_STATE];

export interface ExpiryInfo {
  state: ExpiryState;
  label: string;
  expiresAt: Date;
}

export const COOKIE_PREFIX = "tinytag-pw-";
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day