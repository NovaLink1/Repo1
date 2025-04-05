from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4



# Lead-Datenmodell
class Lead(BaseModel):
    id: str
    firma: str
    branche: Optional[str] = None
    webseite: Optional[str] = None
    bewertung: Optional[int] = None  # Skala 1–100
    status: str = "neu"  # neu, kontaktiert, interessiert, abgeschlossen


# Dummy-Datenbank (Liste)
leads_db: List[Lead] = [
    Lead(id=str(uuid4()), firma="Stahlbau Maier GmbH", branche="Metallbau", webseite="https://maier-stahl.de", bewertung=82, status="neu"),
    Lead(id=str(uuid4()), firma="AluTec AG", branche="Fassadenbau", webseite="https://alutec.de", bewertung=67, status="kontaktiert"),
    Lead(id=str(uuid4()), firma="Schlosserei Bauer", branche="Handwerk", webseite="https://bauer-schlosserei.de", bewertung=91, status="interessiert"),
]
