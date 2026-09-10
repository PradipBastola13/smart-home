function DeviceCard({ name, type, online, isOn, onToggle }) {
  return (
    <div
      className={`rounded-lg shadow p-5 bg-white border transition-all ${
        isOn ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-500 text-sm">{type}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Power status badge: ON or OFF */}
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              isOn ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            {isOn ? "ON" : "OFF"}
          </span>

          {/* Connection status badge */}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${
              online
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {online ? "● Online" : "○ Offline"}
          </span>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={onToggle}
        className={`mt-5 w-full px-4 py-2 rounded font-medium transition cursor-pointer ${
          isOn
            ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isOn ? "Turn Off" : "Turn On"}
      </button>

      {!online && (
        <p className="text-[11px] text-gray-400 text-center mt-2">
          Hardware offline (toggling updates PostgreSQL backend state)
        </p>
      )}
    </div>
  );
}

export default DeviceCard;