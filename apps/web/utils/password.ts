import { COOKIE_PREFIX } from '@repo/shared';
import { randomBytes } from "node:crypto";

export const createPasswordToken = () => {
  return randomBytes(24).toString("base64url");
}

export const createPasswordCookieName = (slug: string) => {
    return `${COOKIE_PREFIX}${slug}`;
}