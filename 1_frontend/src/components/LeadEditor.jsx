import React, { useState, useEffect } from "react";

const LeadEditor = ({ lead, onSave }) => {
  const [formData, setFormData] = useState(lead);

  useEffect(() => {
    setFormData(lead);
  }, [lead]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedLead = {
      ...formData,
      bewertung: parseInt(formData.bewertung) || 0,
    };
    onSave(updatedLead);
  };

  if (!formData) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Firma</label>
          <input
            type="text"
            value={formData.firma}
            onChange={(e) => handleChange("firma", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Branche</label>
          <input
            type="text"
            value={formData.branche}
            onChange={(e) => handleChange("branche", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Website</label>
          <input
            type="text"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Bewertung</label>
          <input
            type="number"
            value={formData.bewertung}
            onChange={(e) => handleChange("bewertung", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="neu">Neu</option>
            <option value="interessiert">Interessiert</option>
            <option value="kontaktiert">Kontaktiert</option>
            <option value="partnerschaft">Partnerschaft</option>
          </select>
        </div>
      </div>

      {/* Ansprechpartner 1 */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Ansprechpartner 1</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.ansprechpartner1 || ""}
            onChange={(e) => handleChange("ansprechpartner1", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Position"
            value={formData.position1 || ""}
            onChange={(e) => handleChange("position1", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={formData.email1 || ""}
            onChange={(e) => handleChange("email1", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Telefon"
            value={formData.telefon1 || ""}
            onChange={(e) => handleChange("telefon1", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Ansprechpartner 2 */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Ansprechpartner 2</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.ansprechpartner2 || ""}
            onChange={(e) => handleChange("ansprechpartner2", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Position"
            value={formData.position2 || ""}
            onChange={(e) => handleChange("position2", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={formData.email2 || ""}
            onChange={(e) => handleChange("email2", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Telefon"
            value={formData.telefon2 || ""}
            onChange={(e) => handleChange("telefon2", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Notizen</label>
        <textarea
          value={formData.notizen}
          onChange={(e) => handleChange("notizen", e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={4}
        />
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Speichern
        </button>
      </div>
    </form>
  );
};

export default LeadEditor;