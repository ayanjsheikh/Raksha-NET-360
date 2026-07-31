"""
schemas.py
------------------------------------------------------------------------------
RakshaNet 360 — Member 4 — Shared Pydantic response models

Mirrors the TypeScript types in maps/MapService.ts and caregiver/Dashboard.tsx
so the frontend and backend contracts stay in sync.
------------------------------------------------------------------------------
"""

from typing import List, Literal, Optional, Tuple

from pydantic import BaseModel


class Place(BaseModel):
    id: str
    name: str
    type: Literal["hospital", "police", "pharmacy", "clinic"]
    latitude: float
    longitude: float
    address: str
    phone: str
    isOpen: bool
    emergencyAvailable: bool
    rating: Optional[float] = None


class SafeZone(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    radiusMeters: int
    type: Literal["shelter", "police", "hospital", "community-center"]


class RouteResult(BaseModel):
    distanceKm: float
    durationMinutes: float
    polyline: List[Tuple[float, float]]


class Patient(BaseModel):
    id: str
    name: str
    age: int
    condition: str
    healthScore: int
    batteryLevel: int
    lastSeen: str
    sosActive: bool
    latitude: float
    longitude: float


class PatientHealth(BaseModel):
    heartRate: int
    heartRateTrend: List[int]
    bloodPressure: str
    medicationAdherence: int
    fallDetected: bool
    healthScore: int


class TimelineEvent(BaseModel):
    id: str
    type: Literal["sos", "health", "location", "system"]
    title: str
    description: Optional[str] = None
    timestamp: str


class LocationResponse(BaseModel):
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    timestamp: str
