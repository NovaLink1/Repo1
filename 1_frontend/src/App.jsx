import React, { useState, useEffect } from "react";
import AddLeadPopup from "./components/AddLeadPopup";
import EditLeadPopup from "./components/EditLeadPopup";

const App = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/leads/")
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch((err) => console.error("Fehler beim Laden der Leads:", err));
  }, []);

  const handleAddLead = (newLead) => {
    fetch("http://localhost:8000/leads/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead),
    })
      .then((res) => res.json())
      .then((savedLead) => setLeads([...leads, savedLead]))
      .catch((err) => console.error("Fehler beim Speichern des Leads:", err));
  };

  const handleDeleteLead = (id) => {
    fetch(`http://localhost:8000/leads/${id}`, {
      method: "DELETE",
    })
      .then(() => setLeads(leads.filter((lead) => lead.id !== id)))
      .catch((err) => console.error("Fehler beim Löschen:", err));
  };

  const handleUpdateLead = (id, updatedLead) => {
    fetch(`http://localhost:8000/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedLead),
    })
      .then((res) => res.json())
      .then((updated) =>
        setLeads(leads.map((lead) => (lead.id === id ? updated : lead)))
      )
      .catch((err) => console.error("Fehler beim Aktualisieren:", err));
  };

  const statusLevel = {
    neu: 1,
    interessiert: 2,
    kontaktiert: 3,
    partnerschaft: 4,
  };

  const statusLabels = {
    1: "Neu",
    2: "Interessiert",
    3: "Kontaktiert",
    4: "Partnerschaft"
  };

  const filteredLeads = leads.filter((lead) =>
    [lead.firma, lead.branche, lead.status].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          LeadNova CRM <span>💡</span>
        </h1>
        <input
          type="text"
          placeholder="Suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <p className="text-red-500 text-xl font-bold underline mb-4">
        ✅ Tailwind ist aktiv!
      </p>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg text-lg"
      >
        + Neuer Lead
      </button>

      {/* Popup für neuen Lead */}
      {showAddForm && (
        <AddLeadPopup
          onAdd={(newLead) => {
            handleAddLead(newLead);
            setShowAddForm(false);
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Leadliste */}
      <div className="space-y-4 mt-8">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="border p-4 rounded shadow bg-white text-black"
          >
            <div className="flex items-center mb-1">
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  title={`Schritt ${step}: ${statusLabels[step]}`}
                  className={`w-4 h-4 rounded-full mr-2 transition duration-200 ease-in-out transform hover:scale-110 ${
                    statusLevel[lead.status] >= step ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              ))}
            </div>

            <h2
              className="text-xl font-semibold text-blue-700 hover:underline cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              {lead.firma}
            </h2>
            <p>
              <span className="font-bold">🧱 Branche:</span> {lead.branche} {" "}
              <span className="font-bold">🌐 Website:</span>{" "}
              <a
                href={lead.website}
                className="text-blue-600"
                target="_blank"
                rel="noreferrer"
              >
                {lead.website}
              </a>
            </p>
            <p>
              <span className="font-bold">📍 Status:</span> {lead.status} {" "}
              <span className="font-bold">⭐ Bewertung:</span> {lead.bewertung}
            </p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => setSelectedLead(lead)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Bearbeiten
              </button>
              <button
                onClick={() => handleDeleteLead(lead.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit-Popup für Bearbeiten */}
      {selectedLead && (
        <EditLeadPopup
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSave={(updatedLead) => handleUpdateLead(updatedLead.id, updatedLead)}
        />
      )}
    </div>
  );
};

export default App;