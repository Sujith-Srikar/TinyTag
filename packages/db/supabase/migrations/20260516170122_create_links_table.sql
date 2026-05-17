create extension if not exists pgcrypto;

create table if not exists public.links (
    id uuid primary key default gen_random_uuid(),
    longUrl text not null,
    slug text not null unique,
    clicks_count integer not null default 0,
    created_at timestamptz not null default now()
);