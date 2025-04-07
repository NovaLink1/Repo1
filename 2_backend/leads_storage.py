import json
from typing import List
from crm_core import Lead

FILE = "leads.json"

import json

def save_leads(leads):
    with open("leads.json", "w") as f:
        json.dump([lead.dict() for lead in leads], f)  # Speichert die Notizen zusammen mit anderen Daten


def load_leads() -> List[Lead]:
    try:
        with open(FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [Lead(**item) for item in data]
    except FileNotFoundError:
        return []
