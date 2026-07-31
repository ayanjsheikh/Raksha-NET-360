"""
Recommendation Service
========================
Rule-based engine returning plain-language recommendations from health
score, age, activity level, and (optionally) risk level.

Deliberately simple/transparent per PRD — recommendations should be
explainable, not a black box. Extend RULES rather than hardcoding new
if/else branches, so Member 3 can audit what triggers what.
"""
from __future__ import annotations

RULES = [
    {
        "id": "low_activity",
        "condition": lambda ctx: ctx["activity_minutes"] < 20,
        "message": "Try to add at least 20-30 minutes of moderate activity most days.",
    },
    {
        "id": "poor_sleep",
        "condition": lambda ctx: ctx.get("sleep_hours") is not None
        and (ctx["sleep_hours"] < 6 or ctx["sleep_hours"] > 9.5),
        "message": "Aim for 7-9 hours of sleep — your recent average is outside that range.",
    },
    {
        "id": "low_health_index",
        "condition": lambda ctx: ctx["health_score"] < 50,
        "message": "Your overall health score is low — consider checking in with a healthcare provider.",
    },
    {
        "id": "medium_health_index",
        "condition": lambda ctx: 50 <= ctx["health_score"] < 75,
        "message": "Your health score has room to improve — small, consistent changes to sleep and activity can help.",
    },
    {
        "id": "high_risk",
        "condition": lambda ctx: ctx.get("risk_level") == "HIGH",
        "message": "Your risk level is elevated — please consult a healthcare professional soon.",
    },
    {
        "id": "older_adult_checkin",
        "condition": lambda ctx: ctx["age"] >= 65,
        "message": "Regular check-ins with a doctor are especially valuable at this age — keep up routine visits.",
    },
    {
        "id": "doing_well",
        "condition": lambda ctx: ctx["health_score"] >= 75
        and ctx.get("risk_level") in (None, "LOW"),
        "message": "You're doing well — keep maintaining your current habits.",
    },
]


def get_recommendations(payload: dict) -> dict:
    """
    payload keys expected: health_score, age, activity_minutes
    optional: sleep_hours, risk_level

    Returns: {"recommendations": [str, ...], "triggered_rules": [rule_id, ...]}
    """
    triggered = [rule for rule in RULES if rule["condition"](payload)]

    # Always return at least one recommendation.
    if not triggered:
        triggered = [
            {
                "id": "general_wellness",
                "message": "Keep tracking your health metrics regularly for the best insights.",
            }
        ]

    return {
        "recommendations": [rule["message"] for rule in triggered],
        "triggered_rules": [rule["id"] for rule in triggered],
    }
