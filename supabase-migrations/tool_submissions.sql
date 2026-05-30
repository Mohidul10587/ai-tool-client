-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS tool_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  -- fields admin fills in before publishing
  name TEXT,
  slug TEXT UNIQUE,
  category TEXT,
  pricing TEXT CHECK (pricing IN ('Free', 'Paid', 'Freemium')),
  overview TEXT,
  key_features JSONB,
  use_cases JSONB,
  pricing_info JSONB,
  pros TEXT[],
  cons TEXT[],
  logo_url TEXT,
  hero_image_url TEXT,
  platform TEXT,
  -- workflow
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tool_submissions DISABLE ROW LEVEL SECURITY;
