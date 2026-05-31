import { Redis } from "@upstash/redis";
import {env} from '@repo/shared/env'

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export default redis;

export const redisKeys = {
  redirect: (slug: string) => `redirect:${slug}`,
  analytics: (slug: string) => `analytics: ${slug}`,
};
