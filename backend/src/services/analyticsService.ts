/**
 * Simulates fetching user behavior data.
 */
export async function getUserBehaviorData(userId: string): Promise<void> {
  console.log(`[analyticsService] Fetching behavior data for user ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 250));
  console.log(`[analyticsService] Behavior data fetched for user ${userId}`);
} 