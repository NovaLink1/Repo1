import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const LeadDetailPopup = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState(lead);

  useEffect(() => {
    console.log("Popup wird versucht zu rendern", lead);
  }, [lead]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  function handleSave(e) {
    e.preventDefault();
    // Du kannst hier später das eigentliche Speichern einbauen
    console.log("Speichern gedrückt");
    onClose(); // Popup schließen nach dem Speichern
  }
  
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.5)",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 0 30px rgba(0,0,0,0.3)",
          maxWidth: "800px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#eee",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          ✖
        </button>
  
        <h2>Lead bearbeiten</h2>
        <form onSubmit={handleSave}>
          {/* Dein bestehendes Formular hier */}
          {/* ... */}
        </form>
      </div>
    </div>,
    document.getElementById("popup-root")
  );
  
};

export default LeadDetailPopup;
