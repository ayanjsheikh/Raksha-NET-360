from sqlalchemy import Column, Integer, String
from database.database import Base

class AuthUser(Base):
    __tablename__ = "auth_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    password = Column(String, nullable=False)
    