import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isPast,
  isSameYear,
} from "date-fns";
import { EXPIRY_STATE, ExpiryInfo } from "@repo/shared";

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
  expiresAt: string | Date,
  now: Date = new Date(),
): ExpiryInfo {
  const expiryDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  if (isPast(expiryDate)) {
    return {
      state: EXPIRY_STATE.EXPIRED,
      label: "Expired",
      expiresAt: expiryDate,
    };
  }

  const minutes = differenceInMinutes(expiryDate, now);

  if (minutes < 1) {
    return {
      state: EXPIRY_STATE.NOW,
      label: "Expires now",
      expiresAt: expiryDate,
    };
  }

  if (minutes < 60) {
    return {
      state: EXPIRY_STATE.MINUTES,
      label: `Expires in ${minutes} min`,
      expiresAt: expiryDate,
    };
  }

  const hours = differenceInHours(expiryDate, now);

  if (hours < 24) {
    return {
      state: EXPIRY_STATE.HOURS,
      label: `Expires in ${hours} hr`,
      expiresAt: expiryDate,
    };
  }

  const calendarDays = differenceInCalendarDays(expiryDate, now);

  if (calendarDays === 1) {
    return {
      state: EXPIRY_STATE.TOMORROW,
      label: "Expires tomorrow",
      expiresAt: expiryDate,
    };
  }

  if (calendarDays < 7) {
    return {
      state: EXPIRY_STATE.DAYS,
      label: `Expires in ${calendarDays} days`,
      expiresAt: expiryDate,
    };
  }

  return {
    state: EXPIRY_STATE.DATE,
    label: format(
      expiryDate,
      isSameYear(expiryDate, now) ? "MMM d" : "MMM d, yyyy",
    ),
    expiresAt: expiryDate,
  };
}