import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import LoginForm from './components/LoginForm';
import { auth } from './firebase/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import RegisterForm from "./components/RegisterForm";




const App = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [leadFiles, setLeadFiles] = useState({});
  const [error, setError] = useState("");
  


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
    const userId = localStorage.getItem("leadnova_uid");
    if (!userId) {
      console.error("⚠️ Keine user_id gefunden – Nutzer ist vermutlich nicht eingeloggt.");
      return;
    }
  
    console.log("🚀 Lade Leads für user_id:", userId);
  
    fetch(`http://localhost:8000/leads?user_id=${encodeURIComponent(userId)}`)
      .then(async (res) => {
        const contentType = res.headers.get("Content-Type");
        const rawText = await res.text();
  
        console.log("📦 Content-Type:", contentType);
        console.log("🧾 Response-Body:", rawText.slice(0, 300));
  
        if (!res.ok) {
          throw new Error(`❌ Fehlerstatus ${res.status}`);
        }
  
        if (contentType && contentType.includes("application/json")) {
          const data = JSON.parse(rawText);
          console.log("✅ JSON geladen:", data);
          setLeads(data);
        } else {
          throw new Error("⚠️ Kein JSON erhalten");
        }
      })
      .catch((err) => console.error("💥 Fehler beim Laden der Leads:", err));
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
    setUser(null);
  };

  const handleLoginSuccess = (user) => {
    console.log("✅ Login success:", user);
    localStorage.setItem("leadnova_token", user.accessToken);
    setIsLoggedIn(true);
    const userInfo = { email: user.email };
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  return !user ? (
    !isRegistering ? (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <p className="text-sm text-center mt-2">
          Noch keinen Account?{" "}
          <button onClick={() => setIsRegistering(true)} className="text-blue-600 underline">
            Jetzt registrieren
          </button>
        </p>
      </>
    ) : (
      <>
        <RegisterForm onRegisterSuccess={handleLoginSuccess} />
        <p className="text-sm text-center mt-2">
          Bereits registriert?{" "}
          <button onClick={() => setIsRegistering(false)} className="text-blue-600 underline">
            Zum Login
          </button>
        </p>
      </>
    )
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
