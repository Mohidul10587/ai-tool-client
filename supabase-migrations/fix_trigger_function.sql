-- Fix the trigger function to use new category fields
CREATE OR REPLACE FUNCTION public.restrict_update_to_url_only()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- get role
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid();

  -- admin হলে সব allowed
  IF user_role = 'admin' THEN
    RETURN NEW;
  END IF;

  -- অন্য field change করলে block
  IF 
    NEW.url IS DISTINCT FROM OLD.url AND
    (
      NEW.name IS DISTINCT FROM OLD.name OR
      NEW.slug IS DISTINCT FROM OLD.slug OR
      NEW.category_id IS DISTINCT FROM OLD.category_id OR
      NEW.subcategory_id IS DISTINCT FROM OLD.subcategory_id OR
      NEW.category_snapshot IS DISTINCT FROM OLD.category_snapshot OR
      NEW.subcategory_snapshot IS DISTINCT FROM OLD.subcategory_snapshot OR
      NEW.pricing IS DISTINCT FROM OLD.pricing OR
      NEW.overview IS DISTINCT FROM OLD.overview OR
      NEW.key_features IS DISTINCT FROM OLD.key_features OR
      NEW.use_cases IS DISTINCT FROM OLD.use_cases OR
      NEW.pricing_info IS DISTINCT FROM OLD.pricing_info OR
      NEW.pros IS DISTINCT FROM OLD.pros OR
      NEW.cons IS DISTINCT FROM OLD.cons OR
      NEW.logo_url IS DISTINCT FROM OLD.logo_url OR
      NEW.hero_image_url IS DISTINCT FROM OLD.hero_image_url OR
      NEW.platform IS DISTINCT FROM OLD.platform OR
      NEW.status IS DISTINCT FROM OLD.status
    )
  THEN
    RAISE EXCEPTION 'You can only update the URL field';
  END IF;

  -- url change হলে reset
  IF NEW.url IS DISTINCT FROM OLD.url THEN
    NEW.status := 'pending';
    NEW.updated_at := NOW();
  END IF;

  RETURN NEW;
END;
$function$;
