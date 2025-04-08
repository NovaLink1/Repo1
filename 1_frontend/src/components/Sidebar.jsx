// Sidebar.jsx

import React from "react";

const Sidebar = ({
  userEmail,
  searchTerm,
  setSearchTerm,
  onLogout,
  leads,
  setSelectedLead,
  statusLevel,
  onNewLead // Die Funktion zum Erstellen eines neuen Leads
}) => {

  // Berechnung des Fortschrittsbalkens
  const calculateProgress = (status) => {
    return (statusLevel[status] / 4) * 100;
  };

  return (
    <div className="bg-white shadow rounded-xl p-4">
      {/* "+ Neuer Lead" Button über der Suchfunktion */}
      <div className="mb-4">
        <button
          onClick={onNewLead} // Aufruf der Funktion zum Erstellen eines neuen Leads
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          + Neuer Lead
        </button>
      </div>

      {/* Suchfunktion */}
      <h2 className="text-xl font-semibold mb-4">🔍 Lead-Suche</h2>
      <input
        type="text"
        placeholder="Suche nach Leads"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />
      
      <h2 className="text-lg font-semibold mb-4">📝 Leads</h2>
      <ul className="space-y-2">
        {leads.map((lead) => {
          const progress = calculateProgress(lead.status);
          return (
            <li
              key={lead.id}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded"
              onClick={() => setSelectedLead(lead)}
            >
              <p className="font-bold">{lead.firma}</p>
              <p className="text-sm text-gray-500">{lead.branche}</p>
              <p className="text-sm text-gray-600">{lead.status}</p>
              {/* Fortschrittsbalken */}
              <div className="mb-2">
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-green-500 rounded transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6">
        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
