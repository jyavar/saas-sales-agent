import { useState } from 'react';

export type OrchestratorEvent = 'CAMPAIGN_STARTED' | 'CAMPAIGN_VIEWED' | 'ACTION_TAKEN';

export interface OrchestratePayload {
  userId: string;
  eventType: OrchestratorEvent;
  metadata?: Record<string, any>;
}

export function useOrchestrator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function sendOrchestration(payload: OrchestratePayload) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
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