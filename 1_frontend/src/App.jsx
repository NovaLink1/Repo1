import React, { useState, useEffect } from "react";
import AppShell from "./components/AppShell";
import LoginForm from "./components/LoginForm";
import { fetchWithAuth } from "./utils/api";

const App = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [leadFiles, setLeadFiles] = useState({});

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/leads/")
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch((err) => console.error("Fehler beim Laden der Leads:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("leadnova_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleUpdateLead = (updatedLead) => {
    fetch(`http://localhost:8000/leads/${updatedLead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedLead),
    })
      .then((res) => res.json())
      .then((updated) =>
        setLeads(leads.map((lead) => (lead.id === updated.id ? updated : lead)))
      )
      .catch((err) => console.error("Fehler beim Aktualisieren:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("leadnova_token");
    setIsLoggedIn(false);
  };

  return !isLoggedIn ? (
    <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
  ) : (
    <AppShell
      userEmail="tester@leadnova.de"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onLogout={handleLogout}
      leads={leads}
      selectedLead={selectedLead}
      setSelectedLead={setSelectedLead}
      onUpdateLead={handleUpdateLead}
      savedFiles={selectedLead ? leadFiles[selectedLead.id] || [] : []}
      setSavedFiles={(files) =>
        selectedLead &&
        setLeadFiles((prev) => ({
          ...prev,
          [selectedLead.id]: files,
        }))
      }
    />
  );
};

export default App;