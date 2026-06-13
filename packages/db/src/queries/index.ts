import { db } from "../client";
import { Database } from "../types.js";
import { LinkBuilderValues } from "@repo/shared";

type LinksTable = Database["public"]["Tables"]["links"]["Row"];

const getAllLinks = async (): Promise<LinksTable[] | null> => {
  const { data, error } = await db.from("links").select("*");

  if (error) return null;

  return data;
};

const getLinkBySlug = async (slug: string): Promise<LinksTable | null> => {
  const { data, error } = await db
    .from("links")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;

  return data;
};

const create_short_url = async (opts: LinkBuilderValues) => {
  const { error } = await db
    .from("links")
    .insert({
    destination_url: opts.destinationUrl,
    slug: opts.slug,
    tags: opts.tags?.length ? opts.tags : null,
    comments: opts.comments || null,
    expires_at: opts.expiresAt || null,
    password_hash: opts.password || null,
  });
  return error;
};

const edit_long_url = async (opts: LinkBuilderValues) => {
  let updateObj: Partial<LinksTable> = {
    slug: opts.slug,
    destination_url: opts.destinationUrl,
    ...(opts.comments && { comments: opts.comments }),
    ...(opts.expiresAt && { expiresAt: opts.expiresAt }),
    ...(opts.tags && { tags: opts.tags }),
    ...(opts.password && { password: opts.password }),
  };

  const { error } = await db
    .from("links")
    .update(updateObj)
    .eq("slug", opts.slug);
  return error;
};

const delete_url = async (slug: string) => {
  const res = await db.from("links").delete().eq("slug", slug).select();
  return res;
};

const updateClicksCount = async ( slug: string ) => {
  const { data, error } = await db.rpc("increment_click_count", {
    target_slug: slug
  });

  if (error) {
    throw new Error(
      `Failed to increment click count for slug "${slug}": ${error.message}`,
    );
  }

  return data ?? false;
}

const slugExists = async (slug: string): Promise<boolean> => {
  const { data } = await db.from("links").select("*").eq("slug", slug).single();

  if (data) return true;

  return false;
};

export {
  getAllLinks,
  getLinkBySlug,
  create_short_url,
  edit_long_url,
  delete_url,
  updateClicksCount,
  slugExists,
};
