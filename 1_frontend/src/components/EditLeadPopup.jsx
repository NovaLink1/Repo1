import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("de-DE");
}

const EditLeadPopup = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState(lead);
  const [activeTab, setActiveTab] = useState("details");
  const [dragOver, setDragOver] = useState(false);
  const [savedFiles, setSavedFiles] = useState([]);
  const [editingFileIndex, setEditingFileIndex] = useState(null);
  const [renameInput, setRenameInput] = useState("");
  const [lastDeletedFile, setLastDeletedFile] = useState(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  useEffect(() => {
    setFormData(lead);
  }, [lead]);

  useEffect(() => {
    if (activeTab === "docs" && lead?.id) {
      fetch(`http://localhost:8000/files/${lead.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("📁 Dateien vom Server:", data); // HIER
          if (Array.isArray(data)) {
            setSavedFiles(data);
          } else {
            setSavedFiles([]);
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
      notes: formData.notes, 
    };
    onSave(updatedLead);  // ➜ wird an App.jsx übergeben
    onClose();
  };
  

  const uploadFileToServer = async (file) => {
    if (!lead?.id) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch(`http://localhost:8000/upload/${encodeURIComponent(lead.id)}`, {
        method: "POST",
        body: formData,
      });

      const updatedFiles = await fetch(`http://localhost:8000/files/${encodeURIComponent(lead.id)}`)
        .then((res) => res.json());
      setSavedFiles(updatedFiles);
    } catch (error) {
      console.error("Upload fehlgeschlagen:", error);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(uploadFileToServer);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const handleRename = async (file, newName) => {
    try {
      const res = await fetch(
        `http://localhost:8000/rename/${encodeURIComponent(lead.id)}?old_name=${encodeURIComponent(file.name)}&new_name=${encodeURIComponent(newName)}`,
        { method: "PUT" }
      );
      if (res.ok) {
        const updatedFiles = await fetch(`http://localhost:8000/files/${encodeURIComponent(lead.id)}`).then((res) => res.json());
        setSavedFiles(updatedFiles);
        setEditingFileIndex(null);
      } else {
        alert("⚠️ Fehler beim Umbenennen");
      }
    } catch (error) {
      console.error("Rename fehlgeschlagen:", error);
    }
  };

  const handleDelete = async (file) => {
    const confirmed = confirm(`❌ Möchtest du "${file.name}" wirklich löschen?`);
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:8000/delete/${encodeURIComponent(lead.id)}/${encodeURIComponent(file.name)}`, {
        method: "DELETE",
      });
      setLastDeletedFile(file);
      setShowUndoToast(true);

      const updatedFiles = await fetch(`http://localhost:8000/files/${encodeURIComponent(lead.id)}`).then((res) => res.json());
      setSavedFiles(updatedFiles);
    } catch (error) {
      console.error("Löschen fehlgeschlagen:", error);
    }
  };

  const handleRestore = async () => {
    if (!lastDeletedFile) return;

    try {
      await fetch(`http://localhost:8000/restore/${encodeURIComponent(lead.id)}/${encodeURIComponent(lastDeletedFile.name)}`, {
        method: "PUT",
      });

      const updatedFiles = await fetch(`http://localhost:8000/files/${encodeURIComponent(lead.id)}`).then((res) => res.json());
      setSavedFiles(updatedFiles);
      setShowUndoToast(false);
      setLastDeletedFile(null);
    } catch (error) {
      console.error("Wiederherstellung fehlgeschlagen:", error);
    }
  };

  if (!lead) return null;

  console.log("✅ EditLeadPopup aktiv", lead);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-black px-2 py-1 rounded"
        >
          ✖
        </button>

        {console.log("📦 Aktiver Lead:", lead)}

        {lead?.id && lead?.firma && (
  <div className="mb-6">
    <h2 className="text-3xl font-bold text-blue-900">{lead.firma}</h2>
    <a
      href={`http://localhost:8000/leads/${lead.id}/export/vcard`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-block text-green-600 border border-green-600 hover:bg-green-50 px-3 py-1 rounded text-sm"
      title="Als vCard exportieren"
      download
    >
      💾 vCard exportieren
    </a>
  </div>
)}

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
                <input
                  type="text"
                  placeholder="Firma"
                  value={formData.firma}
                  onChange={(e) => handleChange("firma", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Branche"
                  value={formData.branche}
                  onChange={(e) => handleChange("branche", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Website"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Bewertung"
                  value={formData.bewertung}
                  onChange={(e) => handleChange("bewertung", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
                <label className="block font-semibold mb-1">Status</label>
                <select
  value={formData.status || ""}
  onChange={(e) => handleChange("status", e.target.value)}
  className="border border-gray-300 rounded px-3 py-2 w-full"
>
  <option value="neu">Neu</option>
  <option value="interessiert">Interessiert</option>
  <option value="kontaktiert">Kontaktiert</option>
  <option value="partnerschaft">Partnerschaft</option>
</select>

              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Ansprechpartner 1</h3>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.ansprechpartner1}
                    onChange={(e) => handleChange("ansprechpartner1", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={formData.position1}
                    onChange={(e) => handleChange("position1", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Telefon"
                    value={formData.telefon1}
                    onChange={(e) => handleChange("telefon1", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                  <input
                    type="email"
                    placeholder="E-Mail"
                    value={formData.email1}
                    onChange={(e) => handleChange("email1", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Ansprechpartner 2</h3>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.ansprechpartner2}
                    onChange={(e) => handleChange("ansprechpartner2", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={formData.position2}
                    onChange={(e) => handleChange("position2", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Telefon"
                    value={formData.telefon2}
                    onChange={(e) => handleChange("telefon2", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                  <input
                    type="email"
                    placeholder="E-Mail"
                    value={formData.email2}
                    onChange={(e) => handleChange("email2", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
              </div>
            </div>

<div className="mt-6">
  <label className="block text-sm font-medium text-gray-700 mb-1">Notizen</label>
  <textarea
    placeholder="Notizen"
    value={formData.notes || ""}
    onChange={(e) => handleChange("notes", e.target.value)}
    className="w-full border border-gray-300 rounded p-2 text-sm"
    rows={4}
  />
</div>


            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Speichern
              </button>
            </div>
          </form>
        )}

        

        {showUndoToast && lastDeletedFile && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 flex items-center space-x-4">
            <span>📦 "{lastDeletedFile.name}" gelöscht</span>
            <button
              onClick={async () => {
                await fetch(`http://localhost:8000/restore/${lead.id}/${encodeURIComponent(lastDeletedFile.name)}`, {
                  method: "PUT",
                });

                const updatedFiles = await fetch(`http://localhost:8000/files/${lead.id}`).then((res) => res.json());
                setSavedFiles(updatedFiles);
                setShowUndoToast(false);
                setLastDeletedFile(null);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded"
            >
              Rückgängig
            </button>
          </div>
        )}
      </div>
    </div>,
    document.getElementById("popup-root")
  );
};

export default EditLeadPopup;
