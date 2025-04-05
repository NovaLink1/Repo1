import React, { useState } from "react";

const LeadForm = ({ onLeadAdded }) => {
  const [formData, setFormData] = useState({
    firma: "",
    branche: "",
    website: "",
    bewertung: "",
    status: "neu",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = {
      firma: formData.firma,
      branche: formData.branche,
      website: formData.website,
      bewertung: parseInt(formData.bewertung), // Ensure the value is an integer
      status: formData.status,
    };

    try {
      const response = await fetch("http://localhost:8000/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        const newLead = await response.json();
        onLeadAdded(newLead);
        setFormData({
          firma: "",
          branche: "",
          website: "",
          bewertung: "",
          status: "neu",
        });
      } else {
        const errorData = await response.json();
        console.error(`Fehler: ${response.status} - ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Fehler beim Absenden des Leads: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h3>Neuen Lead hinzufügen</h3>
      <input
        name="firma"
        value={formData.firma}
        onChange={handleChange}
        placeholder="Firma"
        required
      />
      <input
        name="branche"
        value={formData.branche}
        onChange={handleChange}
        placeholder="Branche"
      />
      <input
        name="website"
        value={formData.website}
        onChange={handleChange}
        placeholder="Website"
      />
      <input
        name="bewertung"
        type="number"
        value={formData.bewertung}
        onChange={handleChange}
        placeholder="Bewertung (1-100)"
      />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="neu">neu</option>
        <option value="kontaktiert">kontaktiert</option>
        <option value="interessiert">interessiert</option>
        <option value="abgeschlossen">abgeschlossen</option>
      </select>
      <button type="submit">Lead speichern</button>
    </form>
  );
};

export default LeadForm;
