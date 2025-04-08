import React from "react";
import Sidebar from "./Sidebar";
import LeadEditor from "./LeadEditor";
import LeadDocuments from "./LeadDocuments";

const AppShell = ({
  userEmail,
  searchTerm,
  setSearchTerm,
  onLogout,
  leads = [],
  selectedLead,
  setSelectedLead,
  onUpdateLead,
  savedFiles,
  setSavedFiles
}) => {
  const statusLevel = {
    neu: 1,
    interessiert: 2,
    kontaktiert: 3,
    partnerschaft: 4
  };

  const filteredLeads = leads.filter((lead) =>
    [lead.firma, lead.branche, lead.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-5 grid-rows-2 gap-4 h-screen p-4 bg-gray-100">
      {/* Sidebar */}
      <div className="col-span-1 row-span-2">
        <Sidebar
          userEmail={userEmail}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onLogout={onLogout}
        />
      </div>

      {/* Q1: Leadliste */}
      <div className="col-span-2 bg-white shadow rounded-xl p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">🔍 Leadliste</h2>
        {filteredLeads.length === 0 ? (
          <p className="text-gray-500 italic">Keine Treffer gefunden.</p>
        ) : (
          filteredLeads.map((lead) => {
            const progress = (statusLevel[lead.status] / 4) * 100;
            return (
              <div
                key={lead.id}
                className="border p-3 rounded shadow bg-white text-black mb-4"
              >
                <h2
                  className="text-lg font-bold text-blue-700 hover:underline cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  {lead.firma}
                </h2>
                <p className="text-sm text-gray-600">🧱 {lead.branche}</p>
                <div className="text-sm text-gray-600 mb-1">
                  📍 {lead.status} · ⭐ {lead.bewertung}
                </div>
                {/* Status-Fortschrittsbalken */}
                <div className="mb-2">
                  <div className="h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-green-500 rounded transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Q2: Lead-Editor */}
      <div className="col-span-2 bg-white shadow rounded-xl p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">📋 Lead bearbeiten</h2>
        {selectedLead ? (
          <LeadEditor
            lead={selectedLead}
            onSave={(updatedLead) => {
              onUpdateLead(updatedLead);
              setSelectedLead(updatedLead);
            }}
          />
        ) : (
          <p className="text-gray-500 italic">Kein Lead ausgewählt.</p>
        )}
      </div>

      {/* Q3: Dokumente */}
      <div className="col-span-2 bg-white shadow rounded-xl p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">📎 Dokumente</h2>
        {selectedLead ? (
          <LeadDocuments
            savedFiles={savedFiles}
            setSavedFiles={setSavedFiles}
          />
        ) : (
          <p className="text-gray-500 italic">Kein Lead ausgewählt.</p>
        )}
      </div>

      {/* Q4: Notizen */}
      <div className="col-span-2 bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">📝 Notizen / Historie</h2>
        <p className="text-gray-500 italic">Notizverwaltung folgt…</p>
      </div>
    </div>
  );
};

export default AppShell;