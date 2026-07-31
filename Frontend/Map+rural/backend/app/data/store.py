"""
store.py
------------------------------------------------------------------------------
RakshaNet 360 — Member 4 — In-memory data store

For the hackathon build we use a simple in-memory store so the whole module
runs with zero external dependencies (no DB setup required to demo). The
public methods here are intentionally the *only* way routers touch data, so
swapping this for a real database (Postgres via SQLAlchemy, MongoDB, etc.)
later only requires re-implementing this one class — every router keeps
working unchanged (Repository Pattern).
------------------------------------------------------------------------------
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
from uuid import uuid4

import random


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class DataStore:
    def __init__(self) -> None:
        self._seed()

    # ------------------------------------------------------------------ #
    # Seed data — Bhopal, Madhya Pradesh area coordinates used as a demo
    # anchor point (adjust to your own hackathon demo city as needed).
    # ------------------------------------------------------------------ #
    def _seed(self) -> None:
        self.hospitals: List[dict] = [
            {
                "id": "hosp-1", "name": "AIIMS Bhopal", "type": "hospital",
                "latitude": 23.2469, "longitude": 77.4131,
                "address": "Saket Nagar, Bhopal", "phone": "+917552672000",
                "isOpen": True, "emergencyAvailable": True, "rating": 4.5,
            },
            {
                "id": "hosp-2", "name": "Hamidia Hospital", "type": "hospital",
                "latitude": 23.2645, "longitude": 77.4023,
                "address": "Bhopal Old City", "phone": "+917552540222",
                "isOpen": True, "emergencyAvailable": True, "rating": 4.0,
            },
            {
                "id": "hosp-3", "name": "Bansal Hospital", "type": "hospital",
                "latitude": 23.2156, "longitude": 77.4368,
                "address": "Shahpura, Bhopal", "phone": "+917554085100",
                "isOpen": True, "emergencyAvailable": True, "rating": 4.3,
            },
        ]

        self.police_stations: List[dict] = [
            {
                "id": "pol-1", "name": "TT Nagar Police Station", "type": "police",
                "latitude": 23.2380, "longitude": 77.4110,
                "address": "TT Nagar, Bhopal", "phone": "+917552551100",
                "isOpen": True, "emergencyAvailable": True,
            },
            {
                "id": "pol-2", "name": "Shahpura Police Station", "type": "police",
                "latitude": 23.2110, "longitude": 77.4400,
                "address": "Shahpura, Bhopal", "phone": "+917554271100",
                "isOpen": True, "emergencyAvailable": True,
            },
        ]

        self.pharmacies: List[dict] = [
            {
                "id": "pharm-1", "name": "Apollo Pharmacy - MP Nagar", "type": "pharmacy",
                "latitude": 23.2337, "longitude": 77.4344,
                "address": "MP Nagar Zone II, Bhopal", "phone": "+917554066000",
                "isOpen": True, "emergencyAvailable": False,
            },
            {
                "id": "pharm-2", "name": "MedPlus - Arera Colony", "type": "pharmacy",
                "latitude": 23.2210, "longitude": 77.4550,
                "address": "Arera Colony, Bhopal", "phone": "+917554066111",
                "isOpen": False, "emergencyAvailable": False,
            },
        ]

        self.safe_zones: List[dict] = [
            {
                "id": "sz-1", "name": "Community Relief Shelter — Shahpura",
                "latitude": 23.2130, "longitude": 77.4390,
                "radiusMeters": 300, "type": "shelter",
            },
            {
                "id": "sz-2", "name": "TT Nagar Police Safe Point",
                "latitude": 23.2380, "longitude": 77.4110,
                "radiusMeters": 150, "type": "police",
            },
        ]

        # Patients — `deviceId` links a physical ESP32 to a patient record.
        self.patients: Dict[str, dict] = {
            "pat-1": {
                "id": "pat-1", "deviceId": "RN360-ESP32-001", "name": "Radha Devi",
                "age": 72, "condition": "Hypertension", "healthScore": 78,
                "batteryLevel": 64, "lastSeen": "2 min ago", "sosActive": False,
                "latitude": 23.2469, "longitude": 77.4131,
            },
            "pat-2": {
                "id": "pat-2", "deviceId": "RN360-ESP32-002", "name": "Mohan Lal",
                "age": 68, "condition": "Diabetes Type II", "healthScore": 55,
                "batteryLevel": 22, "lastSeen": "15 min ago", "sosActive": False,
                "latitude": 23.2380, "longitude": 77.4110,
            },
            "pat-3": {
                "id": "pat-3", "deviceId": "RN360-ESP32-003", "name": "Sunita Kumari",
                "age": 8, "condition": "Asthma", "healthScore": 88,
                "batteryLevel": 91, "lastSeen": "just now", "sosActive": False,
                "latitude": 23.2210, "longitude": 77.4550,
            },
        }

        self.health: Dict[str, dict] = {
            "pat-1": {
                "heartRate": 96, "heartRateTrend": [88, 91, 94, 90, 96, 93, 96],
                "bloodPressure": "148/92", "medicationAdherence": 82,
                "fallDetected": False, "healthScore": 78,
            },
            "pat-2": {
                "heartRate": 74, "heartRateTrend": [70, 72, 75, 74, 73, 76, 74],
                "bloodPressure": "132/85", "medicationAdherence": 60,
                "fallDetected": False, "healthScore": 55,
            },
            "pat-3": {
                "heartRate": 102, "heartRateTrend": [95, 98, 100, 97, 101, 99, 102],
                "bloodPressure": "110/70", "medicationAdherence": 95,
                "fallDetected": False, "healthScore": 88,
            },
        }

        now = datetime.now(timezone.utc)
        self.history: Dict[str, List[dict]] = {
            "pat-1": [
                {
                    "id": str(uuid4()), "type": "system", "title": "Device paired",
                    "description": "ESP32 SOS device RN360-ESP32-001 linked to account.",
                    "timestamp": (now - timedelta(days=5)).strftime("%d %b, %I:%M %p"),
                },
                {
                    "id": str(uuid4()), "type": "health", "title": "Blood pressure elevated",
                    "description": "Reading of 148/92 flagged above the configured threshold.",
                    "timestamp": (now - timedelta(hours=6)).strftime("%d %b, %I:%M %p"),
                },
            ],
            "pat-2": [
                {
                    "id": str(uuid4()), "type": "system", "title": "Device paired",
                    "description": "ESP32 SOS device RN360-ESP32-002 linked to account.",
                    "timestamp": (now - timedelta(days=12)).strftime("%d %b, %I:%M %p"),
                },
            ],
            "pat-3": [
                {
                    "id": str(uuid4()), "type": "system", "title": "Device paired",
                    "description": "ESP32 SOS device RN360-ESP32-003 linked to account.",
                    "timestamp": (now - timedelta(days=2)).strftime("%d %b, %I:%M %p"),
                },
            ],
        }

        self.sos_events: Dict[str, dict] = {}

    # ------------------------------------------------------------------ #
    # Places / map
    # ------------------------------------------------------------------ #
    def all_hospitals(self) -> List[dict]:
        return self.hospitals

    def all_police(self) -> List[dict]:
        return self.police_stations

    def all_pharmacies(self) -> List[dict]:
        return self.pharmacies

    def all_safe_zones(self) -> List[dict]:
        return self.safe_zones

    # ------------------------------------------------------------------ #
    # Patients / caregiver
    # ------------------------------------------------------------------ #
    def all_patients(self) -> List[dict]:
        return list(self.patients.values())

    def get_patient(self, patient_id: str) -> Optional[dict]:
        return self.patients.get(patient_id)

    def find_patient_by_device_id(self, device_id: str) -> Optional[dict]:
        for p in self.patients.values():
            if p["deviceId"] == device_id:
                return p
        return None

    def get_health(self, patient_id: str) -> Optional[dict]:
        return self.health.get(patient_id)

    def get_history(self, patient_id: str) -> List[dict]:
        return self.history.get(patient_id, [])

    def update_patient_telemetry(self, patient_id: str, battery_pct: int, lat: float, lng: float) -> None:
        patient = self.patients.get(patient_id)
        if not patient:
            return
        patient["batteryLevel"] = battery_pct
        patient["latitude"] = lat
        patient["longitude"] = lng
        patient["lastSeen"] = "just now"

    # ------------------------------------------------------------------ #
    # SOS
    # ------------------------------------------------------------------ #
    def record_sos(
        self,
        sos_id: str,
        patient_id: str,
        latitude: float,
        longitude: float,
        battery_pct: int,
        gps_valid: bool,
        severity: str,
        received_at: str,
    ) -> None:
        self.sos_events[sos_id] = {
            "id": sos_id,
            "patientId": patient_id,
            "latitude": latitude,
            "longitude": longitude,
            "batteryPct": battery_pct,
            "gpsValid": gps_valid,
            "severity": severity,
            "status": "active",
            "receivedAt": received_at,
        }

        patient = self.patients.get(patient_id)
        if patient:
            patient["sosActive"] = True
            patient["latitude"] = latitude
            patient["longitude"] = longitude
            patient["batteryLevel"] = battery_pct
            patient["lastSeen"] = "just now"

        self.history.setdefault(patient_id, []).insert(
            0,
            {
                "id": sos_id,
                "type": "sos",
                "title": "SOS button pressed",
                "description": f"Severity: {severity}. GPS {'valid' if gps_valid else 'stale/unavailable'}.",
                "timestamp": _now_iso(),
            },
        )

    def acknowledge_sos(self, sos_id: str) -> Optional[dict]:
        event = self.sos_events.get(sos_id)
        if event:
            event["status"] = "acknowledged"
        return event

    def resolve_sos(self, sos_id: str, note: Optional[str]) -> Optional[dict]:
        event = self.sos_events.get(sos_id)
        if not event:
            return None
        event["status"] = "resolved"
        event["resolutionNote"] = note
        patient = self.patients.get(event["patientId"])
        if patient:
            patient["sosActive"] = False
        return event


# Singleton shared across every router.
DATA_STORE = DataStore()
