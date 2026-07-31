from database.database import engine, Base

from models.user import User
from models.health import HealthRecord
from models.sos import SOSRecord
from models.contact import EmergencyContact
from models.location import Location
from models.auth_user import AuthUser

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")