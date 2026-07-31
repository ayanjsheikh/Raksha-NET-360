from pydantic import BaseModel
from typing import List

class OfflineHealthRecord(BaseModel):
    user_id: int
    heart_rate: int
    blood_pressure: str
    spo2: int
    temperature: float
    sugar_level: int
    bmi: float

class SyncRequest(BaseModel):
    records: List[OfflineHealthRecord]