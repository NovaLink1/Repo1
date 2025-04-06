
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const LeadDetailPopup = ({ lead, onClose, onSave }) => {
  if (!lead) return null; // Sicherheits-Check gegen undefined

  const [formData, setFormData] = useState(lead);

  useEffect(() => {
    setFormData(lead); // bei Wechsel des Leads aktualisieren
  }, [lead]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-black px-2 py-1 rounded"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6">Lead bearbeiten</h2>
        <form onSubmit={handleSubmit} className="space-y-8 text-base">
          <div className="grid grid-cols-2 gap-6">
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
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Ansprechpartner 1</label>
                <input type="text" value={formData.ansprechpartner1 || ""} onChange={(e) => handleChange("ansprechpartner1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">E-Mail 1</label>
                <input type="email" value={formData.email1 || ""} onChange={(e) => handleChange("email1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Telefon 1</label>
                <input type="text" value={formData.telefon1 || ""} onChange={(e) => handleChange("telefon1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Ansprechpartner 2</label>
                <input type="text" value={formData.ansprechpartner2 || ""} onChange={(e) => handleChange("ansprechpartner2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">E-Mail 2</label>
                <input type="email" value={formData.email2 || ""} onChange={(e) => handleChange("email2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Telefon 2</label>
                <input type="text" value={formData.telefon2 || ""} onChange={(e) => handleChange("telefon2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Notizen</label>
            <textarea value={formData.notizen || ""} onChange={(e) => handleChange("notizen", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" rows={4} />
          </div>
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
