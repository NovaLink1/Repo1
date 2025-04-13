// src/components/LoginForm.jsx

import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importiere Firebase Auth
import { auth } from '../firebase/firebase-config'; // Firebase-Config importieren
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');         // State für E-Mail
  const [password, setPassword] = useState('');    // State für Passwort
  const [error, setError] = useState('');          // State für Fehlernachricht
  const [loading, setLoading] = useState(false);   // Ladezustand
  const user = userCredential.user;

  


  // Funktion zum Absenden des Formulars
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(''); // Fehler zurücksetzen
    setLoading(true); // Ladezustand aktivieren

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    
      if (!user.emailVerified) {
        setError("❌ Bitte bestätige deine E-Mail-Adresse, bevor du dich einloggen kannst.");
        return;
      }
    
      localStorage.setItem("leadnova_uid", user.uid);
      const token = await user.getIdToken();
      localStorage.setItem("leadnova_token", token);
    
      console.log("✅ Login erfolgreich:", user.uid);
      onLoginSuccess(user); // übergebe Nutzer an App
    } catch (err) {
      setError("❌ Login fehlgeschlagen: " + err.message);
      console.error("❌ Fehler beim Login:", err);
    }
    
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-bold">🔐 Login zu LeadNova</h2>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Fehleranzeige */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          disabled={loading} // Button deaktivieren während des Ladens
        >
          {loading ? 'Lade...' : 'Einloggen'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
