// LeadDocuments.jsx – kampfbereit gemacht ⚔️

import React, { useEffect, useState } from "react";

const LeadDocuments = ({ selectedLead }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [renameMap, setRenameMap] = useState({});
  const [trashedFiles, setTrashedFiles] = useState([]);

  const token = localStorage.getItem("leadnova_token");

  

  useEffect(() => {
    if (!selectedLead) return;
    fetch(`http://localhost:8000/files/${selectedLead.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFiles)
      .catch((err) => console.error("Fehler beim Laden der Dateien:", err));

    fetch(`http://localhost:8000/trash/${selectedLead.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTrashedFiles)
      .catch((err) => console.error("Fehler beim Laden des Papierkorbs:", err));
  }, [selectedLead]);

  const handleFileChange = (e) => {
    Array.from(e.target.files).forEach(uploadFileToServer);
    e.target.value = ""; // Reset des Inputs
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFileToServer);
  };
  

  const handleUpload = async () => {
    if (!selectedFile || !selectedLead) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`http://localhost:8000/upload/${selectedLead.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();
      console.log("✅ Upload erfolgreich:", result);
      setUploadStatus("Erfolgreich hochgeladen");
      setSelectedFile(null);
      setFiles((prev) => [...prev, result.url]);
    } catch (err) {
      console.error("❌ Upload fehlgeschlagen:", err);
      setUploadStatus("Fehler beim Hochladen");
    }
  };

  const handleDelete = async (filename) => {
    await fetch(`http://localhost:8000/delete/${selectedLead.id}/${filename}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setFiles(files.filter((f) => f !== filename));
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
    setFiles(files.map((f) => (f === filename ? newName : f)));
  };

  const handleRestore = async (filename) => {
    await fetch(`http://localhost:8000/restore/${selectedLead.id}/${filename}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTrashedFiles(trashedFiles.filter((f) => f !== filename));
    setFiles((prev) => [...prev, filename]);
  };

  return (
    <div>
      <h3 className="font-bold mb-2">📎 Dokumente für: {selectedLead?.firma || "-"}</h3>

      <input type="file" onChange={handleFileChange} accept=".pdf" />
      <button onClick={handleUpload} className="bg-blue-600 text-white p-2 rounded ml-2">
        Hochladen
      </button>
      <p className="text-sm text-gray-600 mt-1">{uploadStatus}</p>

      <ul className="mt-4">
      {files.map((file, index) => (
  <li
    key={file.name || index}
    className="flex items-center justify-between border p-2 rounded mb-2"
  >
    <span>{file.name}</span>
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Neuer Name"
        value={renameMap[file.name] || ""}
        onChange={(e) =>
          setRenameMap({ ...renameMap, [file.name]: e.target.value })
        }
        className="border p-1 rounded"
      />
      <button onClick={() => handleRename(file.name)} className="text-yellow-600">
        Umbenennen
      </button>
      <button onClick={() => handleDelete(file.name)} className="text-red-600">
        Löschen
      </button>
    </div>
  </li>
))}
      </ul>

      {trashedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold">🗑️ Papierkorb</h4>
          <ul>
            {trashedFiles.map((f) => (
              <li key={f} className="flex justify-between items-center border p-2 rounded mt-1">
                <span>{f}</span>
                <button onClick={() => handleRestore(f)} className="text-green-600">Wiederherstellen</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeadDocuments;
