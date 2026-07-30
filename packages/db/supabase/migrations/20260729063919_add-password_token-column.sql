alter table public.links
add column password_token text;

create extension if not exists pgcrypto;

update public.links
set password_token = gen_random_uuid()::text
where has_password = true
  and password_token is null;

alter table public.links
add constraint links_password_consistency
check (
    (has_password = false and password_hash is null and password_token is null)
    or
    (has_password = true and password_hash is not null and password_token is not null)
);

drop function if exists public.get_redirect_url(text);

create function public.get_redirect_url(target_slug text)
returns table (
    destination_url text,
    expires_at timestamptz,
    password_hash text,
    password_token text
)
language sql
security definer
as $$
    select
        destination_url,
        expires_at,
        password_hash,
        password_token
    from public.links
    where slug = target_slug
    limit 1;
$$;