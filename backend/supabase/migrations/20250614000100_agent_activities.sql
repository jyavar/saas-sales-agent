-- Create agent_activities table for AI orchestrator activity feed
CREATE TABLE IF NOT EXISTS agent_activities (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  campaign_id TEXT,
  message TEXT NOT NULL
);

-- Index for recent activity queries
CREATE INDEX IF NOT EXISTS idx_agent_activities_timestamp ON agent_activities(timestamp DESC);

-- (Opcional) RLS y políticas si se requiere multi-tenant 