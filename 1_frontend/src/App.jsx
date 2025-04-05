import { useEffect, useState } from "react";
import LeadForm from "./components/LeadForm.jsx";

function App() {
  const [leads, setLeads] = useState([]);
  const [editingLead, setEditingLead] = useState(null);
 
  const handleDeleteLead = (id) => {
    const confirmed = window.confirm("Möchtest du diesen Lead wirklich löschen?");
    if (!confirmed) return;
  
    fetch(`http://localhost:8000/leads/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fehler beim Löschen");
        }
        setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
      })
      .catch((err) => {
        console.error("Löschen fehlgeschlagen:", err);
      });
  };
  
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
  const getScoreColor = (score) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">LeadNova CRM 💡</h1>
  
      <LeadForm
        onAddLead={handleAddLead}
        onUpdateLead={handleUpdateLead}
        initialData={editingLead}
      />
  
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leads.map((lead) => (
  <div key={lead.id} className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
    <h2 className="text-xl font-semibold mb-2 flex items-center justify-between">
  <span>{lead.firma}</span>
  <span
    className={`inline-block w-4 h-4 rounded-full flex-shrink-0 ${
      lead.bewertung >= 85
        ? 'bg-green-500'
        : lead.bewertung >= 70
        ? 'bg-yellow-500'
        : 'bg-red-500'
    }`}
    title={`Score: ${lead.bewertung}`}
  ></span>
</h2>




    <div className="flex flex-wrap gap-4 text-sm text-gray-700 ml-6 mb-3">
      <span><strong>🏭 Branche:</strong> {lead.branche}</span>
      <span>
        <strong>🌐 Website:</strong>{" "}
        <a href={lead.website} className="text-blue-600 underline" target="_blank" rel="noreferrer">
          {lead.website}
        </a>
      </span>
      <span><strong>⭐ Bewertung:</strong> {lead.bewertung}</span>
      <span>
        <strong>📍 Status:</strong>{" "}
        <span
  className={`inline-block w-3 h-3 rounded-full flex-shrink-0 ${
    lead.bewertung >= 85
      ? "bg-green-500"
      : lead.bewertung >= 70
      ? "bg-yellow-500"
      : "bg-red-500"
  }`}
  title={`Score: ${lead.bewertung}`}
/>

      </span>
    </div>

    <div className="mt-2 flex space-x-2">
      <button
        onClick={() => setEditingLead(lead)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
      >
        Bearbeiten
      </button>
      <button
        onClick={() => handleDeleteLead(lead.id)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        Löschen
      </button>
      </div>  
    </div>   // Haupt-Container
  ))}
  </div>     
</div>       // Outer Wrapper (p-4 max-w-2xl mx-auto)
);           // Ende von return
}            // Ende der Funktion App

export default App;