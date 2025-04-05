import { useEffect, useState } from "react";

const LeadForm = ({ onAddLead, onUpdateLead, initialData }) => {
  const [firma, setFirma] = useState("");
  const [branche, setBranche] = useState("");
  const [website, setWebsite] = useState("");
  const [bewertung, setBewertung] = useState("");
  const [status, setStatus] = useState("neu");

  // Wenn initialData existiert, übernehmen wir die vorhandenen Werte
  useEffect(() => {
    if (initialData) {
      setFirma(initialData.firma);
      setBranche(initialData.branche);
      setWebsite(initialData.website);
      setBewertung(initialData.bewertung.toString());
      setStatus(initialData.status);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const leadData = {
      firma,
      branche,
      website,
      bewertung: parseInt(bewertung),
      status,
    };

    if (initialData) {
      onUpdateLead(initialData.id, leadData);
    } else {
      onAddLead(leadData);
    }

    // Felder zurücksetzen (nur bei Neuerstellung)
    if (!initialData) {
      setFirma("");
      setBranche("");
      setWebsite("");
      setBewertung("");
      setStatus("neu");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={firma} onChange={(e) => setFirma(e.target.value)} placeholder="Firma" />
      <input value={branche} onChange={(e) => setBranche(e.target.value)} placeholder="Branche" />
      <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" />
      <input value={bewertung} onChange={(e) => setBewertung(e.target.value)} type="number" placeholder="Bewertung" />
      <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {initialData ? "Lead aktualisieren" : "Lead hinzufügen"}
      </button>
    </form>
  );
};

export default LeadForm;
