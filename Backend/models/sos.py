from sqlalchemy import Column, Integer, String, DateTime
from database.database import Base
from datetime import datetime

class SOSRecord(Base):
    __tablename__ = "sos_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    latitude = Column(String)
    longitude = Column(String)
    emergency_type = Column(String)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)