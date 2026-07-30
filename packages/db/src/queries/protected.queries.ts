import { Database } from "../types.js";
import { type LinkMutationInput } from "@repo/shared";
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
  link: LinkMutationInput,
  supabase: DBClient,
) => {
  const { error } = await supabase.from("links").insert({
    destination_url: link.destinationUrl,
    slug: link.slug,
    tags: link.tags?.length ? link.tags : null,
    title: link.title || null,
    expires_at: link.expiresAt?.toISOString() ?? null,
    password_hash: link.hashedPassword,
    password_token: link.passwordToken,
    user_id: link.userId,
    has_password: !!link.hashedPassword,
  });

  if (error) {
    throw new Error(`Failed to create short url: ${error.message}`);
  }
};

const edit_long_url = async (
  link: LinkMutationInput,
  supabase: DBClient
) => {
  const updateObj: Partial<LinksTable> = {
    slug: link.slug,
    destination_url: link.destinationUrl,
  };

  if (link.expiresAt !== undefined) {
    updateObj.expires_at = link.expiresAt ? link.expiresAt.toISOString() : null;
  }
  if (link.title !== undefined) {
    updateObj.title = link.title || null;
  }
  if (link.tags !== undefined) {
    updateObj.tags = link.tags?.length ? link.tags : null;
  }
  if (link.hashedPassword !== undefined) {
    updateObj.password_hash = link.hashedPassword;
    updateObj.password_token = link.passwordToken ?? null;
    updateObj.has_password = !!link.hashedPassword;
  }

  const { error } = await supabase
    .from("links")
    .update(updateObj)
    .eq("slug", link.slug)
    .eq("user_id", link.userId);

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
