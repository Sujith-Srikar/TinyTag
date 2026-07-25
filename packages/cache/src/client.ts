import { Redis } from "@upstash/redis";
import {serverEnv} from '@repo/shared/env/server'

const redis = new Redis({
  url: serverEnv.UPSTASH_REDIS_REST_URL,
  token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
});

export default redis;

export const redisKeys = {
  redirect: (slug: string) => `redirect:${slug}`,
  analytics: (slug: string) => `analytics:${slug}`,
};