alter table public.links
rename column longurl to destination_url;

alter table public.links
add column expires_at timestamptz,
add column comments text,
add column tags text[],
add column password_hash text