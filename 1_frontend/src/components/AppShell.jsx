// AppShell.jsx

import React, { useState, useEffect } from "react";
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

  // Setze den leads-Status
  const [leadList, setLeadList] = useState(leads);

  useEffect(() => {
    // Wenn Leads von außen kommen, setze sie in den State
    setLeadList(leads);
  }, [leads]);

  // Filtere die Leads basierend auf dem Suchbegriff
  const filteredLeads = leadList.filter((lead) =>
    [lead.firma, lead.branche, lead.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Funktion zum Erstellen eines neuen Leads
  const handleNewLead = () => {
    const newLead = {
      id: Math.random().toString(36).substr(2, 9), // Zufällige ID für den neuen Lead
      firma: "",
      branche: "",
      status: "neu",
      bewertung: 0,
      ansprechpartner1: "",
      position1: "",
      email1: "",
      telefon1: "",
      ansprechpartner2: "",
      position2: "",
      email2: "",
      telefon2: "",
      notizen: ""
    };

    // Den neuen Lead zur Liste hinzufügen
    setLeadList([...leadList, newLead]);
    setSelectedLead(newLead); // Den neuen Lead als ausgewählten Lead setzen
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold">LeadNova</h1>
          <nav className="space-x-4">
            <a href="/" className="hover:text-blue-300">Home</a>
            <a href="/leads" className="hover:text-blue-300">Leads</a>
            <a href="/settings" className="hover:text-blue-300">Settings</a>
          </nav>
        </div>
      </header>

      <div className="grid grid-cols-5 grid-rows-2 gap-4 p-4 flex-1">
        {/* Sidebar */}
        <div className="col-span-1 row-span-2">
          <Sidebar
            userEmail={userEmail}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onLogout={onLogout}
            leads={filteredLeads}  // Übergeben von gefilterten Leads an die Sidebar
            setSelectedLead={setSelectedLead}  // Funktion zum Setzen des ausgewählten Leads
            statusLevel={statusLevel}  // Scoring-Modell wird an die Sidebar übergeben
            onNewLead={handleNewLead}  // "+ Neuer Lead" Button Funktion
          />
        </div>

        {/* Lead-Editor */}
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

        {/* Dokumente */}
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

        {/* Q4: Notizen - Leeres Feld */}
        <div className="col-span-2 bg-white shadow rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4">📝 Notizen / Historie</h2>
          <p className="text-gray-500 italic">Keine Notizen für dieses Lead.</p>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
