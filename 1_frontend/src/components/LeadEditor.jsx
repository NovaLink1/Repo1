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

  const handleSave = () => {
    onSave(formData); // Speichern des Leads
  };

  return (
    <div>
      {/* Beispiel für ein Formularfeld */}
      <input
        type="text"
        name="firma"
        value={formData.firma}
        onChange={handleChange}
        placeholder="Firma"
      />
      {/* Weitere Felder... */}
      <button onClick={handleSave}>Speichern</button>
    </div>
  );
};

export default LeadEditor;
