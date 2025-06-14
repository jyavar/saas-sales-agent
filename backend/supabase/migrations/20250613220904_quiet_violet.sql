/*
  # Create agent_actions table for CURSOR agent interactions

  1. New Tables
    - `agent_actions`
      - `id` (uuid, primary key)
      - `tenant_id` (uuid, references tenants)
      - `action_type` (text, type of action)
      - `agent_id` (text, agent identifier)
      - `agent_name` (text, optional agent name)
      - `agent_version` (text, optional agent version)
      - `priority` (text, action priority)
      - `priority_score` (integer, calculated priority score)
      - `status` (text, action status)
      - `target_type` (text, optional target type)
      - `target_id` (uuid, optional target ID)
      - `payload` (jsonb, action payload)
      - `context` (jsonb, execution context)
      - `results` (jsonb, action results)
      - `scheduled_at` (timestamptz, optional scheduled time)
      - `expires_at` (timestamptz, optional expiration)
      - `retry_config` (jsonb, retry configuration)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references auth.users)
      - `updated_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on agent_actions table
    - Add policies for tenant-based access
    - Users can only access actions from their tenant

  3. Indexes
    - Performance indexes for common queries
    - Action type and status filtering
    - Priority and scheduling queries
*/

-- Create agent_actions table
CREATE TABLE IF NOT EXISTS agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'create_lead', 'update_lead', 'qualify_lead', 'score_lead',
    'send_email', 'schedule_call', 'send_message',
    'analyze_company', 'research_contact', 'sentiment_analysis',
    'trigger_workflow', 'update_pipeline', 'create_task',
    'generate_report', 'update_metrics',
    'health_check', 'log_event'
  )),
  agent_id TEXT NOT NULL,
  agent_name TEXT,
  agent_version TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  priority_score INTEGER DEFAULT 2,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  target_type TEXT CHECK (target_type IN ('lead', 'campaign', 'workflow', 'system', 'report')),
  target_id UUID,
  payload JSONB DEFAULT '{}',
  context JSONB DEFAULT '{}',
  results JSONB DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  retry_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;

-- Create policies for agent_actions table
CREATE POLICY "Users can read own tenant agent actions" ON agent_actions
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can create agent actions in own tenant" ON agent_actions
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can update own tenant agent actions" ON agent_actions
  FOR UPDATE USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_actions_tenant_id ON agent_actions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agent_actions_action_type ON agent_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_agent_actions_agent_id ON agent_actions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_actions_status ON agent_actions(status);
CREATE INDEX IF NOT EXISTS idx_agent_actions_priority ON agent_actions(priority);
CREATE INDEX IF NOT EXISTS idx_agent_actions_priority_score ON agent_actions(priority_score);
CREATE INDEX IF NOT EXISTS idx_agent_actions_target_type ON agent_actions(target_type);
CREATE INDEX IF NOT EXISTS idx_agent_actions_target_id ON agent_actions(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_agent_actions_created_at ON agent_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_actions_updated_at ON agent_actions(updated_at);
CREATE INDEX IF NOT EXISTS idx_agent_actions_scheduled_at ON agent_actions(scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_agent_actions_expires_at ON agent_actions(expires_at) WHERE expires_at IS NOT NULL;

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_agent_actions_status_priority ON agent_actions(status, priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_agent_actions_tenant_status ON agent_actions(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_agent_actions_agent_status ON agent_actions(agent_id, status);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_agent_actions_updated_at 
  BEFORE UPDATE ON agent_actions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();