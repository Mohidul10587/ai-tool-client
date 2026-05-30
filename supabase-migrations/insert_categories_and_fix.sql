-- Check if categories and subcategories exist
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'subcategories', COUNT(*) FROM subcategories;

-- If empty, insert them
INSERT INTO categories (name, slug, display_order) VALUES
  ('Text & Chat', 'text-chat', 1),
  ('Creative', 'creative', 2),
  ('Productivity', 'productivity', 3),
  ('Business', 'business', 4),
  ('Development', 'development', 5),
  ('Industries', 'industries', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert subcategories
INSERT INTO subcategories (category_id, name, slug, display_order) VALUES
  (1, 'Chat', 'chat', 1), (1, 'Writing', 'writing', 2), (1, 'Search', 'search', 3), (1, 'Translation', 'translation', 4), (1, 'Prompts', 'prompts', 5),
  (2, 'Image', 'image', 1), (2, 'Video', 'video', 2), (2, 'Design', 'design', 3), (2, 'Audio', 'audio', 4), (2, 'Voice', 'voice', 5), (2, 'Music', 'music', 6), (2, '3D', '3d', 7), (2, 'Gaming', 'gaming', 8),
  (3, 'Productivity', 'productivity', 1), (3, 'Automation', 'automation', 2), (3, 'Email', 'email', 3), (3, 'Meetings', 'meetings', 4), (3, 'Scheduling', 'scheduling', 5), (3, 'Presentations', 'presentations', 6),
  (4, 'Marketing', 'marketing', 1), (4, 'SEO', 'seo', 2), (4, 'Sales', 'sales', 3), (4, 'Support', 'support', 4), (4, 'Finance', 'finance', 5), (4, 'HR', 'hr', 6), (4, 'Legal', 'legal', 7), (4, 'Property', 'property', 8),
  (5, 'Code', 'code', 1), (5, 'Models', 'models', 2), (5, 'Agents', 'agents', 3), (5, 'Data', 'data', 4), (5, 'Security', 'security', 5),
  (6, 'Education', 'education', 1), (6, 'Healthcare', 'healthcare', 2), (6, 'Research', 'research', 3)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Now update the tool
UPDATE tool_submissions 
SET 
  subcategory_id = 1,
  subcategory_snapshot = 'Chat'
WHERE id = '52a60145-1f7a-4de7-af47-73a0496bbe87';
