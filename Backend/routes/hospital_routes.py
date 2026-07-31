from fastapi import APIRouter
from services.hospital_service import get_nearby_hospitals

router = APIRouter(
    prefix="/api/hospitals",
    tags=["Hospitals"]
)


@router.get("/nearby")
def nearby(lat: float, lon: float):

    return get_nearby_hospitals(lat, lon)