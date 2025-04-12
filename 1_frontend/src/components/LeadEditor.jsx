// LeadEditor.jsx

import React, { useState, useEffect } from "react";

const LeadEditor = ({ lead, onSave }) => {
  const [formData, setFormData] = useState(lead);

  useEffect(() => {
    setFormData(lead); // Setze die Formulardaten, wenn sich der Lead ändert
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("leadnova_token");
    const url = formData.id
      ? `http://localhost:8000/leads/${formData.id}`
      : "http://localhost:8000/leads/";
    const method = formData.id ? "PUT" : "POST";

    console.log("🛰 Sende Lead an Server:", formData);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("✅ Antwort vom Server:", data);
      onSave(data); // Rückgabe an Parent-Komponente
    } catch (error) {
      console.error("❌ Fehler beim Speichern des Leads:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        name="firma"
        value={formData.firma || ""}
        onChange={handleChange}
        placeholder="Firma"
      />
      {/* Weitere Felder... */}
      <button onClick={handleSave}>Speichern</button>
    </div>
  );
};

export default LeadEditor;