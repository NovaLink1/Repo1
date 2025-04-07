import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const EditLeadPopup = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState(lead);
  const [activeTab, setActiveTab] = useState("details");
  const [dragOver, setDragOver] = useState(false);
  const [savedFiles, setSavedFiles] = useState([]);
  const [editingFileIndex, setEditingFileIndex] = useState(null);
const [renameInput, setRenameInput] = useState("");


  useEffect(() => {
    setFormData(lead);
  }, [lead]);

  useEffect(() => {
    if (activeTab === "docs" && lead?.id) {
      fetch(`http://localhost:8000/files/${lead.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSavedFiles(data);
          } else {
            setSavedFiles([]);
            console.warn("Unerwartete Backend-Antwort:", data);
          }
        })
        .catch((err) => console.error("Fehler beim Laden gespeicherter Dateien:", err));
    }
  }, [activeTab, lead]);

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
    onClose();
  };

  const uploadFileToServer = async (file) => {
    if (!lead?.id) {
      console.warn("Kein Lead-ID vorhanden – Datei wird nicht hochgeladen.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`http://localhost:8000/upload/${lead.id}`, {
      method: "POST",
      body: formData,
    });

    const updatedFiles = await fetch(`http://localhost:8000/files/${lead.id}`)
    .then((res) => res.json());
    setSavedFiles(updatedFiles);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFileToServer);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  if (!lead) return null;

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

        <div className="flex space-x-4 mb-6 border-b">
          <button
            className={`pb-2 border-b-2 font-semibold ${
              activeTab === "details" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("details")}
          >
            📋 Details
          </button>
          <button
            className={`pb-2 border-b-2 font-semibold ${
              activeTab === "docs" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("docs")}
          >
            📎 Dokumente
          </button>
        </div>

        {activeTab === "details" && (
          <form onSubmit={handleSubmit} className="space-y-8 text-base">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <input type="text" placeholder="Firma" value={formData.firma} onChange={(e) => handleChange("firma", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" required />
                <input type="text" placeholder="Branche" value={formData.branche} onChange={(e) => handleChange("branche", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="text" placeholder="Website" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <input type="number" placeholder="Bewertung" value={formData.bewertung} onChange={(e) => handleChange("bewertung", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" />
                <label className="block font-semibold mb-1">Status</label>
                <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full">
                  <option value="neu">Neu</option>
                  <option value="interessiert">Interessiert</option>
                  <option value="kontaktiert">Kontaktiert</option>
                  <option value="partnerschaft">Partnerschaft</option>
                </select>
              </div>
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
            <div>
              <textarea placeholder="Notizen" value={formData.notizen} onChange={(e) => handleChange("notizen", e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full" rows={4} />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">Abbrechen</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Speichern</button>
            </div>
          </form>
        )}

        {activeTab === "docs" && (
          <div className="space-y-6 text-base">
            <h3 className="text-lg font-semibold">Dokumente & E-Mails zum Lead</h3>
            <div
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition ${
                dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
              }`}
            >
              <p className="text-sm text-gray-600">
                📂 Ziehe deine Dateien hierher.
              </p>
            </div>
            <div className="h-64 overflow-y-scroll border border-gray-200 rounded p-4 bg-gray-50">
              <h4 className="text-md font-semibold mb-2">📁 Bereits gespeicherte Dateien</h4>
              <ul className="list-disc ml-5 text-sm text-blue-700 space-y-1">
              {savedFiles.length === 0 ? (
  <p className="text-sm text-gray-500">Keine gespeicherten Dateien gefunden.</p>
) : (
  savedFiles.map((file, index) => (
    <li key={index} className="flex justify-between items-center">
      {editingFileIndex === index ? (
        <input
          value={renameInput}
          onChange={(e) => setRenameInput(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              const res = await fetch(`http://localhost:8000/rename/${lead.id}?old_name=${encodeURIComponent(file.name)}&new_name=${encodeURIComponent(renameInput)}`, {
                method: "PUT",
              });

              if (res.ok) {
                const updatedFiles = await fetch(`http://localhost:8000/files/${lead.id}`)
                  .then((res) => res.json());
                setSavedFiles(updatedFiles);
                setEditingFileIndex(null);
              } else {
                alert("⚠️ Fehler beim Umbenennen");
              }
            }
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm w-full mr-2"
          autoFocus
        />
      ) : (
        
<div className="flex items-center space-x-2 flex-1">
  {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
    <img
      src={`http://localhost:8000${file.url}`}
      alt={file.name}
      className="w-16 h-16 object-cover border rounded shadow-sm"
    />
  ) : file.name.match(/\.pdf$/i) ? (
    <embed
      src={`http://localhost:8000${file.url}`}
      type="application/pdf"
      className="w-16 h-16 border rounded shadow-sm"
    />
  ) : (
    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 border rounded text-xs text-gray-500">
      📎
    </div>
  )}

  {editingFileIndex === index ? (
    <input
      value={renameInput}
      onChange={(e) => setRenameInput(e.target.value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          const res = await fetch(`http://localhost:8000/rename/${lead.id}?old_name=${encodeURIComponent(file.name)}&new_name=${encodeURIComponent(renameInput)}`, {
            method: "PUT",
          });

          if (res.ok) {
            const updatedFiles = await fetch(`http://localhost:8000/files/${lead.id}`)
              .then((res) => res.json());
            setSavedFiles(updatedFiles);
            setEditingFileIndex(null);
          } else {
            alert("⚠️ Fehler beim Umbenennen");
          }
        }
      }}
      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
      autoFocus
    />
  ) : (
    <a
      href={`http://localhost:8000${file.url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline break-all"
    >
      {file.name}
    </a>
  )}
</div>

      )}

      <div className="flex items-center ml-2 space-x-2">
        <button
          onClick={() => {
            setEditingFileIndex(index);
            setRenameInput(file.name);
          }}
          className="text-xs text-gray-500 hover:text-blue-600 font-bold"
          title="Datei umbenennen"
        >
          ✏️
        </button>
        <button
          onClick={async () => {
            const confirmed = confirm(`❌ Möchtest du "${file.name}" wirklich löschen?`);
            if (!confirmed) return;

            await fetch(`http://localhost:8000/delete/${lead.id}/${encodeURIComponent(file.name)}`, {
              method: "DELETE",
            });

            const updatedFiles = await fetch(`http://localhost:8000/files/${lead.id}`)
              .then((res) => res.json());
            setSavedFiles(updatedFiles);
          }}
          className="text-xs text-gray-600 hover:text-red-600 font-bold"
          title="Datei löschen"
        >
          ✖
        </button>
      </div>
    </li>
  ))
)}

</ul>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.getElementById("popup-root")
  );
};

export default EditLeadPopup;
