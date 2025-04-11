import React, { useEffect, useState } from "react";

const LeadDetailsEditor = ({ lead, onSave }) => {
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
    }
  };

  if (!formData) {
    return <p className="text-gray-500 italic">Kein Lead ausgewählt.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-700">
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
      </div>

      

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Speichern
        </button>
      </div>
    </form>
  );
};

export default LeadDetailsEditor;
