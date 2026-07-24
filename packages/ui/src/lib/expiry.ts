import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isPast,
  isSameYear,
} from "date-fns";
import { EXPIRY_STATE, type ExpiryState, ExpiryInfo } from "@repo/shared";

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
export function getExpiryInfo(
  expiresAt: Date,
  now: Date = new Date(),
): ExpiryInfo {
  if (isPast(expiresAt)) {
    return {
      state: EXPIRY_STATE.EXPIRED,
      label: "Expired",
      expiresAt,
    };
  }

  const minutes = differenceInMinutes(expiresAt, now);

  if (minutes < 1) {
    return {
      state: EXPIRY_STATE.NOW,
      label: "Expires now",
      expiresAt,
    };
  }

  if (minutes < 60) {
    return {
      state: EXPIRY_STATE.MINUTES,
      label: `Expires in ${minutes} min`,
      expiresAt,
    };
  }

  const hours = differenceInHours(expiresAt, now);

  if (hours < 24) {
    return {
      state: EXPIRY_STATE.HOURS,
      label: `Expires in ${hours} hr`,
      expiresAt,
    };
  }

  const calendarDays = differenceInCalendarDays(expiresAt, now);

  if (calendarDays === 1) {
    return {
      state: EXPIRY_STATE.TOMORROW,
      label: "Expires tomorrow",
      expiresAt,
    };
  }

  if (calendarDays < 7) {
    return {
      state: EXPIRY_STATE.DAYS,
      label: `Expires in ${calendarDays} days`,
      expiresAt,
    };
  }

  return {
    state: EXPIRY_STATE.DATE,
    label: format(
      expiresAt,
      isSameYear(expiresAt, now) ? "MMM d" : "MMM d, yyyy",
    ),
    expiresAt,
  };
}
