-- Add short_description and detail_description columns to tool_submissions
ALTER TABLE tool_submissions
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS detail_description TEXT;
