import { z } from "zod";
import type { RedirectData } from "@repo/shared";

const RedirectSchema = z.object({
  destinationUrl: z.url(),
  hasPassword: z.boolean(),
  expiresAt: z.string().nullable(),
}) satisfies z.ZodType<RedirectData>;

type Redirect = z.infer<typeof RedirectSchema>;

export type { Redirect };
export { RedirectSchema };
