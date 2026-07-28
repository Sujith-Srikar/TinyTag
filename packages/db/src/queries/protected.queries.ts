import { Database } from "../types.js";
import { type LinkBuilderFields } from "@repo/shared";
import { type DBClient } from "..";

type LinksTable = Database["public"]["Tables"]["links"]["Row"];

const getMyLinks = async (supabase: DBClient): Promise<LinksTable[]> => {
  const { data, error } = await supabase.from("links").select("*");

  if (error) {
    throw new Error(`Failed to fetch user links: ${error.message}`);
  }

  return data ?? [];
};

const create_short_url = async (
  opts: LinkBuilderFields,
  userId: string,
  supabase: DBClient,
  hashedPassword?: string,
) => {
  const { error } = await supabase.from("links").insert({
    destination_url: opts.destinationUrl,
    slug: opts.slug,
    tags: opts.tags?.length ? opts.tags : null,
    comments: opts.comments || null,
    expires_at: opts.expiresAt?.toISOString() || null,
    password_hash: hashedPassword ?? null,
    user_id: userId,
    has_password: !!hashedPassword,
  });

  if (error) {
    throw new Error(`Failed to create short url: ${error.message}`);
  }
};

const edit_long_url = async (
  opts: LinkBuilderFields,
  userId: string,
  supabase: DBClient,
  hashedPassword?: string,
) => {
  const updateObj: Partial<LinksTable> = {
    slug: opts.slug,
    destination_url: opts.destinationUrl,
  };

  if (opts.expiresAt !== undefined) {
    updateObj.expires_at = opts.expiresAt ? opts.expiresAt.toISOString() : null;
  }
  if (opts.comments !== undefined) {
    updateObj.comments = opts.comments || null;
  }
  if (opts.tags !== undefined) {
    updateObj.tags = opts.tags?.length ? opts.tags : null;
  }
  if (hashedPassword !== undefined) {
    updateObj.password_hash = hashedPassword || null;
    updateObj.has_password = !!hashedPassword;
  }

  const { error } = await supabase
    .from("links")
    .update(updateObj)
    .eq("slug", opts.slug)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to edit link: ${error.message}`);
  }
};

const delete_url = async (
  slug: string,
  userId: string,
  supabase: DBClient,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("links")
    .delete()
    .eq("slug", slug)
    .eq("user_id", userId)
    .select();

  if (error) {
    throw new Error(`Failed to delete link: ${error.message}`);
  }

  return (data?.length ?? 0) > 0;
};

export { getMyLinks, create_short_url, edit_long_url, delete_url };
