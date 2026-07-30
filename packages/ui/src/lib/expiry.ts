import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isPast,
  isSameYear,
} from "date-fns";
import { EXPIRY_STATE, ExpiryInfo } from "@repo/shared";

const stripSeconds = (date: Date) => {
  const d = new Date(date);
  d.setSeconds(0, 0);
  return d;
};

/**
 * Returns a user-friendly expiry label.
 *
 * Rules:
 * - Past                  -> Expired
 * - < 1 minute            -> Expires now
 * - < 1 hour              -> Expires in X min
 * - < 24 hours            -> Expires in X hr
 * - Tomorrow              -> Expires tomorrow
 * - 2–6 calendar days     -> Expires in X days
 * - >= 7 days             -> Jul 30 / Jul 30, 2027
 */
export const getExpiryInfo = (
  expiresAt: string | Date,
  now: Date = new Date(),
): ExpiryInfo => {
  const expiryDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  const normalizedNow = stripSeconds(now);
  const normalizedExpiry = stripSeconds(expiryDate);

  if (isPast(normalizedExpiry)) {
    return {
      state: EXPIRY_STATE.EXPIRED,
      label: "Expired",
      expiresAt: normalizedExpiry,
    };
  }

  const minutes = differenceInMinutes(normalizedExpiry, normalizedNow);

  if (minutes < 1) {
    return {
      state: EXPIRY_STATE.NOW,
      label: "Expires now",
      expiresAt: normalizedExpiry,
    };
  }

  if (minutes < 60) {
    return {
      state: EXPIRY_STATE.MINUTES,
      label: `Expires in ${minutes} min`,
      expiresAt: normalizedExpiry,
    };
  }

  const hours = differenceInHours(normalizedExpiry, normalizedNow);

  if (hours < 24) {
    return {
      state: EXPIRY_STATE.HOURS,
      label: `Expires in ${hours} hr`,
      expiresAt: normalizedExpiry,
    };
  }

  const calendarDays = differenceInCalendarDays(normalizedExpiry, normalizedNow);

  if (calendarDays === 1) {
    return {
      state: EXPIRY_STATE.TOMORROW,
      label: "Expires tomorrow",
      expiresAt: normalizedExpiry,
    };
  }

  if (calendarDays < 7) {
    return {
      state: EXPIRY_STATE.DAYS,
      label: `Expires in ${calendarDays} days`,
      expiresAt: normalizedExpiry,
    };
  }

  return {
    state: EXPIRY_STATE.DATE,
    label: format(
      normalizedExpiry,
      isSameYear(normalizedExpiry, normalizedNow) ? "MMM d" : "MMM d, yyyy",
    ),
    expiresAt: normalizedExpiry,
  };
}