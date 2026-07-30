alter table public.links
rename column comments to title;

alter table public.links
alter column title type varchar(40);