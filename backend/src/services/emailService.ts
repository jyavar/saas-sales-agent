/**
 * Simulates sending a campaign email to a user.
 */
export async function sendCampaignEmail(userId: string, campaignId: string): Promise<void> {
  console.log(`[emailService] Sending campaign email to user ${userId} for campaign ${campaignId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`[emailService] Email sent to user ${userId} for campaign ${campaignId}`);
} 