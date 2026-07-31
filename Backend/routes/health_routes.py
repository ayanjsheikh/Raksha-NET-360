from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from models.health import HealthRecord
from schemas.health_schema import HealthCreate
from services.risk_service import calculate_risk
from services.recommendation_service import get_recommendations

from services.health_index_service import calculate_health_index, get_ai_health_analysis, get_health_status

router = APIRouter(
    prefix="/api/health",
    tags=["Health"]
)


# ----------------------------
# Add Health Data & AI Index
# ----------------------------
@router.post("/add")
def add_health(data: HealthCreate, db: Session = Depends(get_db)):
    calculated_index = calculate_health_index(data)

    health = HealthRecord(
        user_id=data.user_id,
        heart_rate=data.heart_rate,
        blood_pressure=data.blood_pressure,
        spo2=data.spo2,
        temperature=data.temperature,
        sugar_level=data.sugar_level,
        bmi=data.bmi,
        health_index=calculated_index
    )

    db.add(health)
    db.commit()
    db.refresh(health)

    risk = calculate_risk(data)
    ai_analysis = get_ai_health_analysis(health)

    return {
        "message": "Health data added successfully",
        "health_id": health.id,
        "health_index": calculated_index,
        "risk": risk,
        "ai_analysis": ai_analysis
    }


# ----------------------------
# Get ALL Health Records
# ----------------------------
@router.get("/")
def get_all_health(db: Session = Depends(get_db)):
    return db.query(HealthRecord).all()


# ----------------------------
# Get Latest Health Record of One User
# ----------------------------
@router.get("/{user_id}")
def get_health_by_user(user_id: int, db: Session = Depends(get_db)):
    health = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.id.desc())
        .first()
    )

    if not health:
        return {
            "message": "No health record found"
        }

    ai_analysis = get_ai_health_analysis(health)
    return {
        "id": health.id,
        "user_id": health.user_id,
        "heart_rate": health.heart_rate,
        "blood_pressure": health.blood_pressure,
        "spo2": health.spo2,
        "temperature": health.temperature,
        "sugar_level": health.sugar_level,
        "bmi": health.bmi,
        "health_index": health.health_index or ai_analysis["health_index"],
        "ai_analysis": ai_analysis
    }


# ----------------------------
# Get AI Analysis & Index
# ----------------------------
@router.get("/ai-analysis/{user_id}")
def get_ai_analysis(user_id: int, db: Session = Depends(get_db)):
    health = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.id.desc())
        .first()
    )

    if not health:
        # Default baseline assessment
        dummy_health = type('Health', (), {
            'heart_rate': 72, 'blood_pressure': '120/80', 'spo2': 98,
            'temperature': 36.8, 'sugar_level': 95, 'bmi': 22.4
        })()
        return get_ai_health_analysis(dummy_health)

    return get_ai_health_analysis(health)


# ----------------------------
# PUT Method: Directly Update Health Index
# ----------------------------
@router.put("/update-index/{user_id}")
@router.put("/{user_id}")
def update_health_index(user_id: int, payload: dict, db: Session = Depends(get_db)):
    health = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.id.desc())
        .first()
    )

    new_index = payload.get("health_index", 90)

    if not health:
        health = HealthRecord(
            user_id=user_id,
            heart_rate=payload.get("heart_rate", 75),
            blood_pressure=payload.get("blood_pressure", "120/80"),
            spo2=payload.get("spo2", 98),
            temperature=payload.get("temperature", 36.8),
            sugar_level=payload.get("sugar_level", 100),
            bmi=payload.get("bmi", 22.0),
            health_index=new_index
        )
        db.add(health)
    else:
        health.health_index = new_index
        if "heart_rate" in payload: health.heart_rate = payload["heart_rate"]
        if "blood_pressure" in payload: health.blood_pressure = payload["blood_pressure"]
        if "spo2" in payload: health.spo2 = payload["spo2"]

    db.commit()
    db.refresh(health)

    ai_analysis = get_ai_health_analysis(health)
    ai_analysis["health_index"] = new_index

    return {
        "message": "Health Index updated successfully via PUT",
        "user_id": user_id,
        "health_index": new_index,
        "ai_analysis": ai_analysis
    }


# ----------------------------
# Get Health Recommendations
# ----------------------------
@router.get("/recommendation/{user_id}")
def recommendation(user_id: int, db: Session = Depends(get_db)):
    health = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.id.desc())
        .first()
    )

    if not health:
        return {
            "message": "No health record found"
        }

    recommendations = get_recommendations(health)
    ai_analysis = get_ai_health_analysis(health)

    return {
        "user_id": user_id,
        "health_index": health.health_index or ai_analysis["health_index"],
        "recommendations": recommendations
    }
