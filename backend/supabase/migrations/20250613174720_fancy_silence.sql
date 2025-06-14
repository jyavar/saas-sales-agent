/*
  # Webhook Logs Table for Idempotency

  1. New Tables
    - `webhook_logs`
      - `id` (uuid, primary key)
      - `provider` (text, webhook provider: stripe, github, resend)
      - `event_id` (text, external event ID)
      - `event_type` (text, event type)
      - `status` (text, processing status)
      - `request_id` (text, internal request ID)
      - `payload` (jsonb, webhook payload)
      - `response` (jsonb, processing response)
      - `error` (text, error message if failed)
      - `processing_time` (integer, processing time in ms)
      - `retry_count` (integer, number of retry attempts)
      - `processed_at` (timestamptz, when event was processed)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on webhook_logs table
    - Add policies for system access only

  3. Indexes
    - Performance indexes for idempotency checks
    - Provider and event type filtering
    - Cleanup queries by date
*/

-- Create webhook_logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'github', 'resend')),
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retrying')),
  request_id TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  response JSONB DEFAULT '{}',
  error TEXT,
  processing_time INTEGER DEFAULT 0,
  retry_count INTEGER DEFAULT 0,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for system access only (no user access)
CREATE POLICY "System access only" ON webhook_logs
  FOR ALL
  TO service_role
  USING (true);

-- Create unique index for idempotency
CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_logs_provider_event_id 
  ON webhook_logs(provider, event_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhook_logs_provider ON webhook_logs(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_processed_at ON webhook_logs(processed_at) WHERE processed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_webhook_logs_request_id ON webhook_logs(request_id);

-- Create function to update processed_at timestamp
CREATE OR REPLACE FUNCTION update_webhook_processed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('completed', 'failed') AND OLD.status NOT IN ('completed', 'failed') THEN
    NEW.processed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update processed_at
CREATE TRIGGER update_webhook_logs_processed_at 
  BEFORE UPDATE ON webhook_logs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_webhook_processed_at();