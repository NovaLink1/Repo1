import React, { useState } from "react";
import { createPortal } from "react-dom";

const AddLeadPopup = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    firma: "",
    branche: "",
    website: "",
    bewertung: "",
    status: "neu",
    ansprechpartner1: "",
    position1: "",
    telefon1: "",
    email1: "",
    ansprechpartner2: "",
    position2: "",
    telefon2: "",
    email2: "",
    notizen: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const leadData = {
      ...formData,
      bewertung: parseInt(formData.bewertung) || 0,
    };
    onAdd(leadData);
    onClose();
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

        <h2 className="text-2xl font-bold mb-6">Neuen Lead hinzufügen</h2>
        <form onSubmit={handleSubmit} className="space-y-8 text-base">
          <div className="grid grid-cols-2 gap-6">
            {/* Linke Spalte: Unternehmensdaten */}
            <div className="space-y-4">
              <input type="text" placeholder="Firma" value={formData.firma} onChange={(e) => handleChange("firma", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" required />
              <input type="text" placeholder="Branche" value={formData.branche} onChange={(e) => handleChange("branche", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              <input type="text" placeholder="Website" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              <input type="number" placeholder="Bewertung" value={formData.bewertung} onChange={(e) => handleChange("bewertung", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              <input type="text" placeholder="Status" value={formData.status} onChange={(e) => handleChange("status", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
            </div>

            {/* Rechte Spalte: Ansprechpartner 1 & 2 */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Ansprechpartner 1</h3>
                <input type="text" placeholder="Name" value={formData.ansprechpartner1} onChange={(e) => handleChange("ansprechpartner1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Position" value={formData.position1} onChange={(e) => handleChange("position1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Telefon" value={formData.telefon1} onChange={(e) => handleChange("telefon1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="email" placeholder="E-Mail" value={formData.email1} onChange={(e) => handleChange("email1", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Ansprechpartner 2</h3>
                <input type="text" placeholder="Name" value={formData.ansprechpartner2} onChange={(e) => handleChange("ansprechpartner2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Position" value={formData.position2} onChange={(e) => handleChange("position2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Telefon" value={formData.telefon2} onChange={(e) => handleChange("telefon2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="email" placeholder="E-Mail" value={formData.email2} onChange={(e) => handleChange("email2", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
              </div>
            </div>
          </div>

          {/* Notizen-Feld */}
          <div>
            <textarea placeholder="Notizen" value={formData.notizen} onChange={(e) => handleChange("notizen", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" rows={4} />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">Abbrechen</button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Hinzufügen</button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("popup-root")
  );
};

export default AddLeadPopup;