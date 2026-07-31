"""
hardware_api.py
------------------------------------------------------------------------------
RakshaNet 360 — Member 4 — Phase 4/5: Hardware ingestion endpoint

This router receives the "Emergency Packet" HTTP POST from the ESP32 SOS
device (see hardware/esp32/sos_device/sos_device.ino) and is the single
entry point where hardware meets software:

    ESP32 SOS Button --HTTP POST--> /api/hardware/sos --> this router
                                                            |
                                                            v
                                        AI classification (backend.app.services.ai)
                                                            |
                                                            v
                                  WebSocket broadcast -> Caregiver Dashboard
                                                            |
                                                            v
                                        Emergency Map opens on nearest hospital

Mounted into the main FastAPI app in backend/app/main.py:

    from hardware.hardware_api import router as hardware_router
    app.include_router(hardware_router, prefix="/api/hardware", tags=["hardware"])
------------------------------------------------------------------------------
"""

from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter()

# In production this would be a database (Postgres/Mongo). For the hackathon
# demo we keep an in-memory store shared with the /api/caregiver endpoints
# via backend/app/data/store.py.
from backend.app.data.store import DATA_STORE  # noqa: E402  (see note below)
from backend.app.websocket_manager import ws_manager  # noqa: E402


class EmergencyPacket(BaseModel):
    """Matches the JSON body sent by sos_device.ino's sendSosPacket()."""

    device_id: str = Field(..., description="Unique ESP32 device identifier")
    latitude: float
    longitude: float
    gps_valid: bool = True
    battery_pct: int = Field(ge=0, le=100)
    triggered_at: Optional[int] = Field(
        default=None, description="Device-side millis() timestamp (informational only)"
    )


class EmergencyPacketResponse(BaseModel):
    sos_id: str
    status: str
    received_at: str
    classified_severity: str


def classify_severity(packet: EmergencyPacket) -> str:
    """
    Lightweight stand-in for the "AI Classifies Emergency" step in the Final
    Emergency Flow. A real implementation would call the AI Engine service
    (e.g. a model trained on vitals + button-hold duration + fall-detection
    signals). Here we classify by GPS confidence and battery health so the
    demo still shows meaningfully different severities.
    """
    if not packet.gps_valid:
        return "warning"  # location uncertain — still urgent, flagged differently
    if packet.battery_pct < 15:
        return "warning"
    return "critical"


@router.post("/sos", response_model=EmergencyPacketResponse)
async def receive_sos(packet: EmergencyPacket):
    device = DATA_STORE.find_patient_by_device_id(packet.device_id)
    if device is None:
        raise HTTPException(status_code=404, detail=f"Unknown device_id: {packet.device_id}")

    sos_id = str(uuid4())
    received_at = datetime.now(timezone.utc).isoformat()
    severity = classify_severity(packet)

    DATA_STORE.record_sos(
        sos_id=sos_id,
        patient_id=device["id"],
        latitude=packet.latitude,
        longitude=packet.longitude,
        battery_pct=packet.battery_pct,
        gps_valid=packet.gps_valid,
        severity=severity,
        received_at=received_at,
    )

    # Broadcast to every connected Caregiver Dashboard over WebSocket.
    await ws_manager.broadcast(
        "sos",
        {
            "sosId": sos_id,
            "patientId": device["id"],
            "patientName": device["name"],
            "message": f"SOS button pressed ({'GPS fix' if packet.gps_valid else 'last known location'})",
            "latitude": packet.latitude,
            "longitude": packet.longitude,
            "severity": severity,
        },
    )

    return EmergencyPacketResponse(
        sos_id=sos_id,
        status="received",
        received_at=received_at,
        classified_severity=severity,
    )


@router.post("/heartbeat")
async def device_heartbeat(device_id: str, battery_pct: int, latitude: float, longitude: float):
    """
    Optional periodic check-in (not required by the ESP32 sketch above, but
    useful if you extend the firmware to phone home every N minutes so the
    dashboard's "Last Seen" / "Battery Level" stay fresh even without an SOS).
    """
    device = DATA_STORE.find_patient_by_device_id(device_id)
    if device is None:
        raise HTTPException(status_code=404, detail=f"Unknown device_id: {device_id}")

    DATA_STORE.update_patient_telemetry(device["id"], battery_pct, latitude, longitude)
    await ws_manager.broadcast(
        "location",
        {"patientId": device["id"], "latitude": latitude, "longitude": longitude},
    )
    return {"status": "ok"}
