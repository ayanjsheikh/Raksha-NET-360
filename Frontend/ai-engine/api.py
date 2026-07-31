"""
AI & Health Intelligence Module — API
========================================
FastAPI app exposing the five endpoints from the PRD. Request/response
models are the concrete contract for Member 1 (mobile) and Member 3
(backend) to review — please check field names/types against what your
side actually sends/expects before we wire this up end-to-end.

Run locally:
    uvicorn api:app --reload
Docs:
    http://127.0.0.1:8000/docs
"""
from __future__ import annotations

from enum import Enum
from typing import Optional

try:
    import fastapi
except ImportError:  # pragma: no cover - fallback for environments without FastAPI
    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str | None = None):
            self.status_code = status_code
            self.detail = detail
            super().__init__(detail)

    class FastAPI:
        def __init__(self, *args, **kwargs):
            self.routes = []

        def post(self, *args, **kwargs):
            def decorator(func):
                self.routes.append({"method": "POST", "path": args[0] if args else None, "func": func})
                return func
            return decorator

        def get(self, *args, **kwargs):
            def decorator(func):
                self.routes.append({"method": "GET", "path": args[0] if args else None, "func": func})
                return func
            return decorator

try:
    from pydantic import BaseModel, Field
except ImportError:  # pragma: no cover - fallback for environments without Pydantic
    def Field(default=..., **kwargs):
        return default

    class BaseModel:
        def __init__(self, **data):
            annotations = getattr(self.__class__, "__annotations__", {})
            for name in annotations:
                if name in data:
                    setattr(self, name, data[name])
                else:
                    default = getattr(self.__class__, name, None)
                    if default is not None and default is not Ellipsis:
                        setattr(self, name, default)
            for name, value in data.items():
                setattr(self, name, value)

        def model_dump(self, exclude_none: bool = False):
            data = {}
            for name in getattr(self.__class__, "__annotations__", {}):
                value = getattr(self, name, None)
                if exclude_none and value is None:
                    continue
                data[name] = value
            return data

from services import (
    emergency_classifier,
    fall_detection,
    health_index,
    recommendation,
    risk_score,
)

app = fastapi.FastAPI(
    title="AI & Health Intelligence Module",
    version="0.1.0",
    description="Health scoring, risk prediction, recommendations, fall detection, and emergency classification.",
)


# ---------------------------------------------------------------------------
# Shared enums
# ---------------------------------------------------------------------------
class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class EmergencyType(str, Enum):
    FALL = "FALL"
    MEDICAL = "MEDICAL"
    SAFETY = "SAFETY"
    UNKNOWN = "UNKNOWN"


class TriggerSource(str, Enum):
    MANUAL_BUTTON = "manual_button"
    FALL_DETECTION = "fall_detection"
    VOICE = "voice"
    AUTO = "auto"


# ---------------------------------------------------------------------------
# /health-index
# ---------------------------------------------------------------------------
class HealthIndexRequest(BaseModel):
    age: float = Field(..., ge=0, le=120)
    sleep_hours: float = Field(..., ge=0, le=24)
    activity_minutes: float = Field(..., ge=0, le=1440, description="Minutes of moderate+ activity, most recent day")
    bmi: float = Field(..., ge=10, le=60)
    resting_heart_rate: float = Field(..., ge=30, le=220)
    medication_adherence_pct: float = Field(..., ge=0, le=100)


class HealthIndexResponse(BaseModel):
    health_index: float
    breakdown: dict[str, float]


@app.post("/health-index", response_model=HealthIndexResponse)
def health_index_endpoint(payload: HealthIndexRequest):
    result = health_index.calculate_health_index(payload.model_dump())
    return result


# ---------------------------------------------------------------------------
# /risk
# ---------------------------------------------------------------------------
class RiskRequest(BaseModel):
    age: float = Field(..., ge=0, le=120)
    sleep_hours: float = Field(..., ge=0, le=24)
    activity_minutes: float = Field(..., ge=0, le=1440)
    bmi: float = Field(..., ge=10, le=60)
    resting_heart_rate: float = Field(..., ge=30, le=220)
    medication_adherence_pct: float = Field(..., ge=0, le=100)
    health_index: Optional[float] = Field(
        None, ge=0, le=100, description="If omitted, computed server-side from the other fields."
    )


class RiskResponse(BaseModel):
    risk_level: RiskLevel
    probability: float
    class_probabilities: dict[str, float]
    model_version: str


@app.post("/risk", response_model=RiskResponse)
def risk_endpoint(payload: RiskRequest):
    data = payload.model_dump()
    if data.get("health_index") is None:
        data["health_index"] = health_index.calculate_health_index(data)["health_index"]
    try:
        return risk_score.predict_risk(data)
    except FileNotFoundError as exc:
        raise fastapi.HTTPException(status_code=503, detail=str(exc))


# ---------------------------------------------------------------------------
# /recommend
# ---------------------------------------------------------------------------
class RecommendRequest(BaseModel):
    health_score: float = Field(..., ge=0, le=100)
    age: float = Field(..., ge=0, le=120)
    activity_minutes: float = Field(..., ge=0, le=1440)
    sleep_hours: Optional[float] = Field(None, ge=0, le=24)
    risk_level: Optional[RiskLevel] = None


class RecommendResponse(BaseModel):
    recommendations: list[str]
    triggered_rules: list[str]


@app.post("/recommend", response_model=RecommendResponse)
def recommend_endpoint(payload: RecommendRequest):
    data = payload.model_dump()
    if data.get("risk_level") is not None:
        data["risk_level"] = data["risk_level"].value if hasattr(data["risk_level"], "value") else data["risk_level"]
    return recommendation.get_recommendations(data)


# ---------------------------------------------------------------------------
# /fall-detection
# ---------------------------------------------------------------------------
class FallDetectionRequest(BaseModel):
    peak_acceleration_g: float = Field(..., description="Peak acceleration magnitude observed in the window, in g")
    post_impact_stillness_sec: float = Field(..., ge=0)
    post_impact_accel_variance: float = Field(..., ge=0)
    orientation_change_deg: Optional[float] = Field(None, ge=0, le=180)


class FallDetectionResponse(BaseModel):
    fall_detected: bool
    confidence: float
    reason: str


@app.post("/fall-detection", response_model=FallDetectionResponse)
def fall_detection_endpoint(payload: FallDetectionRequest):
    return fall_detection.detect_fall(payload.model_dump(exclude_none=True))


# ---------------------------------------------------------------------------
# /emergency-classification
# ---------------------------------------------------------------------------
class EmergencyClassificationRequest(BaseModel):
    trigger_source: TriggerSource
    fall_detected: Optional[bool] = None
    fall_confidence: Optional[float] = Field(None, ge=0, le=1)
    heart_rate_abnormal: Optional[bool] = None
    panic_keyword_detected: Optional[bool] = None
    location_flagged_unsafe: Optional[bool] = None
    user_reported_category: Optional[str] = Field(
        None, description="'fall' | 'medical' | 'safety' — authoritative if present"
    )


class EmergencyClassificationResponse(BaseModel):
    emergency_type: EmergencyType
    confidence: float
    signals_used: list[str]


@app.post("/emergency-classification", response_model=EmergencyClassificationResponse)
def emergency_classification_endpoint(payload: EmergencyClassificationRequest):
    data = payload.model_dump(exclude_none=True)
    data["trigger_source"] = payload.trigger_source.value
    return emergency_classifier.classify_emergency(data)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return {"status": "ok", "service": "ai-health-intelligence"}
