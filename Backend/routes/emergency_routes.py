from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db

from models.user import User
from models.health import HealthRecord
from models.contact import EmergencyContact
from models.sos import SOSRecord

from services.hospital_service import get_nearby_hospitals
from services.health_index_service import (
    calculate_health_index,
    get_health_status,
)
from services.recommendation_service import get_recommendations

router = APIRouter(
    prefix="/api/emergency",
    tags=["Emergency"]
)

@router.get("/respond/{user_id}")
def emergency_response(
    user_id: int,
    lat: float,
    lon: float,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"message": "User not found"}

    health = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.id.desc())
        .first()
    )

    if not health:
        return {"message": "No health record found"}

    contacts = db.query(EmergencyContact).filter(
        EmergencyContact.user_id == user_id
    ).all()

    sos = (
        db.query(SOSRecord)
        .filter(SOSRecord.user_id == user_id)
        .order_by(SOSRecord.id.desc())
        .first()
    )

    score = calculate_health_index(health)

    status = get_health_status(score)

    recommendations = get_recommendations(health)

    hospitals = get_nearby_hospitals(lat, lon)

    return {
        "user": user,
        "health_index": score,
        "health_status": status,
        "recommendations": recommendations,
        "nearest_hospitals": hospitals[:3],
        "emergency_contacts": contacts,
        "latest_sos": sos
    }