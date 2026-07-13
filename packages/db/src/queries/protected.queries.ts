import { Database } from "../types.js";
import { LinkBuilderValues } from "@repo/shared";
import { type DBClient } from "..";

type LinksTable = Database["public"]["Tables"]["links"]["Row"];

const getMyLinks = async (supabase: DBClient): Promise<LinksTable[] | null> => {
  const { data, error } = await supabase.from("links").select("*");

  if (error) return null;

  return data;
};

const create_short_url = async (
  opts: LinkBuilderValues,
  userId: string,
  supabase: DBClient,
) => {
  const { error } = await supabase.from("links").insert({
    destination_url: opts.destinationUrl,
    slug: opts.slug,
    tags: opts.tags?.length ? opts.tags : null,
    comments: opts.comments || null,
    expires_at: opts.expiresAt || null,
    password_hash: opts.password || null,
    user_id: userId,
    has_password: !!opts.password
  });
  return error;
};

const edit_long_url = async (opts: LinkBuilderValues, supabase: DBClient) => {
  let updateObj: Partial<LinksTable> = {
    slug: opts.slug,
    destination_url: opts.destinationUrl,
    ...(opts.comments && { comments: opts.comments }),
    ...(opts.expiresAt && { expires_at: opts.expiresAt }),
    ...(opts.tags && { tags: opts.tags }),
    ...(opts.password && { password_hash: opts.password }),
    ...(opts.password && { has_password: !!opts.password})
  };

  const { error } = await supabase
    .from("links")
    .update(updateObj)
    .eq("slug", opts.slug);

  return error;
};

const delete_url = async (slug: string, supabase: DBClient) => {
  const res = await supabase
    .from("links")
    .delete()
    .eq("slug", slug)
    .select();

  return res;
};

export { getMyLinks, create_short_url, edit_long_url, delete_url };
