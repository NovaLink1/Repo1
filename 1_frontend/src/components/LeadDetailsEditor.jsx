import React, { useEffect, useState } from "react";

const LeadDetailsEditor = ({ lead, onSave, onClose, onDelete }) => {

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    }
  }, [lead]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      if (onClose) onClose(); // Fenster schließen, wenn Callback vorhanden
    }
  };

  if (!formData) {
    return <p className="text-gray-500 italic">Kein Lead ausgewählt.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-700">
      {/* Titel + vCard-Export */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-900">{formData.firma}</h2>
        {formData?.id && (
          <a
            href={`http://localhost:8000/leads/${formData.id}/export/vcard`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-green-600 border border-green-600 hover:bg-green-50 px-3 py-1 rounded text-sm"
            title="Als vCard exportieren"
            download
          >
            💾 vCard exportieren
          </a>
        )}
      </div>

      {/* Firma & Basisdaten */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Firma</label>
          <input
            type="text"
            value={formData.firma || ""}
            onChange={(e) => handleChange("firma", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Branche</label>
          <input
            type="text"
            value={formData.branche || ""}
            onChange={(e) => handleChange("branche", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Website</label>
          <input
            type="text"
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select
            value={formData.status || ""}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          >
            <option value="neu">Neu</option>
            <option value="interessiert">Interessiert</option>
            <option value="kontaktiert">Kontaktiert</option>
            <option value="partnerschaft">Partnerschaft</option>
            <option value="abgelehnt">Abgelehnt</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Bewertung</label>
          <input
            type="number"
            value={formData.bewertung || ""}
            onChange={(e) => handleChange("bewertung", e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Ansprechpartner 1 */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-base mb-2">👤 Ansprechpartner 1</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.ansprechpartner1 || ""}
            onChange={(e) => handleChange("ansprechpartner1", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="text"
            placeholder="Position"
            value={formData.position1 || ""}
            onChange={(e) => handleChange("position1", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={formData.email1 || ""}
            onChange={(e) => handleChange("email1", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="tel"
            placeholder="Telefon"
            value={formData.telefon1 || ""}
            onChange={(e) => handleChange("telefon1", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Ansprechpartner 2 */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-base mb-2">👤 Ansprechpartner 2</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.ansprechpartner2 || ""}
            onChange={(e) => handleChange("ansprechpartner2", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="text"
            placeholder="Position"
            value={formData.position2 || ""}
            onChange={(e) => handleChange("position2", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={formData.email2 || ""}
            onChange={(e) => handleChange("email2", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="tel"
            placeholder="Telefon"
            value={formData.telefon2 || ""}
            onChange={(e) => handleChange("telefon2", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Straße</label>
            <input
              type="text"
              value={formData.strasse || ""}
              onChange={(e) => handleChange("strasse", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>PLZ</label>
            <input
              type="text"
              value={formData.plz || ""}
              onChange={(e) => handleChange("plz", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>Ort</label>
            <input
              type="text"
              value={formData.ort || ""}
              onChange={(e) => handleChange("ort", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label>UID</label>
            <input
              type="text"
              value={formData.uid || ""}
              onChange={(e) => handleChange("uid", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="col-span-2">
            <label>Weitere Adressen</label>
            <textarea
              value={formData.weitere_adressen || ""}
              onChange={(e) => handleChange("weitere_adressen", e.target.value)}
              className="w-full border rounded px-2 py-1"
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <label>Anlieferung (Tor)</label>
            <textarea
              value={formData.anlieferung_tor || ""}
              onChange={(e) => handleChange("anlieferung_tor", e.target.value)}
              className="w-full border rounded px-2 py-1"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <label className="block font-semibold mb-1">📝 Notizen</label>
        <textarea
          value={formData.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
          rows={4}
          placeholder="Leadspezifische Notizen hier eingeben..."
        />
      </div>

      <div className="flex justify-between items-center pt-4">
        {/* Linker Bereich: Lead löschen */}
        <div>
          {formData?.id && (
            <button
              type="button"
              onClick={() => onDelete(formData)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              ❌ Lead löschen
            </button>
          )}
        </div>

        {/* Rechter Bereich: Abbrechen + Speichern */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Abbrechen
          </button>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Speichern
          </button>
        </div>
      </div>
    </form>
  );
};

export default LeadDetailsEditor;
