import LeadForm from "./LeadForm";  
import { useEffect, useState } from "react";


function App() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/leads")
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch((err) => console.error("Fehler beim Laden der Leads:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>LeadNova – CRM Übersicht</h1>
  
      <LeadForm onLeadAdded={(newLead) => setLeads((prev) => [...prev, newLead])} />
  
      {leads.length === 0 ? (
        <p>⏳ Lade Leads...</p>
      ) : (
        <ul>
          {leads.map((lead) => (
            <li key={lead.id}>
              <strong>{lead.firma}</strong> – {lead.branche}
              <br />
              🌐 <a href={lead.website} target="_blank" rel="noreferrer">{lead.website}</a>
              <br />
              📊 Bewertung: <strong>{lead.bewertung}/100</strong>
              <br />
              🟢 Status: <em>{lead.status}</em>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
}

export default App;
