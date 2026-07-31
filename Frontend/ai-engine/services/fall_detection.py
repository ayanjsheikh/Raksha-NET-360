"""
Fall Detection Service
========================
Threshold-based heuristic over a SUMMARIZED sensor reading (not a raw
stream). Per the open question in the plan, this assumes Member 1's app
pre-aggregates a window of accelerometer/gyroscope samples into the
summary fields below before calling this service — the AI module does
not currently consume raw continuous sensor streams.

>>> KNOWN LIMITATION <<<
Simple threshold rules are prone to false positives (dropping the phone,
sitting down hard) and false negatives (slow/assisted falls). This is
intentionally a v1 heuristic per the PRD. Recommended fast-follow: train
a classifier (e.g. on labeled public fall-detection datasets such as
SisFall / UMAFall) once labeled data is available — swap the internals
of `detect_fall` without changing its signature.
"""
from __future__ import annotations

# Tunable thresholds — pull these into config/env vars once real device
# calibration data exists; hardcoded here only as a starting point.
IMPACT_ACCEL_THRESHOLD_G = 2.5   # peak acceleration magnitude, in g
STILLNESS_WINDOW_SEC = 2.0      # minimum post-impact stillness to count
STILLNESS_ACCEL_VARIANCE_MAX = 0.15  # low variance == "not moving"


def detect_fall(payload: dict) -> dict:
    """
    payload keys expected:
      peak_acceleration_g: float       — max acceleration magnitude observed
      post_impact_stillness_sec: float — seconds of low-movement after peak
      post_impact_accel_variance: float — variance of acceleration after peak
      orientation_change_deg: float (optional) — sudden orientation shift

    Returns: {"fall_detected": bool, "confidence": float, "reason": str}
    """
    peak_accel = payload["peak_acceleration_g"]
    stillness_sec = payload["post_impact_stillness_sec"]
    stillness_variance = payload["post_impact_accel_variance"]
    orientation_change = payload.get("orientation_change_deg", 0.0)

    impact_detected = peak_accel >= IMPACT_ACCEL_THRESHOLD_G
    stillness_detected = (
        stillness_sec >= STILLNESS_WINDOW_SEC
        and stillness_variance <= STILLNESS_ACCEL_VARIANCE_MAX
    )

    fall_detected = impact_detected and stillness_detected

    # Simple confidence heuristic: how far past threshold + orientation corroboration.
    confidence = 0.0
    if fall_detected:
        accel_margin = min((peak_accel - IMPACT_ACCEL_THRESHOLD_G) / IMPACT_ACCEL_THRESHOLD_G, 1.0)
        confidence = 0.6 + 0.3 * max(accel_margin, 0) 
        if orientation_change >= 45:
            confidence = min(confidence + 0.1, 0.99)
        confidence = round(confidence, 2)

    if fall_detected:
        reason = "Impact threshold exceeded followed by sustained stillness."
    elif impact_detected and not stillness_detected:
        reason = "Impact detected but movement continued afterward — likely not a fall."
    elif stillness_detected and not impact_detected:
        reason = "Stillness detected without a preceding impact — not classified as a fall."
    else:
        reason = "No impact or stillness pattern consistent with a fall."

    return {
        "fall_detected": fall_detected,
        "confidence": confidence,
        "reason": reason,
    }
