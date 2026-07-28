import { COOKIE_PREFIX } from '@repo/shared';
import { serverEnv } from '@repo/shared/env/server';
import { createHmac } from "node:crypto";

export const createPasswordToken = (slug: string) => {
  return createHmac("sha256", serverEnv.COOKIE_SECRET)
    .update(slug)
    .digest("base64url");
}

export const createPasswordCookieName = (slug: string) => {
    return `${COOKIE_PREFIX}${slug}`;
}