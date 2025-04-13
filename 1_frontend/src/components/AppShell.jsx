// AppShell.jsx – mit Q1–Q3 vollständig integriert

import React, { useState, useEffect, useRef } from "react";
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
    setLeadList(leads);
  }, [leads]);
  
  useEffect(() => {
    setNoteInput(selectedLead?.notizen || "");
  }, [selectedLead]);
  
  const onUpdateLead = async (updatedLead) => {
    try {
      const res = await fetch(`http://localhost:8000/leads/${updatedLead.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLead),
      });
  
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
  
      const savedLead = await res.json();
  
      setLeadList((prev) =>
        prev.map((lead) =>
          lead.id === savedLead.id ? savedLead : lead
        )
      );
      setSelectedLead(savedLead);
    } catch (error) {
      console.error("❌ Fehler beim Speichern des Leads:", error);
      alert("Fehler beim Speichern:\n" + error.message);
    }
  };
  
  const [dividerPos, setDividerPos] = useState(600);
const containerRef = useRef();

const startDrag = (e) => {
  e.preventDefault();
  const startX = e.clientX;
  const startWidth = dividerPos;

  const onMouseMove = (e) => {
    const delta = e.clientX - startX;
    const newWidth = Math.max(300, Math.min(startWidth + delta, containerRef.current.offsetWidth - 300));
    setDividerPos(newWidth);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};
  
  const filteredLeads = leadList.filter((lead) =>
    [lead.firma, lead.branche, lead.status]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  
  const handleNewLead = async () => {
    const emptyLead = {
      firma: "",
      branche: "",
      status: "neu",
      bewertung: 0,
      notizen: "",
      ansprechpartner1: "",
      position1: "",
      email1: "",
      telefon1: "",
      ansprechpartner2: "",
      position2: "",
      email2: "",
      telefon2: ""
    };
  
    try {
      const res = await fetch("http://localhost:8000/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emptyLead)
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lead konnte nicht erstellt werden: ${errorText}`);
      }
  
      const createdLead = await res.json();
      setLeadList((prev) => [...prev, createdLead]);
      setSelectedLead(createdLead);
    } catch (error) {
      console.error("❌ Fehler beim Erstellen eines neuen Leads:", error);
      alert("Fehler beim Erstellen des Leads:\n" + error.message);
    }
  };
  
  
  const handleDeleteLead = async (lead) => {
    const confirmed = confirm(`❌ Bist du sicher, dass du "${lead.firma}" löschen möchtest?`);
    if (!confirmed) return;
  
    try {
      const res = await fetch(`http://localhost:8000/leads/${lead.id}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
  
      setLeadList((prev) => prev.filter((l) => l.id !== lead.id));
      setSelectedLead(null);
    } catch (error) {
      console.error("❌ Fehler beim Löschen des Leads:", error);
      alert("Fehler beim Löschen:\n" + error.message);
    }
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
          {/* App-Name */}
          <h1 className="text-2xl font-semibold">LeadNova</h1>
  
          {/* Navigation + Benutzerbereich */}
          <div className="flex items-center gap-6">
            <nav className="space-x-4">
              <a href="/" className="hover:text-blue-300">Home</a>
              <a href="/leads" className="hover:text-blue-300">Leads</a>
              <a href="/settings" className="hover:text-blue-300">Settings</a>
            </nav>
  
            <div className="flex items-center gap-3">
              <span className="text-sm italic">{userEmail}</span>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
  
      {/* Main Layout: Sidebar + Q1 + Q2 */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (fixe Breite) */}
        <div className="w-64 border-r overflow-y-auto">
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
  
        {/* Rechte Seite: Q1 + Q2 */}
        
        {/* Rechte Seite: Q1 + Q2 */}
<div ref={containerRef} className="flex flex-1 overflow-hidden relative">
  {/* Q1: Lead-Details */}
  <div style={{ width: dividerPos }} className="p-4 overflow-y-auto bg-white shadow-inner">
    <h2 className="text-xl font-semibold mb-4">🏷️ Lead-Details & ✏️ Bearbeiten</h2>
    <LeadDetailsEditor
      lead={selectedLead}
      onSave={onUpdateLead}
      onClose={() => setSelectedLead(null)}
      onDelete={handleDeleteLead}
    />
  </div>

  {/* Drag-Leiste */}
  <div
    onMouseDown={startDrag}
    className="w-2 cursor-col-resize bg-gray-300 hover:bg-gray-400 transition"
  />

  {/* Q2: Dokumente */}
  <div className="flex-1 p-4 overflow-y-auto bg-white shadow-inner border-l">
    <h2 className="text-xl font-semibold mb-4">📎 Dokumente</h2>
    <LeadDocuments
      selectedLead={selectedLead}
      savedFiles={savedFiles}
      setSavedFiles={setSavedFiles}
    />
  </div>
</div>

      </div>
    </div>
  );
};
  export default AppShell;
  
