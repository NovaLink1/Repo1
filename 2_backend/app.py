from fastapi import FastAPI
from crm_core import leads_db, Lead
from typing import List

app = FastAPI()

@app.get("/leads", response_model=List[Lead])
def get_all_leads():
    return leads_db

