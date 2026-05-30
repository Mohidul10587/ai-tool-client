CREATE TABLE IF NOT EXISTS pricing_settings (
  key TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT ''
);

ALTER TABLE pricing_settings DISABLE ROW LEVEL SECURITY;

INSERT INTO pricing_settings (key, title, subtitle, price) VALUES
  ('premium_listing',    'Premium Listing',    'one-time',   '9'),
  ('featured_spot',      'Featured Spot',      '/ month',    '89'),
  ('submission_60',      '60 Directories',     'one-time',   '149'),
  ('submission_110',     '110 Directories',    'one-time',   '249'),
  ('public_review',      'Public Review',      'one-time',   '199')
ON CONFLICT (key) DO NOTHING;
