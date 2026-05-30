CREATE TABLE IF NOT EXISTS submission_service_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('60', '110')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_note TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ssr_user ON submission_service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_ssr_status ON submission_service_requests(status);
