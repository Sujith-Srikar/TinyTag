import { db } from "../client";

const getDbHealth = async () => {
  const {data, error} = await db.from('links').select('1').limit(1);

  if(error) throw error;

  return data;
}

const getLinkBySlug = async (slug: string) => {
  const { data, error } = await db.rpc('get_redirect_url', {target_slug: slug});

  if (error || !data?.length) return null;

  const row = data[0];
  if(!row) return null;

  return {
    destinationUrl: row.destination_url,
    expiresAt: row.expires_at,
    hasPassword: row.password_hash !== null,
  };
};

const getLinkPasswordBySlug = async (slug: string) => {
  const { data, error } = await db.rpc('get_redirect_url', { target_slug: slug });

  if (error || !data?.length) return null;

  const row = data[0];
  if(!row) return null;

  return {
    destinationUrl: row.destination_url,
    passwordHash: row.password_hash,
  };
};

const updateClicksCount = async (slug: string) => {
  const { data, error } = await db.rpc("increment_click_count", {
    target_slug: slug,
  });

  if (error) {
    throw new Error(
      `Failed to increment click count for slug "${slug}": ${error.message}`,
    );
  }

  return data ?? false;
};

const slugExists = async (slug: string): Promise<boolean> => {
  const { data } = await db.from("links").select("*").eq("slug", slug).single();

  if (data) return true;

  return false;
};

export {
  getDbHealth,
  getLinkBySlug,
  getLinkPasswordBySlug,
  updateClicksCount,
  slugExists,
};