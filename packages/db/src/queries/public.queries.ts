import { db } from "../client";
import type { RedirectData } from "@repo/shared";

const getDbHealth = async () => {
  const { data, error } = await db.from("links").select("1").limit(1);

  if (error) throw error;

  return data;
};

const getLinkBySlug = async (slug: string): Promise<RedirectData | null> => {
  const { data, error } = await db.rpc("get_redirect_url", {target_slug: slug});

  if (error) {
    throw new Error(`Failed to fetch redirect data for slug "${slug}": ${error.message}`);
  }

  if (!data?.length) return null;

  const row = data[0];
  if (!row) return null;

  return {
    destinationUrl: row.destination_url,
    expiresAt: row.expires_at,
    hasPassword: row.password_hash !== null,
  };
};

const getLinkPasswordBySlug = async (slug: string): Promise<{ destinationUrl: string; passwordHash: string | null } | null> => {
  const { data, error } = await db.rpc("get_redirect_url", {target_slug: slug});

  if (error) {
    throw new Error(`Failed to fetch password for slug "${slug}": ${error.message}`);
  }

  if (!data?.length) return null;

  const row = data[0];
  if (!row) return null;

  return {
    destinationUrl: row.destination_url,
    passwordHash: row.password_hash,
  };
};

const updateClicksCount = async (slug: string) => {
  const { data, error } = await db.rpc("increment_click_count", {target_slug: slug});

  if (error) {
    throw new Error(`Failed to increment click count for slug "${slug}": ${error.message}`);
  }

  if (data !== true) {
    throw new Error(`Failed to increment click count for slug "${slug}"`);
  }

  return data;
};

const slugExists = async (slug: string): Promise<boolean> => {
  const { data } = await db.from("links").select("slug").eq("slug", slug).single();

  return !!data;
};

export {
  getDbHealth,
  getLinkBySlug,
  getLinkPasswordBySlug,
  updateClicksCount,
  slugExists,
};