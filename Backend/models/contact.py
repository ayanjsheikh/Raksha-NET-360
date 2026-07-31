from sqlalchemy import Column, Integer, String, ForeignKey
from database.database import Base

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    name = Column(String)
    phone = Column(String)
    relation = Column(String)