ALTER TABLE submission_service_requests ADD COLUMN IF NOT EXISTS tool_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public_review_requests ADD COLUMN IF NOT EXISTS tool_name TEXT NOT NULL DEFAULT '';
