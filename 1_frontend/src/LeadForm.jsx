import { useEffect, useState } from "react";

const LeadForm = ({ onAddLead, onUpdateLead, initialData }) => {
  const [firma, setFirma] = useState("");
  const [branche, setBranche] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("neu");
  const [bewertung, setBewertung] = useState("");
  

  // Wenn initialData existiert, übernehmen wir die vorhandenen Werte
  useEffect(() => {
    if (initialData) {
      setFirma(initialData.firma);
      setBranche(initialData.branche);
      setWebsite(initialData.website);
      setStatus(initialData.status);
      setBewertung(initialData.bewertung.toString());
    }
  }, [initialData]);

  if (initialData) {
    onUpdateLead(initialData.id, leadData);
    setFirma("");
    setBranche("");
    setWebsite("");
    setStatus("neu");
    setBewertung("");
  } else {
    onAddLead(leadData);
    setFirma("");
    setBranche("");
    setWebsite("");
    setStatus("neu");
    setBewertung("");
  }
  
  

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200 space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "✏️ Lead bearbeiten" : "➕ Lead hinzufügen"}
      </h2>
  
      <div className="space-y-2">
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={firma}
          onChange={(e) => setFirma(e.target.value)}
          placeholder="Firma"
          required
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={branche}
          onChange={(e) => setBranche(e.target.value)}
          placeholder="Branche"
          required
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Website"
          required
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Status"
          required
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={bewertung}
          onChange={(e) => setBewertung(e.target.value)}
          type="number"
          placeholder="Bewertung"
          required
        />
      
      </div>
  
      <button
        type="submit"
        className={`w-full text-white px-4 py-2 rounded ${
          initialData ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {initialData ? "✅ Lead aktualisieren" : "💾 Lead hinzufügen"}
      </button>
    </form>
  );
  
};

export default LeadForm;
