import {customAlphabet} from 'nanoid';

const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateRandomSlug = customAlphabet(alphabet, 6);

export const generateSlugFromUrl  = (url: string): string => {
    try {
      const { hostname, pathname } = new URL(url);
      const domain = hostname.replace("www.", "").split(".")[0];
      const pathSegment = pathname.split("/").filter(Boolean).pop() ?? "";
      const raw = pathSegment || domain || "";
      return raw
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 14);
    } catch {
      return generateRandomSlug();
    }
}