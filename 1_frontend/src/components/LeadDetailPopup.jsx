import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const LeadDetailPopup = ({ lead, onClose, onSave }) => {
  if (!lead) return null;

  const [formData, setFormData] = useState(lead);

  useEffect(() => {
    setFormData(lead);
  }, [lead]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-black px-2 py-1 rounded"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6">Lead bearbeiten</h2>
        <form onSubmit={handleSubmit} className="space-y-8 text-base">
          <div className="grid grid-cols-2 gap-6">
            {/* Linke Spalte: Unternehmensdaten */}
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Firmenbezeichnung</label>
                <input type="text" value={formData.firma || ""} onChange={(e) => handleChange("firma", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Branche</label>
                <input type="text" value={formData.branche || ""} onChange={(e) => handleChange("branche", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Website</label>
                <input type="text" value={formData.website || ""} onChange={(e) => handleChange("website", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Scoring</label>
                <input type="number" value={formData.bewertung || ""} onChange={(e) => handleChange("bewertung", parseInt(e.target.value))} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <input type="text" value={formData.status || ""} onChange={(e) => handleChange("status", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
            </div>

            {/* Rechte Spalte: Ansprechpartner 1 & 2 */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Ansprechpartner 1</h3>
                <input type="text" placeholder="Name" value={formData.ansprechpartner1 || ""} onChange={(e) => handleChange("ansprechpartner1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Position" value={formData.position1 || ""} onChange={(e) => handleChange("position1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Telefon" value={formData.telefon1 || ""} onChange={(e) => handleChange("telefon1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="email" placeholder="E-Mail" value={formData.email1 || ""} onChange={(e) => handleChange("email1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Ansprechpartner 2</h3>
                <input type="text" placeholder="Name" value={formData.ansprechpartner2 || ""} onChange={(e) => handleChange("ansprechpartner2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Position" value={formData.position2 || ""} onChange={(e) => handleChange("position2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Telefon" value={formData.telefon2 || ""} onChange={(e) => handleChange("telefon2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="email" placeholder="E-Mail" value={formData.email2 || ""} onChange={(e) => handleChange("email2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
            </div>
          </div>

          {/* Notizen-Feld */}
          <div>
            <label className="block font-semibold mb-1">Notizen</label>
            <textarea value={formData.notizen || ""} onChange={(e) => handleChange("notizen", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" rows={4} />
          </div>

          {/* Aktionen */}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">Abbrechen</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Speichern</button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("popup-root")
  );
};

export default LeadDetailPopup;
