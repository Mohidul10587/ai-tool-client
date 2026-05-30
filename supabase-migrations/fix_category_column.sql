-- Fix tool_submissions table to remove old category column
-- Run this if you're still getting "no field category" errors

-- First, ensure the new columns exist
ALTER TABLE tool_submissions 
  ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS category_snapshot TEXT,
  ADD COLUMN IF NOT EXISTS subcategory_snapshot TEXT;

-- Now drop the old category column
ALTER TABLE tool_submissions DROP COLUMN IF EXISTS category;
