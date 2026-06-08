-- Add social link fields to site_settings
INSERT INTO site_settings (key, value) VALUES
  ('social_twitter',  ''),
  ('social_facebook', ''),
  ('social_linkedin', ''),
  ('social_email',    '')
ON CONFLICT (key) DO NOTHING;
