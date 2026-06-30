create or replace function health_check()
returns boolean
language sql
as $$ select true; $$;