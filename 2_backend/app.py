from fastapi import FastAPI
from crm_core import Lead, LeadCreate
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from leads_storage import save_leads, load_leads

app = FastAPI()

# Lade gespeicherte Leads beim Start
leads_db = load_leads()

# CORS für Verbindung mit Frontend auf localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GET – Alle Leads abrufen
@app.get("/leads", response_model=List[Lead])
def get_all_leads():
    return leads_db

# POST – Neuen Lead hinzufügen
@app.post("/leads", response_model=Lead)
def add_lead(lead_data: LeadCreate):
    new_lead = Lead(id=str(uuid4()), **lead_data.dict())
    leads_db.append(new_lead)
    save_leads(leads_db)
    return new_lead

from fastapi import HTTPException  # brauchst du oben beim Import

@app.put("/leads/{lead_id}", response_model=Lead)
def update_lead(lead_id: str, updated_data: LeadCreate):
    for index, lead in enumerate(leads_db):
        if lead.id == lead_id:
            updated_lead = Lead(id=lead_id, **updated_data.dict())
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

import os
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/files/{lead_id}")
def list_files(lead_id: str):
    path = os.path.join(UPLOAD_DIR, f"lead_{lead_id}")
    if not os.path.exists(path):
        return []
    files = os.listdir(path)
    return [{"name": f, "url": f"/files/lead_{lead_id}/{f}"} for f in files]

app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")
