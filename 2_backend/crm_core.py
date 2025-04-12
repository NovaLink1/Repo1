from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

# LeadCreate – wird beim POST verwendet (ohne ID)
class LeadCreate(BaseModel):
    firma: str
    branche: Optional[str] = None
    website: Optional[str] = None
    bewertung: Optional[int] = None
    status: str = "neu"
    notes: Optional[str] = ""

    ansprechpartner1: Optional[str] = ""
    position1: Optional[str] = ""
    telefon1: Optional[str] = ""
    email1: Optional[str] = ""

    ansprechpartner2: Optional[str] = ""
    position2: Optional[str] = ""
    telefon2: Optional[str] = ""
    email2: Optional[str] = ""




# Lead – vollständiges Lead-Modell mit ID
class Lead(LeadCreate):
    id: str
    notes: Optional[str] = ""  # Sicherstellen, dass das `notes`-Feld hier enthalten ist

# Dummy-Datenbank (Liste von Leads)
leads_db: List[Lead] = [
    Lead(id=str(uuid4()), firma="Stahlbau Maier GmbH", branche="Metallbau", website="https://maier-stahl.de", bewertung=82, status="neu"),
    Lead(id=str(uuid4()), firma="AluTec AG", branche="Fassadenbau", website="https://alutec.de", bewertung=67, status="kontaktiert"),
    Lead(id=str(uuid4()), firma="Schlosserei Bauer", branche="Handwerk", website="https://bauer-schlosserei.de", bewertung=91, status="interessiert"),
]
