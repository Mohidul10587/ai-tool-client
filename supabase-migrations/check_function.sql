-- Check the trigger function
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'restrict_update_to_url_only';
