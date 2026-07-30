from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.user_routes import router as user_router
from routes.health_routes import router as health_router
from routes.sos_routes import router as sos_router
from routes.contact_routes import router as contact_router
from routes.hospital_routes import router as hospital_router
from routes.emergency_routes import router as emergency_router
from routes.location_routes import router as location_router
from routes.sync_routes import router as sync_router
from routes.auth_routes import router as auth_router

app = FastAPI(
    title="RakshaNet API",
    version="1.0.0"
)

# Allow React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(user_router)
app.include_router(health_router)
app.include_router(sos_router)
app.include_router(contact_router)
app.include_router(hospital_router)
app.include_router(emergency_router)
app.include_router(location_router)
app.include_router(sync_router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {
        "message": "RakshaNet Backend Running 🚑",
        "status": "success"
    }