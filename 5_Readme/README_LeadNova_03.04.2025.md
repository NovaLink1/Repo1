# LeadNova – KI-gestütztes Leadfinder- und CRM-System

🕓 Projektstart: 2025-04-03 – Setup & Struktur initialisiert

## 🚀 Erste Schritte – Lokale Entwicklung

### 1. Backend vorbereiten

```bash
cd 2_backend
poetry install         # Installiert alle Python-Abhängigkeiten
cp .env.example .env   # Erstelle deine lokale Umgebungsdatei
```

> ❗ Stelle sicher, dass **Poetry** installiert ist:  
> https://python-poetry.org/docs/#installation

---

### 2. Frontend vorbereiten

```bash
cd 1_frontend
npm install            # Installiert alle Node-Abhängigkeiten
cp .env.example .env   # Umgebungsdatei für Vite/React
```

> ❗ Voraussetzung: Node.js 18+ installiert → https://nodejs.org/

---

### 3. Projekt starten

- **Frontend starten:**
  ```bash
  npm run dev
  ```

- **Backend starten (lokal mit Uvicorn):**
  ```bash
  poetry run uvicorn app:app --reload
  ```

---

### 🧪 Testdaten & Auth

- Adminzugang erstellen (geplant über Script oder Registrierungsmaske)
- Testdaten optional via CSV in `3_shared/constants/` laden

---

## 📜 Änderungsprotokoll

### 📅 03.04.2025 – Projektstart & Setup

- Projektverzeichnis `E:/1_LeadfinderCRM` erstellt
- Git initialisiert
- Struktur mit nummerierten Ordnern eingeführt (1_frontend, 2_backend, ...)
- `.gitignore` für Node.js & Python ergänzt
- README und Projektlog aufgesetzt
- Erste Tests mit FastAPI & Poetry vorbereitet

### 📅 04.04.2025 – Backend-Setup & erster Test erfolgreich abgeschlossen

- Poetry erfolgreich initialisiert im Ordner `2_backend`
- Abhängigkeiten `fastapi` und `uvicorn[standard]` installiert
- `app.py` mit erstem `GET /`-Endpoint erstellt
- Server mit `poetry run uvicorn app:app --reload` gestartet
- Erfolgreicher Aufruf im Browser unter `http://localhost:8000`
- Swagger-Dokumentation über `http://localhost:8000/docs` erreicht
- Fehlerverhalten & Shutdown-Prozesse getestet (`STRG+C`, Neustart)
- Letzter Commit des Tages erfolgreich nach Konfiguration von `safe.directory`:
  ```
  git commit -m "Backend eingerichtet, FastAPI-Server läuft, erster Endpoint / getestet"
  ```
