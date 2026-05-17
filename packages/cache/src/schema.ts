import { z } from "zod";

const RedirectSchema = z.object({
  longUrl: z.url(),
});

type Redirect = z.infer<typeof RedirectSchema>;

export type { Redirect };
export { RedirectSchema };