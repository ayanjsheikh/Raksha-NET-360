from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    age: int
    category: str
    gender: str
    blood_group: str
    height: float
    weight: float
    medical_condition: str