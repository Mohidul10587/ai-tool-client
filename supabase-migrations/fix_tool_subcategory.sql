-- Check what subcategories exist
SELECT id, name, slug FROM subcategories ORDER BY id;

-- Check the tool's subcategory_id
SELECT id, name, status, category_id, subcategory_id, category_snapshot, subcategory_snapshot 
FROM tool_submissions 
WHERE id = '52a60145-1f7a-4de7-af47-73a0496bbe87';

-- Fix: Update to a valid subcategory (Chat = id 1)
UPDATE tool_submissions 
SET 
  subcategory_id = 1,
  subcategory_snapshot = 'Chat'
WHERE id = '52a60145-1f7a-4de7-af47-73a0496bbe87';
