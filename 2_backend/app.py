from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from uuid import uuid4
from datetime import datetime
import os

from crm_core import Lead, LeadCreate
from leads_storage import save_leads, load_leads

# --- FastAPI Setup ---
app = FastAPI()

# --- CORS für Frontend auf Port 5173 ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend erlaubt
    allow_credentials=True,
    allow_methods=["*"],  # Alle Methoden erlauben
    allow_headers=["*"],  # Alle Header erlauben
)

# --- Lead Datenbank ---
leads_db = load_leads()

@app.get("/leads", response_model=List[Lead])
def get_all_leads():
    return leads_db

@app.post("/leads", response_model=Lead)
def add_lead(lead_data: LeadCreate):
    new_lead = Lead(id=str(uuid4()), **lead_data.dict())
    leads_db.append(new_lead)
    save_leads(leads_db)
    return new_lead

@app.put("/leads/{lead_id}", response_model=Lead)
def update_lead(lead_id: str, updated_data: LeadCreate):
    for index, lead in enumerate(leads_db):
        if lead.id == lead_id:
            # Sicherstellen, dass das Notizenfeld ebenfalls gesetzt wird
            updated_lead = Lead(
                id=lead_id,
                firma=updated_data.firma,
                branche=updated_data.branche,
                website=updated_data.website,
                bewertung=updated_data.bewertung,
                status=updated_data.status,
                notes=updated_data.notes if updated_data.notes else "",  # Notizen korrekt setzen
            )
            leads_db[index] = updated_lead  # Lead in der Liste aktualisieren
            save_leads(leads_db)  # Leads auf der Festplatte speichern
            return updated_lead
    raise HTTPException(status_code=404, detail="Lead nicht gefunden")


@app.delete("/leads/{lead_id}", response_model=dict)
def delete_lead(lead_id: str):
    global leads_db
    leads_db = [lead for lead in leads_db if lead.id != lead_id]
    save_leads(leads_db)
    return {"detail": "Lead gelöscht"}

# --- Upload & Dateien ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/{lead_id}")
async def upload_file(lead_id: str, file: UploadFile = File(...)):
    dir_path = os.path.join(UPLOAD_DIR, f"lead_{lead_id}")
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, file.filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    return {"filename": file.filename}

@app.get("/files/{lead_id}")
def list_files(lead_id: str):
    path = os.path.join(UPLOAD_DIR, f"lead_{lead_id}")
    if not os.path.exists(path):
        return []

    files = []
    for f in os.listdir(path):
        if f == ".trash":
            continue
        full_path = os.path.join(path, f)
        stats = os.stat(full_path)
        files.append({
            "name": f,
            "url": f"/files/lead_{lead_id}/{f}",
            "size": stats.st_size,
            "modified": datetime.fromtimestamp(stats.st_mtime).isoformat()
        })
    return files

# --- Statische Dateien für Vorschau ---
app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")

# --- Datei umbenennen ---
@app.put("/rename/{lead_id}")
def rename_file(lead_id: str, old_name: str, new_name: str):
    dir_path = os.path.join(UPLOAD_DIR, f"lead_{lead_id}")
    old_path = os.path.join(dir_path, old_name)
    new_path = os.path.join(dir_path, new_name)

    if not os.path.exists(old_path):
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    if os.path.exists(new_path):
        raise HTTPException(status_code=400, detail="Neue Datei existiert bereits")

    os.rename(old_path, new_path)
    return {"detail": "Datei umbenannt"}

# --- Datei löschen (Papierkorb verschieben) ---
@app.delete("/delete/{lead_id}/{filename}")
def delete_file(lead_id: str, filename: str):
    if filename == ".trash":
        raise HTTPException(status_code=403, detail="Systemverzeichnis darf nicht gelöscht werden")

    lead_folder = os.path.join(UPLOAD_DIR, f"lead_{lead_id}")
    trash_folder = os.path.join(lead_folder, ".trash")
    os.makedirs(trash_folder, exist_ok=True)

    file_path = os.path.join(lead_folder, filename)
    trash_path = os.path.join(trash_folder, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")

    os.rename(file_path, trash_path)
    return {"detail": "Datei in den Papierkorb verschoben"}

# --- Papierkorb-Inhalte ---
@app.get("/trash/{lead_id}")
def list_trashed_files(lead_id: str):
    trash_path = os.path.join(UPLOAD_DIR, f"lead_{lead_id}", ".trash")
    if not os.path.exists(trash_path):
        return []
    return os.listdir(trash_path)

# --- Datei wiederherstellen ---
@app.put("/restore/{lead_id}/{filename}")
def restore_file(lead_id: str, filename: str):
    trash_path = os.path.join(UPLOAD_DIR, f"lead_{lead_id}", ".trash", filename)
    restore_path = os.path.join(UPLOAD_DIR, f"lead_{lead_id}", filename)

    if not os.path.exists(trash_path):
        raise HTTPException(status_code=404, detail="Gelöschte Datei nicht gefunden")

    os.rename(trash_path, restore_path)
    return {"detail": "Datei wiederhergestellt"}
