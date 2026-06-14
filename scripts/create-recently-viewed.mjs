const PROJECT_REF = "gitnhcnhwkjyzebujsxn";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdG5oY25od2tqeXplYnVqc3huIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI5NjYyNCwiZXhwIjoyMDkyODcyNjI0fQ.q1DOAc0A_SDb_Lf6fps1D73_1Padc4jshYmZFR7o5Ps";

const sql = `
CREATE TABLE IF NOT EXISTS recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tool_submissions(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);
CREATE INDEX IF NOT EXISTS recently_viewed_user_viewed ON recently_viewed(user_id, viewed_at DESC);
ALTER TABLE recently_viewed DISABLE ROW LEVEL SECURITY;
`;

const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${SERVICE_KEY}`,
  },
  body: JSON.stringify({ query: sql }),
});

const text = await res.text();
console.log(res.status, text);
