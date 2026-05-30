-- Check subcategory id 36
SELECT * FROM subcategories WHERE id = 36;

-- Fix the snapshot if needed
UPDATE tool_submissions 
SET subcategory_snapshot = (SELECT name FROM subcategories WHERE id = 36)
WHERE id = '52a60145-1f7a-4de7-af47-73a0496bbe87';
