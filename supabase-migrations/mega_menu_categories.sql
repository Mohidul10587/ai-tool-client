CREATE TABLE IF NOT EXISTS mega_menu_categories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mega_menu_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES mega_menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mega_menu_categories_order ON mega_menu_categories(display_order);
CREATE INDEX idx_mega_menu_items_category ON mega_menu_items(category_id, display_order);

-- Insert default data
INSERT INTO mega_menu_categories (title, display_order) VALUES
  ('Text & Chat', 1),
  ('Creative', 2),
  ('Productivity', 3),
  ('Business', 4),
  ('Development', 5),
  ('Industries', 6);

INSERT INTO mega_menu_items (category_id, name, display_order) VALUES
  (1, 'Chat', 1), (1, 'Writing', 2), (1, 'Search', 3), (1, 'Translation', 4), (1, 'Prompts', 5),
  (2, 'Image', 1), (2, 'Video', 2), (2, 'Design', 3), (2, 'Audio', 4), (2, 'Voice', 5), (2, 'Music', 6), (2, '3D', 7), (2, 'Gaming', 8),
  (3, 'Productivity', 1), (3, 'Automation', 2), (3, 'Email', 3), (3, 'Meetings', 4), (3, 'Scheduling', 5), (3, 'Presentations', 6),
  (4, 'Marketing', 1), (4, 'SEO', 2), (4, 'Sales', 3), (4, 'Support', 4), (4, 'Finance', 5), (4, 'HR', 6), (4, 'Legal', 7), (4, 'Property', 8),
  (5, 'Code', 1), (5, 'Models', 2), (5, 'Agents', 3), (5, 'Data', 4), (5, 'Security', 5),
  (6, 'Education', 1), (6, 'Healthcare', 2), (6, 'Research', 3);
