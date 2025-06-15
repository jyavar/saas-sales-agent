import React, { useEffect, useState } from "react";
import { ApiClient } from "../../../backend/frontend/lib/api/client";

/**
 * Placeholder for the Performance Chart component.
 */
const PerformanceChart: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const api = new ApiClient();
        const res = await api.get("/api/analytics/campaigns");
        if (!res.success) throw new Error(res.error?.message || "API error");
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Loading performance data...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-4 text-gray-500">No data available.</div>;

  // Aquí iría el gráfico real, por ahora mostramos los datos en JSON
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-bold mb-2">Campaign Performance</h3>
      <pre className="text-xs overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default PerformanceChart; 