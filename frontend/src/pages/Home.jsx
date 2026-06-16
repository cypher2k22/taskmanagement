import "./Home.css";

function Home() {
  return (
    <div className="flex">

      {/* SIDEBAR */}
      <aside
        id="collapsible-sidebar"
        className="w-64 border-r min-h-screen bg-gray-900 text-white"
      >
        <div className="p-4">
          <ul className="space-y-3">

            <li>🏠 Home</li>
            <li>👤 Account</li>
            <li>🔔 Notifications</li>
            <li>📧 Email</li>
            <li>📅 Calendar</li>
            <li>🛒 Product</li>
            <li>🔑 Sign In</li>
            <li>🚪 Sign Out</li>

          </ul>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-h-screen bg-gray-100">

        <div className="p-4">
          <button className="px-3 py-2 bg-black text-white rounded">
            ☰ Menu
          </button>
        </div>

        <h1 className="p-4 text-2xl">Welcome Home 🚀</h1>

      </div>

    </div>
  );
}

export default Home;