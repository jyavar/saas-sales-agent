import React, { useEffect, useState } from "react";
import { ApiClient } from "../../../backend/frontend/lib/api/client";

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

const formatType = (type: string) => {
  switch (type) {
    case 'analyze': return '🔍 Análisis';
    case 'generate': return '📝 Generación';
    case 'send': return '📤 Envío';
    default: return type;
  }
};

const formatDate = (iso: string) => new Date(iso).toLocaleString();

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        const api = new ApiClient();
        const res = await api.get('/api/agent/activities');
        if (!res.success) throw new Error(res.error?.message || 'API error');
        setActivities(res.data.activities || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching activities');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Loading recent activity...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!activities.length) return <div className="p-4 text-gray-500">No recent activity.</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-bold mb-2">Recent Activity</h3>
      <ul className="space-y-2">
        {activities.map(a => (
          <li key={a.id} className="flex items-center gap-2 text-sm">
            <span>{formatType(a.type)}</span>
            <span className="flex-1">{a.message}</span>
            <span className="text-xs text-gray-400">{formatDate(a.timestamp)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity; 