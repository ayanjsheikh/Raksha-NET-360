from pydantic import BaseModel

class SOSCreate(BaseModel):
    user_id: int
    latitude: str
    longitude: str
    emergency_type: str