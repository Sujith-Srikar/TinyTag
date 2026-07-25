DROP FUNCTION IF EXISTS increment_click_count(text);

CREATE OR REPLACE FUNCTION increment_click_count(target_slug text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE links
  SET clicks_count = clicks_count + 1
  WHERE slug = target_slug;

  RETURN FOUND;
END;
$$;