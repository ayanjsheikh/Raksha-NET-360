"""
Health Index Service
=====================
Computes a 0-100 health score from basic vitals/lifestyle inputs.

This is an explicit, weighted heuristic (NOT a trained model) — per the
PRD, the health index is meant to be transparent and explainable, since
it feeds directly into the risk model and recommendations. If this needs
to become data-driven later, keep the same function signature and swap
the internals.
"""
from __future__ import annotations

from utils.preprocess import clamp, normalize_inputs

# Sub-score weights must sum to 1.0 — adjust here only, keep it in one place.
WEIGHTS = {
    "sleep": 0.20,
    "activity": 0.20,
    "bmi": 0.20,
    "heart_rate": 0.20,
    "medication_adherence": 0.15,
    "age": 0.05,
}


def _sleep_subscore(sleep_hours: float) -> float:
    """Peak score at 7-9 hours; penalize both under- and over-sleeping."""
    if 7 <= sleep_hours <= 9:
        return 100.0
    if sleep_hours < 7:
        return clamp(100 - (7 - sleep_hours) * 20, 0, 100)
    return clamp(100 - (sleep_hours - 9) * 15, 0, 100)


def _activity_subscore(activity_minutes: float) -> float:
    """WHO guideline ballpark: ~30 min/day (≈210/week) is 'full score' territory."""
    target = 30.0
    return clamp((activity_minutes / target) * 100, 0, 100)


def _bmi_subscore(bmi: float) -> float:
    """Healthy range 18.5-24.9 scores highest; score falls off outside it."""
    if 18.5 <= bmi <= 24.9:
        return 100.0
    if bmi < 18.5:
        return clamp(100 - (18.5 - bmi) * 10, 0, 100)
    return clamp(100 - (bmi - 24.9) * 6, 0, 100)


def _heart_rate_subscore(resting_heart_rate: float) -> float:
    """Healthy resting HR ballpark 60-80 bpm for adults."""
    if 60 <= resting_heart_rate <= 80:
        return 100.0
    if resting_heart_rate < 60:
        return clamp(100 - (60 - resting_heart_rate) * 3, 0, 100)
    return clamp(100 - (resting_heart_rate - 80) * 2, 0, 100)


def _medication_subscore(adherence_pct: float) -> float:
    return clamp(adherence_pct, 0, 100)


def _age_subscore(age: float) -> float:
    """
    Mild age adjustment — this is NOT a judgment of health by age, just a
    small weighting acknowledging baseline risk shifts. Kept low-weight (5%)
    on purpose; flag for clinical review before increasing.
    """
    if age <= 40:
        return 100.0
    if age <= 60:
        return 90.0
    if age <= 75:
        return 75.0
    return 60.0


def calculate_health_index(payload: dict) -> dict:
    """
    payload keys expected: age, sleep_hours, activity_minutes, bmi,
    resting_heart_rate, medication_adherence_pct

    Returns: {"health_index": float 0-100, "breakdown": {sub-scores}}
    """
    cleaned = normalize_inputs(payload)

    breakdown = {
        "sleep": _sleep_subscore(cleaned["sleep_hours"]),
        "activity": _activity_subscore(cleaned["activity_minutes"]),
        "bmi": _bmi_subscore(cleaned["bmi"]),
        "heart_rate": _heart_rate_subscore(cleaned["resting_heart_rate"]),
        "medication_adherence": _medication_subscore(
            cleaned["medication_adherence_pct"]
        ),
        "age": _age_subscore(cleaned["age"]),
    }

    weighted_total = sum(breakdown[key] * WEIGHTS[key] for key in WEIGHTS)

    return {
        "health_index": round(clamp(weighted_total, 0, 100), 1),
        "breakdown": {k: round(v, 1) for k, v in breakdown.items()},
    }
