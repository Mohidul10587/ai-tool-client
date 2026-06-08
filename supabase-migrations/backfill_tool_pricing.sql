-- Backfill NULL pricing values to 'Free'
UPDATE tool_submissions SET pricing = 'Free' WHERE pricing IS NULL;
