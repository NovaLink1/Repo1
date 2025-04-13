// LeadDocuments.jsx – mit Drag-and-Drop Upload 🧲

import React, { useEffect, useState } from "react";

const LeadDocuments = ({ selectedLead }) => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [renameMap, setRenameMap] = useState({});
  const [trashedFiles, setTrashedFiles] = useState([]);
  const [showTrash, setShowTrash] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("leadnova_token");

  const reloadFiles = async () => {
    if (!selectedLead) return;
    try {
      const [activeRes, trashRes] = await Promise.all([
        fetch(`http://localhost:8000/files/${selectedLead.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:8000/trash/${selectedLead.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const active = await activeRes.json();
      const trash = await trashRes.json();
      setFiles(active);
      setTrashedFiles(trash);
    } catch (err) {
      console.error("❌ Fehler beim Neuladen der Dateien:", err);
    }
  };

  useEffect(() => {
    reloadFiles();
  }, [selectedLead]);

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await fetch(`http://localhost:8000/upload/${selectedLead.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      await reloadFiles();
    } catch (err) {
      console.error("❌ Upload fehlgeschlagen:", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(uploadFileToServer);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDelete = async (filename) => {
    await fetch(`http://localhost:8000/delete/${selectedLead.id}/${filename}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await reloadFiles();
  };

  const handleRename = async (filename) => {
    const newName = renameMap[filename];
    if (!newName) return;
    await fetch(`http://localhost:8000/rename/${selectedLead.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ old_name: filename, new_name: newName }),
    });
    setRenameMap({ ...renameMap, [filename]: "" });
    await reloadFiles();
  };

  const handleRestore = async (filename) => {
    await fetch(`http://localhost:8000/restore/${selectedLead.id}/${filename}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    await reloadFiles();
  };

  const handleEmptyTrash = async () => {
    const confirm = window.confirm("Möchtest du den Papierkorb wirklich unwiderruflich leeren?");
    if (!confirm) return;

    for (const filename of trashedFiles) {
      await fetch(`http://localhost:8000/delete/${selectedLead.id}/${filename}?permanent=true`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    await reloadFiles();
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3 className="font-bold mb-2">📎 Dokumente für: {selectedLead?.firma || "-"}</h3>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded p-6 text-center text-sm mb-4 transition-colors duration-200 ${
          isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        {isDragging ? "Lass die Dateien los, um sie hochzuladen" : "Ziehe Dateien hierher zum Hochladen"}
      </div>

      <input
        type="text"
        placeholder="Dateien durchsuchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
      />

      <ul className="mt-4">
        {filteredFiles.map((file, index) => (
          <li
            key={file.name || index}
            className="flex items-center justify-between border p-2 pr-4 rounded mb-2"
          >
            <span className="flex-1">{file.name}</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Neuer Name"
                value={renameMap[file.name] || ""}
                onChange={(e) =>
                  setRenameMap({ ...renameMap, [file.name]: e.target.value })
                }
                className="border px-2 py-1 rounded text-sm"
              />
              <button
                title="Umbenennen"
                onClick={() => handleRename(file.name)}
                className="text-yellow-600 border border-yellow-600 hover:bg-yellow-50 p-2 rounded-full"
              >
                ✏️
              </button>
              <button
                title="Löschen"
                onClick={() => handleDelete(file.name)}
                className="text-red-600 border border-red-600 hover:bg-red-50 p-2 rounded-full"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setShowTrash(!showTrash)}
        className="text-sm text-gray-600 underline mt-4"
      >
        {showTrash ? "Papierkorb ausblenden" : "Papierkorb anzeigen"}
      </button>

      {showTrash && trashedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold flex justify-between items-center">
            🗑️ Papierkorb
            <button
              onClick={handleEmptyTrash}
              className="text-sm text-red-600 underline"
            >
              Papierkorb leeren
            </button>
          </h4>
          <ul className="mt-2">
            {trashedFiles.map((f) => (
              <li key={f} className="flex justify-between items-center border p-2 pr-4 rounded mt-1">
                <span className="line-through flex-1">{f}</span>
                <button
                  title="Wiederherstellen"
                  onClick={() => handleRestore(f)}
                  className="text-green-600 border border-green-600 hover:bg-green-50 p-2 rounded-full"
                >
                  ♻️
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeadDocuments;
