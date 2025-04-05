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
