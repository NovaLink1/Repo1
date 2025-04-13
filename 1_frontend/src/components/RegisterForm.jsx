// src/components/RegisterForm.jsx
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase/firebase-config"; // dein Pfad zum Firebase Setup


const RegisterForm = ({ onRegisterSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name || !email || !password || !passwordRepeat) {
      setError("⚠️ Bitte fülle alle Felder aus.");
      return false;
    }
    if (password !== passwordRepeat) {
      setError("❌ Die Passwörter stimmen nicht überein.");
      return false;
    }
    if (password.length < 6) {
      setError("🔒 Passwort muss mindestens 6 Zeichen lang sein.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      const authInstance = getAuth();
  
      const userCredential = await createUserWithEmailAndPassword(
        authInstance,
        email,
        password
      );
  
      const user = userCredential.user;
  
      await sendEmailVerification(user);
  
      // Optional: Speichern von user.displayName (nicht direkt unterstützt, dafür extra update)
      // await updateProfile(user, { displayName: name });
  
      localStorage.setItem("leadnova_uid", user.uid);
      localStorage.setItem("leadnova_token", await user.getIdToken());
  
      alert("✅ Registrierung erfolgreich! Bitte bestätige deine E-Mail.");
      onRegisterSuccess(user); // übergebe den Nutzer an App.jsx
    } catch (err) {
      console.error("❌ Fehler bei Registrierung:", err.message);
      setError("❌ " + (err.message || "Unbekannter Fehler"));
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleRegister} className="space-y-4 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold">Registrieren</h2>

      <input
        type="text"
        placeholder="Vollständiger Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="email"
        placeholder="E-Mail-Adresse"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="password"
        placeholder="Passwort wiederholen"
        value={passwordRepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Registriere..." : "Registrieren"}
      </button>
    </form>
  );
};

export default RegisterForm;
