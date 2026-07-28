import { z } from "zod";

export const serverEnv = z
  .object({
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    COOKIE_SECRET: z.string().min(24),
    NODE_ENV: z.enum(['production', 'development'])
  })
  .parse({
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });