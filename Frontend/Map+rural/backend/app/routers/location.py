"""
location.py
------------------------------------------------------------------------------
RakshaNet 360 — Member 4 — GET /api/location

The frontend gets live GPS directly from the browser (maps/LocationService.ts)
for accuracy; this endpoint exists for two supporting cases:
  1. A coarse IP-based fallback when a device has no GPS/browser geolocation
     (e.g. a basic feature-phone gateway integration).
  2. A single source of truth other services (AI engine, notification
     service) can query for "where was this user last seen by the backend".
------------------------------------------------------------------------------
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Query

from backend.app.models.schemas import LocationResponse

router = APIRouter()

# Demo fallback — geographic center of India. Replace with a real IP-geolocation
# provider (e.g. ipinfo.io) in production.
DEFAULT_LOCATION = {"latitude": 22.9734, "longitude": 78.6569}


@router.get("", response_model=LocationResponse)
async def get_location(
    lat: float | None = Query(default=None, description="Client-reported latitude, if available"),
    lng: float | None = Query(default=None, description="Client-reported longitude, if available"),
):
    latitude = lat if lat is not None else DEFAULT_LOCATION["latitude"]
    longitude = lng if lng is not None else DEFAULT_LOCATION["longitude"]

    return LocationResponse(
        latitude=latitude,
        longitude=longitude,
        accuracy=None if lat is not None else 50000.0,  # flag coarse fallback accuracy
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
