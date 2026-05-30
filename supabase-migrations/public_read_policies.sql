-- Allow unauthenticated (public) read access to public data

-- Published tools are publicly readable
CREATE POLICY IF NOT EXISTS "public_read_published_tools" ON tool_submissions
  FOR SELECT USING (status = 'published');

-- Categories and subcategories are publicly readable
CREATE POLICY IF NOT EXISTS "public_read_categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "public_read_subcategories" ON subcategories
  FOR SELECT USING (true);

-- Approved featured ads are publicly readable
CREATE POLICY IF NOT EXISTS "public_read_approved_featured_ads" ON featured_ads
  FOR SELECT USING (status = 'approved');
