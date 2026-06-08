-- Generate slugs for tool_submissions that have a name but no slug.
-- Slug format: lowercase, spaces/special chars → hyphens, deduplicated with -N suffix.

DO $$
DECLARE
  r RECORD;
  base_slug TEXT;
  candidate TEXT;
  counter INT;
BEGIN
  FOR r IN
    SELECT id, name FROM tool_submissions WHERE slug IS NULL AND name IS NOT NULL
  LOOP
    -- Build base slug: lowercase, replace non-alphanumeric with hyphen, trim/collapse hyphens
    base_slug := regexp_replace(
                   regexp_replace(lower(r.name), '[^a-z0-9]+', '-', 'g'),
                   '^-+|-+$', '', 'g'
                 );

    candidate := base_slug;
    counter   := 1;

    -- Avoid collisions
    WHILE EXISTS (SELECT 1 FROM tool_submissions WHERE slug = candidate AND id <> r.id) LOOP
      candidate := base_slug || '-' || counter;
      counter   := counter + 1;
    END LOOP;

    UPDATE tool_submissions SET slug = candidate WHERE id = r.id;
  END LOOP;
END;
$$;
