/*
  # Campaigns and Email Tracking Tables

  1. New Tables
    - `campaigns`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `tenant_id` (uuid, references tenants)
      - `name` (text, campaign name)
      - `subject` (text, email subject)
      - `body` (text, email body HTML)
      - `template_id` (uuid, optional template reference)
      - `status` (text, campaign status)
      - `schedule_at` (timestamptz, scheduled send time)
      - `total_recipients` (integer, total recipients)
      - `sent_count` (integer, emails sent)
      - `open_count` (integer, emails opened)
      - `click_count` (integer, emails clicked)
      - `metadata` (jsonb, additional data)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `campaign_logs`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, references campaigns)
      - `lead_id` (uuid, references leads)
      - `email` (text, recipient email)
      - `status` (text, email status)
      - `error` (text, error message if failed)
      - `sent_at` (timestamptz, sent timestamp)
      - `delivered_at` (timestamptz, delivered timestamp)
      - `opened_at` (timestamptz, opened timestamp)
      - `clicked_at` (timestamptz, clicked timestamp)
      - `metadata` (jsonb, additional tracking data)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for tenant-based access
    - Users can only access campaigns from their tenant

  3. Indexes
    - Performance indexes for common queries
    - Campaign status and tenant filtering
    - Log status and timestamp queries
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'failed', 'cancelled', 'deleted')),
  schedule_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create campaign_logs table
CREATE TABLE IF NOT EXISTS campaign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_id UUID,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'complained', 'cancelled', 'deleted')),
  error TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for campaigns table
CREATE POLICY "Users can read own tenant campaigns" ON campaigns
  FOR SELECT USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create campaigns in own tenant" ON campaigns
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT id FROM tenants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own tenant campaigns" ON campaigns
  FOR UPDATE USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own tenant campaigns" ON campaigns
  FOR DELETE USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE owner_id = auth.uid()
    )
  );

-- Create policies for campaign_logs table
CREATE POLICY "Users can read own tenant campaign logs" ON campaign_logs
  FOR SELECT USING (
    campaign_id IN (
      SELECT id FROM campaigns WHERE tenant_id IN (
        SELECT id FROM tenants WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create campaign logs in own tenant" ON campaign_logs
  FOR INSERT WITH CHECK (
    campaign_id IN (
      SELECT id FROM campaigns WHERE tenant_id IN (
        SELECT id FROM tenants WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update own tenant campaign logs" ON campaign_logs
  FOR UPDATE USING (
    campaign_id IN (
      SELECT id FROM campaigns WHERE tenant_id IN (
        SELECT id FROM tenants WHERE owner_id = auth.uid()
      )
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaigns_tenant_id ON campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_schedule_at ON campaigns(schedule_at) WHERE schedule_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_updated_at ON campaigns(updated_at);

CREATE INDEX IF NOT EXISTS idx_campaign_logs_campaign_id ON campaign_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_lead_id ON campaign_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_email ON campaign_logs(email);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_status ON campaign_logs(status);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_sent_at ON campaign_logs(sent_at) WHERE sent_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_campaign_logs_opened_at ON campaign_logs(opened_at) WHERE opened_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_campaign_logs_clicked_at ON campaign_logs(clicked_at) WHERE clicked_at IS NOT NULL;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_campaigns_updated_at 
  BEFORE UPDATE ON campaigns 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();