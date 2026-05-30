-- Check for triggers on tool_submissions table
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'tool_submissions';

-- Check the actual columns in the table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tool_submissions'
ORDER BY ordinal_position;
