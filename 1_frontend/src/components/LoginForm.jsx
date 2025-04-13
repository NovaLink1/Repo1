// src/components/LoginForm.jsx

import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importiere Firebase Auth
import { auth } from '../firebase/firebase-config'; // Firebase-Config importieren

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
      // Anmeldung bei Firebase mit E-Mail und Passwort
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("leadnova_uid", user.uid);
      console.log("🔐 Angemeldeter Nutzer:", user.uid);

      // Falls die Anmeldung erfolgreich ist, die Login-Erfolgs-Funktion aufrufen
      onLoginSuccess(user);
      setEmail(''); // Zurücksetzen des E-Mail-Feldes
      setPassword(''); // Zurücksetzen des Passwort-Feldes
    } catch (err) {
      // Fehlerbehandlung
      setError("Fehler bei der Anmeldung. Überprüfe deine E-Mail und Passwort.");
      console.error("Anmeldefehler:", err.message); // Detailierter Fehler in der Konsole
    } finally {
      setLoading(false); // Ladezustand zurücksetzen
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
