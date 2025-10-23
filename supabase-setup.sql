-- Supabase Table Setup for YouTube Stats Chainlink Adapter
-- Run this script in your Supabase SQL Editor

-- Create the adapter_state table
CREATE TABLE IF NOT EXISTS adapter_state (
    id TEXT PRIMARY KEY,
    last_views_count INTEGER DEFAULT 0,
    last_likes_count INTEGER DEFAULT 0,
    last_likes_triggered_multiple INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on updated_at for better query performance
CREATE INDEX IF NOT EXISTS idx_adapter_state_updated_at ON adapter_state(updated_at);

-- Enable Row Level Security
ALTER TABLE adapter_state ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations with service role
-- This is necessary since you're using the service_role key
CREATE POLICY "Enable all operations for service role"
ON adapter_state
FOR ALL
USING (true)
WITH CHECK (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS update_adapter_state_updated_at ON adapter_state;
CREATE TRIGGER update_adapter_state_updated_at
    BEFORE UPDATE ON adapter_state
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view to see recent state changes
CREATE OR REPLACE VIEW adapter_state_recent AS
SELECT 
    id as video_id,
    last_views_count,
    last_likes_count,
    last_likes_triggered_multiple,
    updated_at,
    created_at,
    EXTRACT(EPOCH FROM (NOW() - updated_at)) / 60 as minutes_since_last_update
FROM adapter_state
ORDER BY updated_at DESC;

-- Grant necessary permissions (if needed)
GRANT ALL ON adapter_state TO authenticated;
GRANT ALL ON adapter_state TO anon;
GRANT ALL ON adapter_state TO service_role;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Supabase tables created successfully!';
    RAISE NOTICE 'Check your Supabase URL in Settings > API';
    RAISE NOTICE 'Table: adapter_state';
END $$;
