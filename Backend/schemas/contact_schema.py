from pydantic import BaseModel

class ContactCreate(BaseModel):
    user_id: int
    name: str
    phone: str
    relation: str