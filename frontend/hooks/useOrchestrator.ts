import { useState } from 'react';
import { useSession } from 'next-auth/react';

export type OrchestratorEvent = 'CAMPAIGN_STARTED' | 'CAMPAIGN_VIEWED' | 'ACTION_TAKEN';

export interface OrchestratePayload {
  userId: string;
  eventType: OrchestratorEvent;
  metadata?: Record<string, any>;
}

/**
 * Returns a user ID (prefer id, fallback to email) from session.user.
 */
function getUserId(user: { id?: string; email?: string | null }): string | undefined {
  return user?.id || user?.email || undefined;
}

/**
 * Hook to orchestrate agent events with real user session.
 * Throws if user is not authenticated.
 */
export function useOrchestrator() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function sendOrchestration(eventType: OrchestratorEvent, metadata?: Record<string, any>) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const userId = getUserId(session?.user as { id?: string; email?: string | null });
      if (!userId) throw new Error('User not authenticated');
      const payload: OrchestratePayload = { userId, eventType, metadata };
      const res = await fetch('/api/agent/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Orchestration failed');
      setSuccess(true);
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.success('Orchestration complete');
      }
      return data;
    } catch (err: any) {
      setError(err.message);
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.error(err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { sendOrchestration, loading, error, success };
} 