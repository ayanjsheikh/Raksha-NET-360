from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from models.health import HealthRecord
from schemas.sync_schema import SyncRequest

router = APIRouter(
    prefix="/api/sync",
    tags=["Offline Sync"]
)

@router.post("/")
def sync_data(request: SyncRequest, db: Session = Depends(get_db)):

    for record in request.records:

        health = HealthRecord(
            user_id=record.user_id,
            heart_rate=record.heart_rate,
            blood_pressure=record.blood_pressure,
            spo2=record.spo2,
            temperature=record.temperature,
            sugar_level=record.sugar_level,
            bmi=record.bmi
        )

        db.add(health)

    db.commit()

    return {
        "message": "Offline records synced successfully",
        "records_synced": len(request.records)
    }