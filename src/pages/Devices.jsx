import { useState, useEffect } from "react";
import DeviceCard from "../components/DeviceCard";
import { fetchDevices, toggleDeviceApi } from "../services/api";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDevices = async () => {
    try {
      const data = await fetchDevices();
      setDevices(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
      setError("Unable to connect to backend server. Ensure Spring Boot is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();

    // Auto-refresh every 3 seconds for live state & online/offline sync
    const intervalId = setInterval(loadDevices, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const handleToggle = async (id) => {
    try {
      const updatedDevice = await toggleDeviceApi(id);
      setDevices((prevDevices) =>
        prevDevices.map((device) => (device.id === id ? updatedDevice : device))
      );
    } catch (err) {
      console.error(`Failed to toggle device ${id}:`, err);
      alert("Error toggling device. Check backend logs.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Devices</h2>
          <p className="text-sm text-gray-500 mt-1">
            Connected to PostgreSQL & Spring Boot backend (live polling active)
          </p>
        </div>
        <button
          onClick={loadDevices}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium border"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 text-center text-gray-500">Loading devices...</div>
      ) : devices.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">No devices found in database.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              name={device.name}
              type={device.type}
              online={device.online}
              isOn={device.isOn}
              onToggle={() => handleToggle(device.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Devices;