from pydantic import BaseModel


class HealthCreate(BaseModel):
    user_id: int
    heart_rate: int
    blood_pressure: str
    spo2: int
    temperature: float
    sugar_level: int
    bmi: float