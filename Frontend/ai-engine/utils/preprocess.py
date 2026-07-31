"""
Shared preprocessing / feature-extraction helpers.

Kept deliberately dependency-light so both the training script and the
live API import the exact same feature logic — avoids train/serve skew.
"""
from __future__ import annotations

FEATURE_COLUMNS = [
    "age",
    "sleep_hours",
    "activity_minutes",
    "bmi",
    "resting_heart_rate",
    "medication_adherence_pct",
    "health_index",
]


def clamp(value: float, low: float, high: float) -> float:
    """Clamp a numeric value into [low, high]."""
    return max(low, min(high, value))


def normalize_inputs(payload: dict) -> dict:
    """
    Defensive cleanup of raw inputs before they hit scoring logic:
    - clamps obviously out-of-range values instead of throwing,
    - fills sane defaults for optional fields.

    This does NOT validate types — that's Pydantic's job at the API
    boundary. This is a second line of defense against nonsensical
    but well-typed values (e.g. age=400, sleep_hours=-3).
    """
    cleaned = dict(payload)
    if "age" in cleaned:
        cleaned["age"] = clamp(cleaned["age"], 0, 120)
    if "sleep_hours" in cleaned:
        cleaned["sleep_hours"] = clamp(cleaned["sleep_hours"], 0, 24)
    if "activity_minutes" in cleaned:
        cleaned["activity_minutes"] = clamp(cleaned["activity_minutes"], 0, 1440)
    if "bmi" in cleaned:
        cleaned["bmi"] = clamp(cleaned["bmi"], 10, 60)
    if "resting_heart_rate" in cleaned:
        cleaned["resting_heart_rate"] = clamp(cleaned["resting_heart_rate"], 30, 220)
    if "medication_adherence_pct" in cleaned:
        cleaned["medication_adherence_pct"] = clamp(
            cleaned["medication_adherence_pct"], 0, 100
        )
    return cleaned


def to_feature_row(payload: dict) -> list[float]:
    """Order a cleaned payload dict into the fixed feature vector the model expects."""
    return [payload[col] for col in FEATURE_COLUMNS]
