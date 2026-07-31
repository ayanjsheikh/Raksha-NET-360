from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from models.location import Location
from schemas.location_schema import LocationCreate

router = APIRouter(
    prefix="/api/location",
    tags=["Location"]
)

@router.post("/")
def update_location(location: LocationCreate, db: Session = Depends(get_db)):

    new_location = Location(
        user_id=location.user_id,
        latitude=location.latitude,
        longitude=location.longitude
    )

    db.add(new_location)
    db.commit()
    db.refresh(new_location)

    return {
        "message": "Location updated successfully",
        "location": new_location
    }


@router.get("/{user_id}")
def get_latest_location(user_id: int, db: Session = Depends(get_db)):

    location = (
        db.query(Location)
        .filter(Location.user_id == user_id)
        .order_by(Location.id.desc())
        .first()
    )

    if not location:
        return {"message": "No location found"}

    return location