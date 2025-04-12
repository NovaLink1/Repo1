import React from "react";

const Sidebar = ({
  userEmail,
  searchTerm,
  setSearchTerm,
  leads,
  setSelectedLead,
  statusLevel,
  onNewLead
}) => {
  const calculateProgress = (status) => {
    return (statusLevel[status] / 4) * 100;
  };

  return (
    <div className="bg-white p-4 h-screen flex flex-col overflow-hidden">
      {/* Fixer Bereich oben */}
      <div className="shrink-0">
        <button
          onClick={onNewLead}
          className="w-full bg-blue-600 text-white p-2 rounded mb-2"
        >
          + Neuer Lead
        </button>
        <input
          type="text"
          placeholder="Suche nach Leads"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <h2 className="text-lg font-semibold mb-2">📝 Leads</h2>
      </div>

      {/* Scrollbarer Bereich */}
      <div className="overflow-y-auto pr-1 max-h-[460px]">

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
      </div>
    </div>
  );
};

export default Sidebar;
