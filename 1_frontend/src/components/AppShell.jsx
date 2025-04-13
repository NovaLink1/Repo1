// AppShell.jsx – korrigiert: Sidebar-ResizeObserver mit Verzögerung

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
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("sidebarWidth");
    const parsed = saved ? parseInt(saved) : 260;
    return isNaN(parsed) ? 260 : parsed;
  });

  const sidebarRef = useRef();

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLead),
      });

      if (!res.ok) throw new Error(await res.text());

      const savedLead = await res.json();
      setLeadList((prev) => prev.map((lead) => lead.id === savedLead.id ? savedLead : lead));
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

  const startSidebarDrag = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (e) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(180, Math.min(startWidth + delta, 600));
      setSidebarWidth(newWidth);
      localStorage.setItem("sidebarWidth", newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const filteredLeads = leadList.filter((lead) =>
    [lead.firma, lead.branche, lead.status].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emptyLead)
      });

      if (!res.ok) throw new Error("Lead konnte nicht erstellt werden: " + await res.text());

      const createdLead = await res.json();
      setLeadList((prev) => [...prev, createdLead]);
      setSelectedLead(createdLead);
    } catch (error) {
      console.error("❌ Fehler beim Erstellen eines neuen Leads:", error);
      alert("Fehler beim Erstellen des Leads:\n" + error.message);
    }
  };

  const handleDeleteLead = async (lead) => {
    if (!confirm(`❌ Bist du sicher, dass du "${lead.firma}" löschen möchtest?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/leads/${lead.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());

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
      const res = await fetch(`http://localhost:8000/upload/${encodeURIComponent(selectedLead.id)}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Fehler beim Upload der Datei");

      const updatedFiles = await fetch(`http://localhost:8000/files/${encodeURIComponent(selectedLead.id)}`)
        .then((res) => res.json());

      if (!Array.isArray(updatedFiles)) {
        console.error("Fehler: Dateien sind nicht im erwarteten Format", updatedFiles);
        return;
      }

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
          <div className="flex items-center gap-6">
            <nav className="space-x-4">
              <a href="/" className="hover:text-blue-300">Home</a>
              <a href="/leads" className="hover:text-blue-300">Leads</a>
              <a href="/settings" className="hover:text-blue-300">Settings</a>
            </nav>
            <div className="flex items-center gap-3">
              <span className="text-sm italic">{userEmail}</span>
              <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className="overflow-hidden border-r border-gray-200 bg-white shrink-0"
          style={{ minWidth: "180px", maxWidth: "600px", width: `${sidebarWidth}px` }}
        >
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

        {/* Griff zum Ziehen */}
        <div
          onMouseDown={startSidebarDrag}
          className="w-2 cursor-col-resize bg-gray-300 hover:bg-gray-400 transition-colors"
          style={{ zIndex: 50 }}
        />

        {/* Q1 + Q2 */}
        <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
          <div style={{ width: dividerPos }} className="p-4 overflow-y-auto bg-white shadow-inner">
            {selectedLead?.firma && (
              <h2 className="text-3xl font-bold mb-4">{selectedLead.firma}</h2>
            )}
            <LeadDetailsEditor
              lead={selectedLead}
              onSave={onUpdateLead}
              onClose={() => setSelectedLead(null)}
              onDelete={handleDeleteLead}
            />
          </div>

          <div
            onMouseDown={startDrag}
            className="w-2 cursor-col-resize bg-gray-300 hover:bg-gray-400 transition"
          />

          <div className="flex-1 p-4 overflow-y-auto bg-white shadow-inner border-l">
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
