-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS so server-side service role can read/write freely
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Seed default values
INSERT INTO site_settings (key, value) VALUES
  ('site_title',          'AI Directory - Discover the Best AI Tools'),
  ('site_description',    'Discover, compare, and find the best AI tools for your workflow.'),
  ('site_keywords',       'AI tools, artificial intelligence, AI directory'),
  ('logo_url',            ''),
  ('favicon_url',         ''),
  ('og_image_url',        ''),
  ('twitter_handle',      '@aidirectory'),
  ('google_verification', ''),
  ('footer_text',         '© 2026 AI Directory. All rights reserved.')
ON CONFLICT (key) DO NOTHING;
