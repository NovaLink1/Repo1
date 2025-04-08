import React, { useRef, useState } from "react";

const LeadDocuments = ({ savedFiles, setSavedFiles }) => {
  const fileInputRef = useRef(null);
  const [trash, setTrash] = useState([]);
  const [dragging, setDragging] = useState(false);

  // Fehlerbehandlung: savedFiles muss ein Array sein
  if (!Array.isArray(savedFiles)) {
    return <p className="text-gray-500 italic">Keine Dateien vorhanden oder kein Lead ausgewählt.</p>;
  }

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map((file) => ({
      name: file.name,
      id: Date.now() + Math.random()
    }));
    setSavedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      name: file.name,
      id: Date.now() + Math.random()
    }));
    setSavedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleMoveToTrash = (fileId) => {
    const file = savedFiles.find((f) => f.id === fileId);
    if (file) {
      setTrash((prev) => [...prev, file]);
      setSavedFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const handleRestoreFromTrash = (fileId) => {
    const file = trash.find((f) => f.id === fileId);
    if (file) {
      setSavedFiles((prev) => [...prev, file]);
      setTrash((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const handlePermanentDelete = (fileId) => {
    setTrash((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleRenameFile = (fileId, newName) => {
    setSavedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, name: newName } : file
      )
    );
  };

  return (
    <div
      className="relative w-full h-full border-dashed border-2 border-gray-300 rounded-lg p-4"
      onDrop={handleFileDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
    >
      <div className="mb-4">
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          📁 Datei hochladen
        </button>
        <input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>

      {/* Aktive Dateien */}
      <div className="space-y-2">
        {savedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between bg-gray-50 p-2 rounded border"
          >
            <input
              type="text"
              value={file.name}
              onChange={(e) => handleRenameFile(file.id, e.target.value)}
              className="w-2/3 border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => handleMoveToTrash(file.id)}
              className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              In Papierkorb
            </button>
          </div>
        ))}
      </div>

      {/* Papierkorb */}
      {trash.length > 0 && (
        <div className="absolute bottom-4 right-4 w-64 bg-red-50 border border-red-300 rounded-lg p-3 shadow">
          <h3 className="text-sm font-semibold text-red-700 mb-2">🗑️ Papierkorb</h3>
          <ul className="space-y-1 text-sm text-red-800">
            {trash.map((file) => (
              <li key={file.id} className="flex justify-between items-center">
                <span className="truncate">{file.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleRestoreFromTrash(file.id)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Wiederherstellen
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(file.id)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Löschen
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Drag Overlay */}
      {dragging && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-40 flex items-center justify-center pointer-events-none rounded-lg">
          <p className="text-blue-600 font-semibold text-lg">📂 Datei hier ablegen</p>
        </div>
      )}
    </div>
  );
};

export default LeadDocuments;