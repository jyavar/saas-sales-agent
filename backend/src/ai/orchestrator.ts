import { sendCampaignEmail } from '../services/emailService.js';
import { logUserInteraction } from '../services/loggingService.js';
import { getUserBehaviorData } from '../services/analyticsService.js';

export type OrchestratorEvent = 'CAMPAIGN_STARTED' | 'CAMPAIGN_VIEWED' | 'ACTION_TAKEN';

export interface OrchestrateEventPayload {
  userId: string;
  campaignId: string;
  event: OrchestratorEvent;
  metadata?: Record<string, any>;
}

/**
 * Orchestrates user events in the system.
 * @param payload - Event payload
 */
export async function orchestrateEvent(payload: OrchestrateEventPayload): Promise<void> {
  const { userId, campaignId, event, metadata } = payload;
  if (event === 'CAMPAIGN_STARTED') {
    await sendCampaignEmail(userId, campaignId);
  }
  if (event === 'CAMPAIGN_VIEWED') {
    await getUserBehaviorData(userId);
  }
  await logUserInteraction(userId, campaignId, `Event: ${event}${metadata ? ', Metadata: ' + JSON.stringify(metadata) : ''}`);
} 