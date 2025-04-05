import json
from typing import List
from crm_core import Lead

FILE = "leads.json"

def save_leads(leads: List[Lead]):
    with open(FILE, "w", encoding="utf-8") as f:
        json.dump([lead.dict() for lead in leads], f, ensure_ascii=False, indent=2)

def load_leads() -> List[Lead]:
    try:
        with open(FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return [Lead(**item) for item in data]
    except FileNotFoundError:
        return []
