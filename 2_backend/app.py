from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse, FileResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from uuid import uuid4
from datetime import datetime
from pydantic import BaseModel
import os
from crm_core import Lead, LeadCreate
from leads_storage import save_leads, load_leads
from auth import authenticate_user, create_access_token, get_current_user

# --- FastAPI Setup ---
app = FastAPI()

# --- CORS für Frontend auf Port 5173 ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Lead Datenbank ---
leads_db = load_leads()

def get_lead_by_id(lead_id: str):
    for lead in leads_db:
        if lead.id == lead_id:
            return lead
    return None

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
            updated_lead = Lead(
                id=lead_id,
                firma=updated_data.firma,
                branche=updated_data.branche,
                website=updated_data.website,
                bewertung=updated_data.bewertung,
                status=updated_data.status,
                notes=updated_data.notes,
                ansprechpartner1=updated_data.ansprechpartner1,
                position1=updated_data.position1,
                telefon1=updated_data.telefon1,
                email1=updated_data.email1,
                ansprechpartner2=updated_data.ansprechpartner2,
                position2=updated_data.position2,
                telefon2=updated_data.telefon2,
                email2=updated_data.email2,
                strasse=updated_data.strasse,
                plz=updated_data.plz,
                ort=updated_data.ort,
                uid=updated_data.uid,
                weitere_adressen=updated_data.weitere_adressen,
                anlieferung_tor=updated_data.anlieferung_tor,
            )
            leads_db[index] = updated_lead
            save_leads(leads_db)
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

# --- Datei umbenennen (mit JSON-Body) ---
class RenameRequest(BaseModel):
    old_name: str
    new_name: str

@app.put("/rename/{lead_id}")
def rename_file(lead_id: str, req: RenameRequest):
    lead_folder = os.path.join(UPLOAD_DIR, f"lead_{lead_id}")
    old_path = os.path.join(lead_folder, req.old_name)
    new_path = os.path.join(lead_folder, req.new_name)

    if not os.path.exists(old_path):
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")

    if os.path.exists(new_path):
        raise HTTPException(status_code=400, detail="Zielname existiert bereits")

    os.rename(old_path, new_path)
    return {"detail": "Datei umbenannt"}

# --- Datei löschen (Papierkorb verschieben) ---
@app.delete("/delete/{lead_id}/{filename}")
def delete_file(lead_id: str, filename: str, permanent: bool = False):
    if filename == ".trash":
        raise HTTPException(status_code=403, detail="Systemverzeichnis darf nicht gelöscht werden")

    lead_folder = os.path.join(UPLOAD_DIR, f"lead_{lead_id}")
    trash_folder = os.path.join(lead_folder, ".trash")
    file_path = os.path.join(lead_folder, filename)
    trash_path = os.path.join(trash_folder, filename)

    if not os.path.exists(file_path) and not os.path.exists(trash_path):
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")

    if permanent:
        path_to_delete = file_path if os.path.exists(file_path) else trash_path
        os.remove(path_to_delete)
        return {"detail": "Datei dauerhaft gelöscht"}

    os.makedirs(trash_folder, exist_ok=True)
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

# --- Datei herunterladen ---
@app.get("/download/{lead_id}/{filename}")
def download_file(lead_id: str, filename: str):
    lead_folder = os.path.join(UPLOAD_DIR, f"lead_{lead_id}")
    file_path = os.path.join(lead_folder, filename)

    if not os.path.exists(file_path):
        trash_path = os.path.join(lead_folder, ".trash", filename)
        if os.path.exists(trash_path):
            file_path = trash_path
        else:
            raise HTTPException(status_code=404, detail="Datei nicht gefunden")

    return FileResponse(file_path, filename=filename)

# --- Lead als vCard exportieren ---
@app.get("/leads/{lead_id}/export/vcard")
def export_vcard(lead_id: str):
    lead = get_lead_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead nicht gefunden")

    vcard = f"""BEGIN:VCARD
VERSION:3.0
FN:{lead.ansprechpartner1}
ORG:{lead.firma}
TITLE:{lead.position1}
TEL;TYPE=work,voice:{lead.telefon1}
EMAIL:{lead.email1}
ADR;TYPE=work:;;{lead.strasse};{lead.ort};;{lead.plz};Austria
END:VCARD
"""

    return Response(content=vcard, media_type="text/vcard", headers={
        "Content-Disposition": f"attachment; filename={lead.firma.replace(' ', '_')}.vcf"
    })

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}
