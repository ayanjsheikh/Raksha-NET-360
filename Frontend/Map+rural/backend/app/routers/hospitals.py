"""
hospitals.py
------------------------------------------------------------------------------
RakshaNet 360 — Member 4 — Nearby Emergency Services API

Endpoints:
  GET /api/nearby-hospitals
  GET /api/nearby-police
  GET /api/nearby-pharmacy
  GET /api/safe-zones
  GET /api/route

Distance filtering (radius_km) happens server-side using the haversine
formula; the frontend's MapService.ts additionally re-sorts/enriches results
client-side once it has the browser's most current GPS fix, so results stay
correct even if the user moves between the request and the response.
------------------------------------------------------------------------------
"""

import math
from typing import List

from fastapi import APIRouter, Query

from backend.app.data.store import DATA_STORE
from backend.app.models.schemas import Place, RouteResult, SafeZone

router = APIRouter()


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlambda / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def _filter_by_radius(places: List[dict], lat: float, lng: float, radius_km: float) -> List[dict]:
    return [p for p in places if haversine_km(lat, lng, p["latitude"], p["longitude"]) <= radius_km]


@router.get("/nearby-hospitals", response_model=List[Place])
async def nearby_hospitals(
    lat: float = Query(...), lng: float = Query(...), radius_km: float = Query(10, gt=0, le=100)
):
    return _filter_by_radius(DATA_STORE.all_hospitals(), lat, lng, radius_km)


@router.get("/nearby-police", response_model=List[Place])
async def nearby_police(
    lat: float = Query(...), lng: float = Query(...), radius_km: float = Query(10, gt=0, le=100)
):
    return _filter_by_radius(DATA_STORE.all_police(), lat, lng, radius_km)


@router.get("/nearby-pharmacy", response_model=List[Place])
async def nearby_pharmacy(
    lat: float = Query(...), lng: float = Query(...), radius_km: float = Query(10, gt=0, le=100)
):
    return _filter_by_radius(DATA_STORE.all_pharmacies(), lat, lng, radius_km)


@router.get("/safe-zones", response_model=List[SafeZone])
async def safe_zones(
    lat: float = Query(...), lng: float = Query(...), radius_km: float = Query(15, gt=0, le=100)
):
    return _filter_by_radius(DATA_STORE.all_safe_zones(), lat, lng, radius_km)


@router.get("/route", response_model=RouteResult)
async def route(
    origin_lat: float = Query(...),
    origin_lng: float = Query(...),
    dest_lat: float = Query(...),
    dest_lng: float = Query(...),
):
    """
    Lightweight server-side route estimate (straight-line distance + an urban
    driving-speed assumption). The frontend's RouteNavigation.tsx primarily
    uses the public OSRM routing engine directly for an actual road-following
    polyline; this endpoint is a fallback/estimate used by any consumer that
    can't reach OSRM (e.g. a server-side notification message estimating ETA).
    """
    distance = haversine_km(origin_lat, origin_lng, dest_lat, dest_lng)
    avg_speed_kmh = 32
    duration_minutes = max(1, round((distance / avg_speed_kmh) * 60))

    return RouteResult(
        distanceKm=round(distance, 1),
        durationMinutes=duration_minutes,
        polyline=[(origin_lat, origin_lng), (dest_lat, dest_lng)],
    )
