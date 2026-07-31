"""
main.py
------------------------------------------------------------------------------
RakshaNet 360 — Member 4 — FastAPI application entry point

Run from the `member4/` project root so the `backend` and `hardware`
packages both resolve correctly:

    cd member4
    pip install -r backend/requirements.txt
    uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

Then the frontend's VITE_API_BASE_URL=http://localhost:8000/api and
VITE_WS_BASE_URL=ws://localhost:8000/ws will match this app's routes.
------------------------------------------------------------------------------
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routers import caregiver, hospitals, location, websocket
from hardware.hardware_api import router as hardware_router

app = FastAPI(
    title="RakshaNet 360 — Maps, Dashboard & Hardware API",
    description="AI Powered Offline Health & Emergency Response Network — Member 4 backend module.",
    version="1.0.0",
)

# CORS — permissive for hackathon demo purposes. Restrict allow_origins to
# your deployed frontend URL in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(location.router, prefix="/api/location", tags=["location"])
app.include_router(hospitals.router, prefix="/api", tags=["maps"])
app.include_router(caregiver.router, prefix="/api", tags=["caregiver"])
app.include_router(hardware_router, prefix="/api/hardware", tags=["hardware"])
app.include_router(websocket.router, prefix="/ws", tags=["realtime"])


@app.get("/")
async def root():
    return {
        "service": "RakshaNet 360 — Member 4",
        "status": "online",
        "docs": "/docs",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
