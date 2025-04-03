# LeadNova – KI-gestütztes Leadfinder- und CRM-System

🕓 Projektstart: 2025-04-03 – Setup & Struktur initialisiert



Willkommen im offiziellen Repository von **LeadNova**, einer modularen Web-App zur Leadgenerierung, Bewertung und Verwaltung – speziell entwickelt für den Einsatz im Handwerk, Metall- und Stahlbau. Die Architektur erlaubt aber eine einfache Erweiterung auf jede beliebige Branche.

---

## 📁 Ordnerstruktur (nummeriert für klare Übersicht)

```
LeadfinderCRM/
│
├── 1_frontend/       → React + Tailwind Web-Oberfläche
│   └── src/
│       ├── 1_components/   → UI-Bausteine (Buttons, Cards, usw.)
│       ├── 2_pages/        → Hauptseiten (Dashboard, Leads, Login)
│       ├── 3_services/     → API-Kommunikation
│       ├── 4_styles/       → Globale und modulare Styles
│       └── 5_utils/        → Hilfsfunktionen
│
├── 2_backend/        → Python + FastAPI + Scoring + KI
│   └── app/
│       ├── 1_routers/      → API-Endpunkte
│       ├── 2_models/       → SQLAlchemy-Modelle
│       ├── 3_services/     → Logik für Scoring, Scraper, KI
│       ├── 4_auth/         → Authentifizierung (JWT, Registrierung)
│       └── config.py       → Umgebungs-Setup
│
├── 3_shared/         → Gemeinsame Module & Konstanten
│   └── constants/    → Branchenlisten, Filterwerte etc.
│
├── 4_docs/           → Projektdokumentation & Planungen
│   └── technische-notizen.md
│
└── README.md         → Diese Datei
```

---

## ⚙️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios (API-Aufrufe)

**Backend:**
- Python 3.10+
- FastAPI + Uvicorn
- SQLAlchemy + Pydantic
- bcrypt + JWT für Auth
- spaCy / sklearn (für KI)
- Poetry als Paketmanager

**Datenbank:**
- PostgreSQL (empfohlen)
- Alternativ: Supabase oder MongoDB

---

## 🚀 Erste Schritte – Lokale Entwicklung

### 1. Backend vorbereiten

```bash
cd 2_backend
poetry install         # Installiert alle Python-Abhängigkeiten
cp .env.example .env   # Erstelle deine lokale Umgebungsdatei
```

---

### 2. Frontend vorbereiten

```bash
cd 1_frontend
npm install            # Installiert alle Node-Abhängigkeiten
cp .env.example .env   # Umgebungsdatei für Vite/React
```


---

### 3. Projekt starten

- **Frontend starten:**
  ```bash
  npm run dev
  ```

- **Backend starten (lokal mit Uvicorn):**
  ```bash
  poetry run uvicorn app.main:app --reload
  ```

---

### 🧪 Testdaten & Auth

- Adminzugang erstellen (geplant über Script oder Registrierungsmaske)
- Testdaten optional via CSV in `3_shared/constants/` laden

### 1. Backend vorbereiten
```bash
cd 2_backend
poetry install
cp .env.example .env
```

### 2. Frontend vorbereiten
```bash
cd 1_frontend
npm install
cp .env.example .env
```

---

## 📌 Ziel des Projekts
LeadNova wird entwickelt, um Unternehmen automatisiert qualifizierte Leads zu liefern, sie intelligent zu bewerten und einfach zu verwalten. Ziel ist ein voll skalierbares, KI-gestütztes CRM-System mit Spezialisierung auf Industrie & Handwerk.

---

## 📄 Lizenz
Dieses Projekt ist **nicht quelloffen**. Jegliche Nutzung, Vervielfältigung oder Weitergabe – auch auszugsweise – ist **ohne ausdrückliche schriftliche Genehmigung des Urhebers untersagt**.

© 2025 – Alle Rechte vorbehalten.