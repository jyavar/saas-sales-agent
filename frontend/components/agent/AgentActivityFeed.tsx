import React from 'react';

export interface AgentActivity {
  timestamp: string;
  userId: string;
  eventType: string;
  campaignId?: string;
  message: string;
}

interface AgentActivityFeedProps {
  activities: AgentActivity[];
}

const eventIcons: Record<string, JSX.Element> = {
  CAMPAIGN_STARTED: <span className="text-green-500">🚀</span>,
  CAMPAIGN_VIEWED: <span className="text-blue-500">👁️</span>,
  ACTION_TAKEN: <span className="text-yellow-500">⚡</span>,
};

export const AgentActivityFeed: React.FC<AgentActivityFeedProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <div className="text-gray-400 text-center py-8">No agent activity yet.</div>;
  }
  return (
    <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-md">
      {activities.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map((act, idx) => (
        <li key={idx} className="flex items-center px-4 py-3 hover:bg-gray-50 transition">
          <div className="mr-4 text-2xl">
            {eventIcons[act.eventType] || <span className="text-gray-400">🤖</span>}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{act.eventType.replace('_', ' ')}</div>
            <div className="text-sm text-gray-500">User: {act.userId} {act.campaignId && <>| Campaign: {act.campaignId}</>}</div>
            <div className="text-xs text-gray-400">{new Date(act.timestamp).toLocaleString()}</div>
            <div className="mt-1 text-gray-700 text-sm">{act.message}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}; 