import { useState, useEffect } from "react";
import { fetchDevices } from "../services/api";

function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchDevices();
      setDevices(data);
    } catch (err) {
      console.error("Dashboard failed to fetch devices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = devices.filter((d) => d.online).length;
  const offlineCount = devices.filter((d) => !d.online).length;
  const activeCount = devices.filter((d) => d.isOn).length;

  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="text-sm text-gray-500 mt-1">
        Live overview backed by PostgreSQL database
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Online Devices</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {loading ? "..." : onlineCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Responding to heartbeats</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Offline Devices</p>
          <p className="text-3xl font-bold text-red-500 mt-2">
            {loading ? "..." : offlineCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Not connected / waiting</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Active (Powered ON)</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {loading ? "..." : activeCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Currently switched ON</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;