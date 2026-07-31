from sqlalchemy import Column, Integer, String, Float
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    gender = Column(String)
    blood_group = Column(String)
    height = Column(Float)
    weight = Column(Float)
    medical_condition = Column(String)