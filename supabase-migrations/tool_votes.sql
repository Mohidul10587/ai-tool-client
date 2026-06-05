-- Tool votes table
CREATE TABLE IF NOT EXISTS tool_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tool_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote SMALLINT NOT NULL CHECK (vote IN (1, -1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, user_id)
);

-- Vote count columns on tool_submissions
ALTER TABLE tool_submissions
  ADD COLUMN IF NOT EXISTS upvotes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS downvotes INTEGER NOT NULL DEFAULT 0;

-- Function to sync vote counts
CREATE OR REPLACE FUNCTION sync_tool_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tool_submissions SET
    upvotes   = (SELECT COUNT(*) FROM tool_votes WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id) AND vote = 1),
    downvotes = (SELECT COUNT(*) FROM tool_votes WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id) AND vote = -1)
  WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_tool_votes ON tool_votes;
CREATE TRIGGER trg_sync_tool_votes
AFTER INSERT OR UPDATE OR DELETE ON tool_votes
FOR EACH ROW EXECUTE FUNCTION sync_tool_votes();

-- RLS
ALTER TABLE tool_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own votes" ON tool_votes
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read votes" ON tool_votes
  FOR SELECT USING (true);
