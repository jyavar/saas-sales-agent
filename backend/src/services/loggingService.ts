/**
 * Simulates logging a user interaction.
 */
export async function logUserInteraction(userId: string, campaignId: string, message: string): Promise<void> {
  console.log(`[loggingService] Logging interaction for user ${userId}, campaign ${campaignId}: ${message}`);
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`[loggingService] Interaction logged for user ${userId}, campaign ${campaignId}`);
} 