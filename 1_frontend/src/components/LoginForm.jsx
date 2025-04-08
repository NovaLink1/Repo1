// src/components/LoginForm.jsx
import { useState } from "react";

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!res.ok) throw new Error("Login fehlgeschlagen");

      const data = await res.json();
      localStorage.setItem("leadnova_token", data.access_token);
      onLoginSuccess(); // Trigger App-Redirect
    } catch (err) {
      console.error("Login-Fehler:", err);
      setError("Login fehlgeschlagen – bitte überprüfe E-Mail und Passwort.");
    }
  };

  return (
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Einloggen
      </button>
    </form>
  );
};

export default LoginForm;

