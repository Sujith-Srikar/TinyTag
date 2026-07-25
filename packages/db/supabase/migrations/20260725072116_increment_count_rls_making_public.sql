drop function if exists public.increment_click_count(text);

create function public.increment_click_count(target_slug text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.links
    set clicks_count = clicks_count + 1
    where slug = target_slug;

    return found;
end;
$$;

grant execute
on function public.increment_click_count(text)
to anon, authenticated;