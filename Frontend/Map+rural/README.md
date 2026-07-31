# RakshaNet 360 — Member 4: Maps, Dashboard & Hardware

**AI Powered Offline Health & Emergency Response Network**

This module owns three of the five pillars of RakshaNet 360: the **Emergency
Map**, the **Caregiver Dashboard**, and the **ESP32 SOS hardware device** —
plus the FastAPI backend and integration glue that connects all of it
together in real time.

---

## 1. Architecture Overview

```
┌────────────────┐     HTTP POST /api/hardware/sos     ┌───────────────────────┐
│  ESP32 SOS      │ ───────────────────────────────────▶│                        │
│  Device         │                                      │      FastAPI            │
│  (Phase 4)      │◀── (retries w/ backoff, SMS fallback)│      Backend            │
└────────────────┘                                      │      (backend/app)      │
                                                          │                        │
┌────────────────┐    GET /api/nearby-*, /api/route      │  ┌──────────────────┐  │
│  Emergency Map  │ ───────────────────────────────────▶ │  │  In-memory        │  │
│  (Phase 1 & 2)  │ ◀───────────────────────────────────  │  │  DataStore         │  │
│  React/Leaflet  │                                       │  │  (repository       │  │
└────────────────┘                                       │  │   pattern)         │  │
                                                          │  └──────────────────┘  │
┌────────────────┐   GET /api/caregiver/*, /api/patient/* │                        │
│  Caregiver      │ ───────────────────────────────────▶ │  ┌──────────────────┐  │
│  Dashboard      │ ◀── WebSocket /ws/caregiver (real-time)│  │ WebSocket Manager  │  │
│  (Phase 3)      │                                       │  └──────────────────┘  │
└────────────────┘                                       └───────────────────────┘
```

**Final Emergency Flow** (implemented end-to-end in this module):

```
User presses SOS -> ESP32 reads GPS -> HTTP POST /api/hardware/sos
  -> backend classifies severity -> DataStore records event
  -> WebSocket broadcasts "sos" -> Caregiver Dashboard shows alert + toast
  -> caregiver opens Emergency Map (destination pre-filled)
  -> nearest hospital displayed & route drawn
```

---

## 2. Project Structure

```
member4/
├── maps/                     Phase 1 & 2 — Emergency Map + Nearby Services
│   ├── EmergencyMap.tsx
│   ├── HospitalLocator.tsx
│   ├── SafeZones.tsx
│   ├── RouteNavigation.tsx
│   ├── MapService.ts
│   └── LocationService.ts
├── caregiver/                Phase 3 — Caregiver Dashboard
│   ├── Dashboard.tsx
│   ├── PatientCard.tsx
│   ├── AlertCard.tsx
│   ├── Timeline.tsx
│   └── HealthOverview.tsx
├── hardware/                 Phase 4 — ESP32 SOS Device
│   ├── esp32/sos_device/sos_device.ino
│   ├── gps/gps_module.h
│   ├── gsm/gsm_module.h
│   ├── hardware_api.py       (FastAPI ingestion router)
│   └── README.md             (wiring diagram + BOM)
├── integration/               Phase 5 — Frontend integration glue
│   ├── socket.ts
│   ├── api.ts
│   └── notification.ts
├── backend/                   FastAPI application
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── websocket_manager.py
│       ├── routers/ (location, hospitals, caregiver, websocket)
│       ├── models/schemas.py
│       └── data/store.py
├── src/                       Standalone dev shell (App.tsx, main.tsx, index.css)
├── package.json / vite.config.ts / tailwind.config.js / tsconfig.json
├── .env.example
└── README.md                  (this file)
```

---

## 3. Setup Guide

### Frontend

```bash
cd member4
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`. The dev shell (`src/App.tsx`) gives you two
routes to preview the module standalone: `/` (Emergency Map) and
`/caregiver` (Caregiver Dashboard).

> **Integrating into the main team app:** don't mount `src/App.tsx` — instead
> import `maps/EmergencyMap.tsx` and `caregiver/Dashboard.tsx` directly into
> your existing React Router tree, and import `leaflet/dist/leaflet.css` +
> this module's marker styles (see `src/index.css`) once at your app root.

### Backend

```bash
cd member4
python3 -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Interactive API docs: `http://localhost:8000/docs`

### Hardware (ESP32)

See `hardware/README.md` for the full wiring diagram, bill of materials, and
flashing instructions.

---

## 4. API Documentation

