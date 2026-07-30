import { COOKIE_PREFIX } from '@repo/shared';
import { randomBytes } from "node:crypto";

export const createPasswordToken = () => {
  return randomBytes(24).toString("base64url");
}

export const createPasswordCookieName = (slug: string) => {
    return `${COOKIE_PREFIX}${slug}`;
}

export const generatePassword = () : string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const specials = "!@#$%&*";
  let pw = "";
  for (let i = 0; i < 16; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  const pos = Math.floor(Math.random() * (pw.length - 1)) + 1;
  pw = pw.slice(0, pos) + specials[Math.floor(Math.random() * specials.length)] + pw.slice(pos);
  return pw;
}