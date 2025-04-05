from fastapi import FastAPI
from crm_core import leads_db, Lead, LeadCreate
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4

app = FastAPI()

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
    return new_lead
