-- Create featured ads table
CREATE TABLE IF NOT EXISTS featured_ads (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_message TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_featured_ads_status ON featured_ads(status);
CREATE INDEX IF NOT EXISTS idx_featured_ads_user ON featured_ads(user_id);

-- If table already exists, add the column:
ALTER TABLE featured_ads ADD COLUMN IF NOT EXISTS rejection_message TEXT;
