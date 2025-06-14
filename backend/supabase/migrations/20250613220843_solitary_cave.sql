/*
  # Create leads table for Strato AI Sales Agent

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `tenant_id` (uuid, references tenants)
      - `email` (text, unique per tenant)
      - `first_name` (text)
      - `last_name` (text)
      - `company` (text, optional)
      - `job_title` (text, optional)
      - `phone` (text, optional)
      - `website` (text, optional)
      - `linkedin_url` (text, optional)
      - `status` (text, lead status)
      - `source` (text, lead source)
      - `priority` (text, lead priority)
      - `score` (integer, lead score 0-100)
      - `qualification_notes` (text, optional)
      - `tags` (jsonb, array of tags)
      - `custom_fields` (jsonb, flexible data)
      - `last_contacted_at` (timestamptz, optional)
      - `next_follow_up_at` (timestamptz, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references auth.users)
      - `updated_by` (uuid, references auth.users)

    - `lead_interactions`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, references leads)
      - `agent_id` (text, AI agent identifier)
      - `interaction_type` (text, type of interaction)
      - `summary` (text, interaction summary)
      - `outcome` (text, optional outcome)
      - `confidence` (decimal, AI confidence score)
      - `metadata` (jsonb, additional data)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for tenant-based access
    - Users can only access leads from their tenant

  3. Indexes
    - Performance indexes for common queries
    - Email uniqueness per tenant
    - Status and priority filtering
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  job_title TEXT,
  phone TEXT,
  website TEXT,
  linkedin_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost', 'nurturing')),
  source TEXT DEFAULT 'manual' CHECK (source IN ('website', 'social_media', 'email_campaign', 'referral', 'ai_agent', 'manual', 'api')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  qualification_notes TEXT,
  tags JSONB DEFAULT '[]',
  custom_fields JSONB DEFAULT '{}',
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create lead_interactions table
CREATE TABLE IF NOT EXISTS lead_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('email', 'call', 'message', 'analysis', 'qualification')),
  summary TEXT NOT NULL,
  outcome TEXT,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for leads table
CREATE POLICY "Users can read own tenant leads" ON leads
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can create leads in own tenant" ON leads
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can update own tenant leads" ON leads
  FOR UPDATE USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can delete own tenant leads" ON leads
  FOR DELETE USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Create policies for lead_interactions table
CREATE POLICY "Users can read own tenant lead interactions" ON lead_interactions
  FOR SELECT USING (
    lead_id IN (
      SELECT id FROM leads WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

CREATE POLICY "Users can create lead interactions in own tenant" ON lead_interactions
  FOR INSERT WITH CHECK (
    lead_id IN (
      SELECT id FROM leads WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

-- Create unique constraint for email per tenant
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_tenant ON leads(email, tenant_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at);
CREATE INDEX IF NOT EXISTS idx_leads_last_contacted_at ON leads(last_contacted_at) WHERE last_contacted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_next_follow_up_at ON leads(next_follow_up_at) WHERE next_follow_up_at IS NOT NULL;

-- Create indexes for lead_interactions
CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_agent_id ON lead_interactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_type ON lead_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_created_at ON lead_interactions(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();