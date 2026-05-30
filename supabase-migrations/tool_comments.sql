-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS tool_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id TEXT NOT NULL,  -- references tool_submissions.id (stored as text for flexibility)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  upvotes INT NOT NULL DEFAULT 0,
  downvotes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tool_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "public read comments" ON tool_comments FOR SELECT USING (true);

-- Only authenticated users can insert their own comments
CREATE POLICY "auth insert comments" ON tool_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "auth delete own comments" ON tool_comments FOR DELETE
  USING (auth.uid() = user_id);