| Method | Path                              | Description                                  |
|--------|------------------------------------|-----------------------------------------------|
| GET    | `/api/location`                    | Coarse/fallback location lookup               |
| GET    | `/api/nearby-hospitals`            | Hospitals within `radius_km` of `lat,lng`      |
| GET    | `/api/nearby-police`               | Police stations within `radius_km`             |
| GET    | `/api/nearby-pharmacy`             | Pharmacies within `radius_km`                  |
| GET    | `/api/safe-zones`                  | Safe zones within `radius_km`                  |
| GET    | `/api/route`                       | Straight-line distance/ETA estimate            |
| GET    | `/api/caregiver/patients`          | List all patients for a caregiver              |
| GET    | `/api/patient/{id}`                | Single patient summary                         |
| GET    | `/api/patient/{id}/location`       | Patient's last known location                  |
| GET    | `/api/patient/{id}/health`         | Vitals, trends, medication adherence           |
| GET    | `/api/patient/{id}/history`        | Timeline of SOS/health/system events           |
| POST   | `/api/sos/{sos_id}/acknowledge`    | Caregiver acknowledges an active SOS           |
| POST   | `/api/sos/{sos_id}/resolve`        | Caregiver marks an SOS resolved                |
| POST   | `/api/hardware/sos`                | ESP32 emergency packet ingestion               |
| POST   | `/api/hardware/heartbeat`          | Optional periodic device check-in              |
| WS     | `/ws/caregiver`                    | Real-time `sos` / `location` / `health` events |

All query/response shapes are defined in `backend/app/models/schemas.py` and
mirrored on the frontend in `maps/MapService.ts` / `caregiver/Dashboard.tsx`.

---

## 5. Component Documentation

- **`LocationService.ts`** — browser Geolocation wrapper: permission
  handling, one-shot + continuous tracking, haversine distance, ETA estimate.
- **`MapService.ts`** — typed REST client for all map endpoints; enriches
  results with distance/ETA and caches the last successful response in
  `localStorage` so the map still shows nearby services offline.
- **`EmergencyMap.tsx`** — the main map screen: search bar, filter chips,
  floating action buttons, animated bottom sheet, live user marker, and
  route/safe-zone layers.
- **`HospitalLocator.tsx`** — reusable top-5 nearest-services card list
  (name, distance, ETA, open/closed, Navigate/Call buttons).
- **`SafeZones.tsx`** / **`RouteNavigation.tsx`** — map overlay layers for
  safe zones (circles) and routes (OSRM polyline with straight-line fallback).
- **`Dashboard.tsx`** — caregiver screen composing the patient list, health
  overview, alerts, and timeline; owns the WebSocket subscription and shared
  domain types (`Patient`, `PatientHealthSummary`, `EmergencyAlert`,
  `TimelineEvent`).
- **`PatientCard.tsx` / `AlertCard.tsx` / `Timeline.tsx` / `HealthOverview.tsx`**
  — presentational components consumed by `Dashboard.tsx`.
- **`socket.ts` / `api.ts` / `notification.ts`** — integration layer: an
  auto-reconnecting WebSocket client, a REST client for non-map endpoints,
  and a dual-channel (in-app + native browser) notification service.
- **`sos_device.ino`** — ESP32 firmware: button state machine, GPS read,
  HTTP POST with retry/backoff, LED/buzzer feedback, battery sensing, and an
  optional SIM800L SMS fallback.
- **`hardware_api.py`** — backend endpoint that receives the ESP32's
  emergency packet, classifies severity, stores the event, and broadcasts it
  to every connected Caregiver Dashboard over WebSocket.

---

## 6. Testing Guide

1. **Backend only:** `uvicorn backend.app.main:app --reload`, then open
   `/docs` and try `GET /api/nearby-hospitals?lat=23.2469&lng=77.4131` — you
   should see the seeded Bhopal hospitals sorted by distance.
2. **Frontend + backend:** run both dev servers, open `http://localhost:5173`,
   allow location permission — the map should recenter on you and the bottom
   sheet should populate with the nearest seeded hospitals/police/pharmacies.
3. **Simulate an SOS without hardware:** with the backend running, POST to
   `/api/hardware/sos` from `/docs` or `curl`:
   ```bash
   curl -X POST http://localhost:8000/api/hardware/sos \
     -H "Content-Type: application/json" \
     -d '{"device_id":"RN360-ESP32-001","latitude":23.2469,"longitude":77.4131,"gps_valid":true,"battery_pct":64}'
   ```
   The Caregiver Dashboard (open in another tab) should show a red SOS toast
   and a native browser notification within a second.
4. **Real hardware:** follow `hardware/README.md`'s end-to-end test section.

---

## 7. Notes on the Color Palette & Design System

| Token           | Hex        | Usage                          |
|------------------|-----------|----------------------------------|
| Primary          | `#1565C0` | Navigation, primary actions       |
| Emergency Green  | `#00B894` | Success, "open now", safe zones   |
| Danger           | `#E53935` | SOS, critical alerts, closed      |
| Warning          | `#F9A825` | Medium-severity alerts            |
| Accent           | `#FF7043` | Pharmacy markers, highlights      |
| Background       | `#F8FAFC` | App background                    |
| Cards            | `#FFFFFF` | Card surfaces                     |

Tailwind tokens for these are pre-configured in `tailwind.config.js`
(`primary`, `emergency-green`, `danger`, `warning`, `accent`, `bg`).
