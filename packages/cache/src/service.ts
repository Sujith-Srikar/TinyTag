import redis, { redisKeys } from "./client";
import { type Redirect, RedirectSchema } from "./schema";

const EXPIRY_TIME = 60 * 60 * 24; // 1 day

const getRedirectData = async (slug: string): Promise<Redirect | null> => {
  const data = await redis.get(redisKeys.redirect(slug));

  if (!data) return null;

  return RedirectSchema.parse(data);
};

const setRedirectData = async (slug: string, longUrl: string) => {
  const result = await redis.set(
    redisKeys.redirect(slug),
    { longUrl },
    { ex: EXPIRY_TIME },
  );

  return result;
};

const setAnalyticsData = async (slug: string) => {
  const result = await redis.incr(redisKeys.analytics(slug));

  return result;
};

export { getRedirectData, setRedirectData, setAnalyticsData };