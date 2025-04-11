// AppShell.jsx – mit Q1–Q3 vollständig integriert

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import LeadDocuments from "./LeadDocuments";
import LeadDetailsEditor from "./LeadDetailsEditor";

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

  const [leadList, setLeadList] = useState(leads);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    setLeadList(leads);
  }, [leads]);

  useEffect(() => {
    setNoteInput(selectedLead?.notizen || "");
  }, [selectedLead]);

  const filteredLeads = leadList.filter((lead) =>
    [lead.firma, lead.branche, lead.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleNewLead = () => {
    const newLead = {
      id: Math.random().toString(36).substr(2, 9),
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
    setLeadList([...leadList, newLead]);
    setSelectedLead(newLead);
  };

  const uploadFileToServer = async (file) => {
    if (!selectedLead?.id) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      // Datei an den Server senden
      const res = await fetch(`http://localhost:8000/upload/${encodeURIComponent(selectedLead.id)}`, {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error("Fehler beim Upload der Datei");
      }
  
      // Dateien nach dem Upload holen
      const updatedFiles = await fetch(`http://localhost:8000/files/${encodeURIComponent(selectedLead.id)}`)
        .then((res) => res.json());
  
      // Überprüfe, ob die Antwort im richtigen Format ist
      if (!Array.isArray(updatedFiles)) {
        console.error("Fehler: Dateien sind nicht im erwarteten Format", updatedFiles);
        return;
      }
  
      // Setze die neuen Dateien im State
      setSavedFiles(updatedFiles);
      
    } catch (error) {
      console.error("Upload fehlgeschlagen:", error);
    }
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

      <div className="grid grid-cols-5 grid-rows-3 gap-4 p-4 flex-1">
        {/* Sidebar */}
        <div className="col-span-1 row-span-3">
          <Sidebar
            userEmail={userEmail}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onLogout={onLogout}
            leads={filteredLeads}
            setSelectedLead={setSelectedLead}
            statusLevel={statusLevel}
            onNewLead={handleNewLead}
          />
        </div>

        {/* Q1: Lead-Details & Bearbeiten */}
        <div className="col-span-2 bg-white shadow rounded-xl p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">🏷️ Lead-Details & ✏️ Bearbeiten</h2>
          <LeadDetailsEditor
            lead={selectedLead}
            onSave={(updatedLead) => {
              onUpdateLead(updatedLead);
              setSelectedLead(updatedLead);
            }}
          />
        </div>

        {/* Q2: Dokumente */}
        <div className="col-span-2 bg-white shadow rounded-xl p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">📎 Dokumente</h2>
          {selectedLead ? (
            <div className="space-y-4">
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  files.forEach((file) => uploadFileToServer(file));
                }}
                onDragOver={(e) => e.preventDefault()}
                className="border-dashed border-2 border-gray-300 p-6 text-center rounded-lg bg-gray-50 hover:border-blue-500"
              >
                <p className="text-gray-500">📂 Datei(en) hierher ziehen oder klicken zum Hochladen</p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files).forEach(uploadFileToServer);
                    e.target.value = "";
                  }}
                  className="hidden"
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="cursor-pointer inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Dateien auswählen
                </label>
              </div>

              <div className="border rounded p-4 bg-gray-100">
                <h3 className="font-semibold mb-2">📁 Bereits gespeicherte Dateien</h3>
                <ul className="text-sm space-y-1 text-blue-700">
                  {Array.isArray(savedFiles) && savedFiles.length === 0 ? (
                    <p className="text-gray-500 italic">Keine gespeicherten Dateien.</p>
                  ) : (
                    savedFiles.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href={`http://localhost:8000${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline break-all"
                        >
                          {file.name}
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Kein Lead ausgewählt.</p>
          )}
        </div>

        {/* Q3: Notizen */}
        <div className="col-span-2 bg-white shadow rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4">📝 Notizen / Historie</h2>
          {selectedLead ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedLead = {
                  ...selectedLead,
                  notizen: noteInput,
                };
                onUpdateLead(updatedLead);
                setSelectedLead(updatedLead);
              }}
              className="space-y-4"
            >
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Hier kannst du deine Notizen eingeben..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                rows={6}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  💾 Notizen speichern
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-500 italic">Kein Lead ausgewählt.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppShell;
