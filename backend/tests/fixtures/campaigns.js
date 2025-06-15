export const validCampaignData = {
  name: 'Test Campaign',
  description: 'A test campaign',
  status: 'draft',
};

export const scheduledCampaignData = {
  name: 'Scheduled Campaign',
  description: 'Scheduled for later',
  status: 'scheduled',
  scheduledAt: new Date().toISOString(),
}; 