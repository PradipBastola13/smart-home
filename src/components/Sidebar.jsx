function Sidebar({ setPage }) {
  return (
    <aside className="w-60 min-h-screen bg-white border-r p-4">

      <button
        onClick={() => setPage("dashboard")}
        className="block w-full text-left p-3 hover:bg-gray-100"
      >
        Dashboard
      </button>

      <button
        onClick={() => setPage("devices")}
        className="block w-full text-left p-3 hover:bg-gray-100"
      >
        Devices
      </button>

    </aside>
  );
}

export default Sidebar;