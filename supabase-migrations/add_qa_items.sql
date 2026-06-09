-- Add qa_items column to tool_submissions table for Q&A functionality
-- Run this in Supabase SQL editor or via psql

ALTER TABLE tool_submissions 
ADD COLUMN IF NOT EXISTS qa_items JSONB DEFAULT '[]'::jsonb;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_tool_submissions_qa_items 
ON tool_submissions USING gin (qa_items);
