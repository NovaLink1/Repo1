import React from "react";

const Sidebar = ({ searchTerm, setSearchTerm, onLogout, userEmail }) => {
  return (
    <div className="h-full flex flex-col justify-between p-4 bg-white shadow rounded-xl">
      {/* Top: User + Suche */}
      <div className="space-y-6">
        <div className="text-sm text-gray-700">
          👤 Eingeloggt als:
          <div className="font-semibold break-words">{userEmail}</div>
        </div>

        <input
          type="text"
          placeholder="🔍 Suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Bottom: Logout */}
      <div className="pt-8">
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;