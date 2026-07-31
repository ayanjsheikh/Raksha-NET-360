"""
caregiver.py
------------------------------------------------------------------------------
RakshaNet 360 — Member 4 — Caregiver Dashboard API

Endpoints:
  GET  /api/caregiver/patients
  GET  /api/patient/{id}
  GET  /api/patient/{id}/location
  GET  /api/patient/{id}/health
  GET  /api/patient/{id}/history
  POST /api/sos/{sos_id}/acknowledge
  POST /api/sos/{sos_id}/resolve
------------------------------------------------------------------------------
"""

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.app.data.store import DATA_STORE
from backend.app.models.schemas import LocationResponse, Patient, PatientHealth, TimelineEvent

router = APIRouter()


@router.get("/caregiver/patients", response_model=List[Patient])
async def list_patients():
    return DATA_STORE.all_patients()


@router.get("/patient/{patient_id}", response_model=Patient)
async def get_patient(patient_id: str):
    patient = DATA_STORE.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/patient/{patient_id}/location", response_model=LocationResponse)
async def get_patient_location(patient_id: str):
    patient = DATA_STORE.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return LocationResponse(
        latitude=patient["latitude"],
        longitude=patient["longitude"],
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/patient/{patient_id}/health", response_model=PatientHealth)
async def get_patient_health(patient_id: str):
    health = DATA_STORE.get_health(patient_id)
    if not health:
        raise HTTPException(status_code=404, detail="Health data not found")
    return health


@router.get("/patient/{patient_id}/history", response_model=List[TimelineEvent])
async def get_patient_history(patient_id: str):
    if not DATA_STORE.get_patient(patient_id):
        raise HTTPException(status_code=404, detail="Patient not found")
    return DATA_STORE.get_history(patient_id)


class ResolveSosBody(BaseModel):
    note: Optional[str] = None


@router.post("/sos/{sos_id}/acknowledge")
async def acknowledge_sos(sos_id: str):
    event = DATA_STORE.acknowledge_sos(sos_id)
    if not event:
        raise HTTPException(status_code=404, detail="SOS event not found")
    return {"status": "acknowledged"}


@router.post("/sos/{sos_id}/resolve")
async def resolve_sos(sos_id: str, body: ResolveSosBody):
    event = DATA_STORE.resolve_sos(sos_id, body.note)
    if not event:
        raise HTTPException(status_code=404, detail="SOS event not found")
    return {"status": "resolved"}
