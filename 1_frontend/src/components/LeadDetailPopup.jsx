import React, { useState } from "react";
import { createPortal } from "react-dom";

export default function LeadDetailPopup({ lead, onClose, onSave }) {
  const [formData, setFormData] = useState({
    ...lead,
    ansprechpartner1: lead.ansprechpartner1 || "",
    email1: lead.email1 || "",
    telefon1: lead.telefon1 || "",
    ansprechpartner2: lead.ansprechpartner2 || "",
    email2: lead.email2 || "",
    telefon2: lead.telefon2 || "",
    notizen: lead.notizen || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6">Lead bearbeiten</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firma" value={formData.firma} onChange={handleChange} className="border p-2 rounded" placeholder="Firma" />
          <input name="branche" value={formData.branche} onChange={handleChange} className="border p-2 rounded" placeholder="Branche" />
          <input name="website" value={formData.website} onChange={handleChange} className="border p-2 rounded" placeholder="Website" />
          <input name="bewertung" value={formData.bewertung} onChange={handleChange} type="number" className="border p-2 rounded" placeholder="Bewertung" />
          <input name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded" placeholder="Status" />

          <input name="ansprechpartner1" value={formData.ansprechpartner1} onChange={handleChange} className="border p-2 rounded" placeholder="Ansprechpartner 1" />
          <input name="email1" value={formData.email1} onChange={handleChange} className="border p-2 rounded" placeholder="E-Mail 1" />
          <input name="telefon1" value={formData.telefon1} onChange={handleChange} className="border p-2 rounded" placeholder="Telefon 1" />

          <input name="ansprechpartner2" value={formData.ansprechpartner2} onChange={handleChange} className="border p-2 rounded" placeholder="Ansprechpartner 2" />
          <input name="email2" value={formData.email2} onChange={handleChange} className="border p-2 rounded" placeholder="E-Mail 2" />
          <input name="telefon2" value={formData.telefon2} onChange={handleChange} className="border p-2 rounded" placeholder="Telefon 2" />
        </div>

        <div className="mt-4">
          <textarea
            name="notizen"
            value={formData.notizen}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            rows={4}
            placeholder="Notizen"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
          >
            Speichern
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
