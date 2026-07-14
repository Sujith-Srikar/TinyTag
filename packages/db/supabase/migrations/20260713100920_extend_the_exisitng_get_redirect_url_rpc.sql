drop function if exists public.get_redirect_url(text);

create function public.get_redirect_url(target_slug text)
returns table (
    destination_url text,
    expires_at timestamptz,
    password_hash text
)
language sql
security definer
as $$
    select
        destination_url,
        expires_at,
        password_hash
    from public.links
    where slug = target_slug
    limit 1;
$$;

alter table public.links
add column "has_password" boolean default false not null