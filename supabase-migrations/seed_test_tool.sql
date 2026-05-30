-- Seed full details for the tool with slug = 'test'
-- Run in Supabase Dashboard → SQL Editor

-- Drop the trigger temporarily (postgres role can do this)
DROP TRIGGER IF EXISTS restrict_update_to_url_only ON tool_submissions;

UPDATE tool_submissions
SET
  name                = 'TestAI',
  status              = 'published',
  url                 = 'https://www.openai.com',
  logo_url            = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1280px-OpenAI_Logo.svg.png',
  hero_image_url      = 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
  pricing             = 'Freemium',
  platform            = 'Web, iOS, Android, API',
  subcategory_snapshot = 'Chat',

  overview = 'TestAI is a next-generation AI assistant that combines powerful language understanding with real-time web access to help you write, research, code, and create — all in one place. Whether you are a developer building integrations or a professional looking to supercharge your workflow, TestAI adapts to your needs with unmatched accuracy and speed.',

  key_features = '[
    {"title": "Conversational AI", "description": "Engage in natural, context-aware conversations that remember your preferences and adapt to your communication style."},
    {"title": "Real-Time Web Search", "description": "Access up-to-date information from the web directly within your chat, eliminating the need to switch tabs."},
    {"title": "Code Generation & Review", "description": "Generate, explain, debug, and refactor code across 30+ programming languages with inline suggestions."},
    {"title": "Document Analysis", "description": "Upload PDFs, spreadsheets, or images and get instant summaries, insights, and Q&A on the content."},
    {"title": "Image Generation", "description": "Create stunning visuals from text prompts using state-of-the-art diffusion models built right into the chat."},
    {"title": "API & Integrations", "description": "Connect TestAI to your existing tools via REST API, webhooks, or native plugins for Slack, Notion, and more."}
  ]'::jsonb,

  use_cases = '[
    {"title": "Content Creation", "audience": "Writers & Marketers", "description": "Draft blog posts, social media copy, email campaigns, and ad creatives in seconds with brand-consistent tone."},
    {"title": "Software Development", "audience": "Developers & Engineers", "description": "Accelerate development cycles by generating boilerplate, writing tests, and reviewing pull requests automatically."},
    {"title": "Academic Research", "audience": "Students & Researchers", "description": "Summarize papers, compare sources, generate citations, and explore complex topics with guided explanations."}
  ]'::jsonb,

  pricing_info = '{
    "model": "Freemium",
    "paidFrom": "$20 / month",
    "billingFrequency": "Monthly or Annual",
    "freeTrial": "14-day free trial on Pro plan"
  }'::jsonb,

  pros = ARRAY[
    'Extremely fast response times even on complex queries',
    'Supports multimodal inputs: text, images, and files',
    'Generous free tier with no credit card required',
    'Robust API with detailed documentation',
    'Regular model updates with no extra cost'
  ],

  cons = ARRAY[
    'Advanced features locked behind Pro subscription',
    'Occasional hallucinations on niche or highly technical topics',
    'No offline mode available'
  ]

WHERE slug = 'test';

-- Recreate the trigger
CREATE TRIGGER restrict_update_to_url_only
  BEFORE UPDATE ON tool_submissions
  FOR EACH ROW EXECUTE FUNCTION restrict_update_to_url_only();

-- Re-enable the trigger
ALTER TABLE tool_submissions ENABLE TRIGGER restrict_update_to_url_only;
