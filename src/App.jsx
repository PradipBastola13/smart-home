import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";

function App() {

  const [page, setPage] = useState("dashboard");

  return (
    <>
      <Navbar />

      <div className="flex">

        <Sidebar setPage={setPage} />

        <main className="flex-1 p-6">

          {page === "dashboard" && <Dashboard />}

          {page === "devices" && <Devices />}

        </main>

      </div>
    </>
  );
}

export default App;