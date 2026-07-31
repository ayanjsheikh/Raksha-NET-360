from sqlalchemy import Column, Integer, Float, String, ForeignKey
from database.database import Base

class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    heart_rate = Column(Integer)
    blood_pressure = Column(String)
    spo2 = Column(Integer)
    temperature = Column(Float)
    sugar_level = Column(Integer)
    bmi = Column(Float)

    health_index = Column(Integer, default=0)