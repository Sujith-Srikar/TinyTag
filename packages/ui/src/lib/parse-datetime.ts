import * as chrono from "chrono-node";

export function parseDateTime(str: string): Date | null {
  return chrono.parseDate(str);
}
