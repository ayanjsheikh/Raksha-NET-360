"""
Emergency Classifier Service
==============================
Classifies an SOS event into one of: FALL, MEDICAL, SAFETY, UNKNOWN.

This needs an explicit input contract to avoid becoming an ambiguous
"lookup table with a fancy name" — the signals below are what actually
distinguish the categories. Member 1's app should populate whichever of
these it can detect; anything omitted just doesn't contribute evidence.

Recognized input signals (all optional except trigger_source):
  trigger_source: str            - "manual_button" | "fall_detection" | "voice" | "auto"
  fall_detected: bool            - result from /fall-detection, if it ran
  fall_confidence: float         - confidence from /fall-detection, if available
  heart_rate_abnormal: bool      - vitals-based signal (e.g. HR spike/drop)
  panic_keyword_detected: bool   - voice/text trigger matched a distress keyword
  location_flagged_unsafe: bool  - app-side geofencing / known-risk-area flag
  user_reported_category: str    - explicit category the user picked, if any
                                    ("fall" | "medical" | "safety")

If user_reported_category is present, it's authoritative — everything
else is signal used only when the category isn't self-reported.
"""
from __future__ import annotations

VALID_USER_CATEGORIES = {"fall": "FALL", "medical": "MEDICAL", "safety": "SAFETY"}


def classify_emergency(payload: dict) -> dict:
    """
    Returns: {"emergency_type": "FALL"|"MEDICAL"|"SAFETY"|"UNKNOWN",
              "confidence": float, "signals_used": [str, ...]}
    """
    signals_used = []

    # 1. Explicit self-report wins outright.
    user_reported = payload.get("user_reported_category")
    if user_reported in VALID_USER_CATEGORIES:
        return {
            "emergency_type": VALID_USER_CATEGORIES[user_reported],
            "confidence": 1.0,
            "signals_used": ["user_reported_category"],
        }

    scores = {"FALL": 0.0, "MEDICAL": 0.0, "SAFETY": 0.0}

    if payload.get("trigger_source") == "fall_detection":
        scores["FALL"] += 0.5
        signals_used.append("trigger_source=fall_detection")

    if payload.get("fall_detected"):
        confidence = payload.get("fall_confidence", 0.6)
        scores["FALL"] += 0.5 * confidence
        signals_used.append("fall_detected")

    if payload.get("heart_rate_abnormal"):
        scores["MEDICAL"] += 0.6
        signals_used.append("heart_rate_abnormal")

    if payload.get("panic_keyword_detected"):
        scores["SAFETY"] += 0.5
        signals_used.append("panic_keyword_detected")

    if payload.get("location_flagged_unsafe"):
        scores["SAFETY"] += 0.4
        signals_used.append("location_flagged_unsafe")

    if payload.get("trigger_source") == "manual_button" and not signals_used:
        # Manual button with no other context — can't tell category.
        return {
            "emergency_type": "UNKNOWN",
            "confidence": 0.0,
            "signals_used": ["trigger_source=manual_button"],
        }

    best_type = max(scores, key=scores.get)
    best_score = scores[best_type]

    if best_score <= 0:
        return {"emergency_type": "UNKNOWN", "confidence": 0.0, "signals_used": signals_used}

    return {
        "emergency_type": best_type,
        "confidence": round(min(best_score, 1.0), 2),
        "signals_used": signals_used,
    }
