import { useEffect, useState } from "react";
import LeadForm from "./components/LeadForm.jsx";

function App() {
  const [leads, setLeads] = useState([]);
  const [editingLead, setEditingLead] = useState(null);

  // Leads laden beim Start
  useEffect(() => {
    fetch("http://localhost:8000/leads")
      .then((res) => res.json())
      .then((data) => setLeads(data));
  }, []);

  // Neuer Lead hinzufügen (POST)
  const handleAddLead = (newLead) => {
    fetch("http://localhost:8000/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead),
    })
      .then((res) => res.json())
      .then((createdLead) => setLeads((prev) => [...prev, createdLead]));
  };

  // Lead aktualisieren (PUT)
  const handleUpdateLead = (id, updatedData) => {
    fetch(`http://localhost:8000/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((updatedLead) => {
        setLeads((prevLeads) =>
          prevLeads.map((lead) => (lead.id === id ? updatedLead : lead))
        );
        setEditingLead(null); // Editiermodus beenden
      });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">LeadNova CRM 🧠</h1>

      <LeadForm
        onAddLead={handleAddLead}
        onUpdateLead={handleUpdateLead}
        initialData={editingLead}
      />

      <div className="mt-6 space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="border p-4 rounded shadow">
            <p><strong>Firma:</strong> {lead.firma}</p>
            <p><strong>Branche:</strong> {lead.branche}</p>
            <p><strong>Website:</strong> {lead.website}</p>
            <p><strong>Bewertung:</strong> {lead.bewertung}</p>
            <p><strong>Status:</strong> {lead.status}</p>

            <button
              onClick={() => setEditingLead(lead)}
              className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Bearbeiten
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
