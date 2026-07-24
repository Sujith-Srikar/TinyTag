import { z } from "zod";

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
  expiresAt: z.date().optional(),
  password: z.string().optional(),
});

export type LinkBuilderFields = z.infer<typeof LinkBuilderFormSchema>;

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