from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from models.sos import SOSRecord
from schemas.sos_schema import SOSCreate

router = APIRouter(
    prefix="/api/sos",
    tags=["SOS"]
)

@router.post("/send")
def send_sos(data: SOSCreate, db: Session = Depends(get_db)):

    sos = SOSRecord(
        user_id=data.user_id,
        latitude=data.latitude,
        longitude=data.longitude,
        emergency_type=data.emergency_type
    )

    db.add(sos)
    db.commit()
    db.refresh(sos)

    return {
        "message": "SOS Sent Successfully",
        "sos_id": sos.id
    }
@router.get("/")
def get_sos_history(db: Session = Depends(get_db)):
    return db.query(SOSRecord).all()
