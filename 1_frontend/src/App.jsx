import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import LoginForm from './components/LoginForm';
import { auth } from './firebase/firebase-config'; // Firebase Auth importieren
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Anmeldefunktion

const App = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Speichert den aktuell angemeldeten User
  const [leadFiles, setLeadFiles] = useState({}); // Dateien für Leads speichern
  const [error, setError] = useState(""); // Fehlerzustand für Login


  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("leadnova_token");
  
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
  useEffect(() => {
    const token = localStorage.getItem("leadnova_token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    console.log("🧪 Versuche Leads zu laden...");
  
    fetchWithAuth("http://localhost:8000/leads/")
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 Leads vom Server:", data);
        setLeads(data);
      })
      .catch((err) => console.error("❌ Fehler beim Laden der Leads:", err));
  }, []);
  
  useEffect(() => {
    fetch("/api/userinfo")
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);
  
  const handleUpdateLead = async (updatedLead) => {
    try {
      const res = await fetch(`http://localhost:8000/leads/${updatedLead.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedLead)
      });

      if (!res.ok) {
        throw new Error("Fehler beim Speichern");
      }

      const savedLead = await res.json();

      // Leadliste aktualisieren
      setLeads((prev) =>
        prev.map((lead) => (lead.id === savedLead.id ? savedLead : lead))
      );
    } catch (err) {
      console.error("Update fehlgeschlagen:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("leadnova_token");
    setIsLoggedIn(false);
    setUser(null); // Benutzer zurücksetzen
  };

  // Firebase Anmeldung
  const handleLoginSuccess = (user) => {
    console.log("✅ Login success:", user);
    localStorage.setItem("leadnova_token", user.accessToken);
    setIsLoggedIn(true);
    const userInfo = { email: user.email };
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
    
  };
  
  

  return !isLoggedIn ? (
    <LoginForm onLoginSuccess={handleLoginSuccess} setError={setError} />
  ) : (
    <AppShell
      userEmail={user ? user.email : "Unbekannt"}
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
