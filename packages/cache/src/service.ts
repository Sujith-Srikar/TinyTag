import redis, { redisKeys } from "./client";
import { type Redirect, RedirectSchema } from "./schema";

const EXPIRY_TIME = 60 * 60 * 24; // 1 day

const getCacheHealth = async () => {
  const res = await redis.ping();
  return res;
}

const getRedirectData = async (slug: string): Promise<Redirect | null> => {
  const data = await redis.get(redisKeys.redirect(slug));

  if (!data) return null;

  return RedirectSchema.parse(data);
};

const setRedirectData = async (slug: string, opts: Redirect, ttl?: number) => {
  const effectiveTtl = ttl && ttl > 0 ? Math.min(ttl, EXPIRY_TIME) : EXPIRY_TIME;
  const result = await redis.set(
    redisKeys.redirect(slug),
    opts,
    { ex: effectiveTtl },
  );

  return result;
};

const setAnalyticsData = async (slug: string) => {
  const result = await redis.incr(redisKeys.analytics(slug));

  return result;
};

const deleteData = async (slug: string) => {
  const result = await redis.del(redisKeys.redirect(slug), redisKeys.analytics(slug));
  if(result === 2)
    return true;
  return false;
}

export { getCacheHealth, getRedirectData, setRedirectData, setAnalyticsData, deleteData };