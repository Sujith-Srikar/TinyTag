-- Enable Row Level Security

alter table public.links
enable row level security;

-- SELECT - Users can only read their own links

create policy "users_can_read_own_links"
on public.links
for select
to authenticated
using ( auth.uid() = user_id );

-- INSERT - Users can only create links for themselves

create policy "users_can_create_own_links"
on public.links
for insert
to authenticated
with check ( auth.uid() = user_id );

-- UPDATE - Users can only update their own links

create policy "users_can_update_own_links"
on public.links
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- DELETE - Users can only delete their own links

create policy "users_can_delete_own_links"
on public.links
for delete
to authenticated
using ( auth.uid() = user_id );

-- Public Redirect Function

create or replace function public.get_redirect_url(target_slug text)
returns text
language sql
security definer
as $$
  select destination_url
  from public.links
  where slug = target_slug
  limit 1;
$$;

-- Allow everyone to use the redirect function.

grant execute
on function public.get_redirect_url(text)
to anon, authenticated;