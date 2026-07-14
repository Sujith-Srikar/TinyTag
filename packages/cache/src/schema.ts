import { z } from "zod";

const RedirectSchema = z.object({
  destinationUrl: z.url(),
  hasPassword: z.boolean(),
  expiresAt: z.string().nullable(),
});

type Redirect = z.infer<typeof RedirectSchema>;

export type { Redirect };
export { RedirectSchema };
