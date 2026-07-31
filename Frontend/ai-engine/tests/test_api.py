from fastapi.testclient import TestClient

from api import app

client = TestClient(app)


def test_root():
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_health_index():
    resp = client.post(
        "/health-index",
        json={
            "age": 30,
            "sleep_hours": 7.5,
            "activity_minutes": 40,
            "bmi": 22.0,
            "resting_heart_rate": 68,
            "medication_adherence_pct": 95,
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert 0 <= body["health_index"] <= 100
    assert set(body["breakdown"].keys()) == {
        "sleep", "activity", "bmi", "heart_rate", "medication_adherence", "age"
    }


def test_health_index_rejects_bad_input():
    resp = client.post(
        "/health-index",
        json={
            "age": 500,  # out of allowed range
            "sleep_hours": 7.5,
            "activity_minutes": 40,
            "bmi": 22.0,
            "resting_heart_rate": 68,
            "medication_adherence_pct": 95,
        },
    )
    assert resp.status_code == 422


def test_risk_endpoint():
    resp = client.post(
        "/risk",
        json={
            "age": 60,
            "sleep_hours": 4.5,
            "activity_minutes": 10,
            "bmi": 31.2,
            "resting_heart_rate": 90,
            "medication_adherence_pct": 50,
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["risk_level"] in {"LOW", "MEDIUM", "HIGH"}
    assert 0 <= body["probability"] <= 1
    assert set(body["class_probabilities"].keys()) == {"LOW", "MEDIUM", "HIGH"}


def test_recommend_endpoint():
    resp = client.post(
        "/recommend",
        json={"health_score": 40, "age": 70, "activity_minutes": 5, "risk_level": "HIGH"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert len(body["recommendations"]) >= 1
    assert "high_risk" in body["triggered_rules"]


def test_recommend_doing_well():
    resp = client.post(
        "/recommend",
        json={"health_score": 90, "age": 25, "activity_minutes": 45},
    )
    assert resp.status_code == 200
    assert "doing_well" in resp.json()["triggered_rules"]


def test_fall_detection_positive():
    resp = client.post(
        "/fall-detection",
        json={
            "peak_acceleration_g": 3.2,
            "post_impact_stillness_sec": 3.0,
            "post_impact_accel_variance": 0.05,
            "orientation_change_deg": 60,
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["fall_detected"] is True
    assert body["confidence"] > 0


def test_fall_detection_negative_still_moving():
    resp = client.post(
        "/fall-detection",
        json={
            "peak_acceleration_g": 3.2,
            "post_impact_stillness_sec": 0.2,
            "post_impact_accel_variance": 0.9,
        },
    )
    assert resp.status_code == 200
    assert resp.json()["fall_detected"] is False


def test_emergency_classification_user_reported_wins():
    resp = client.post(
        "/emergency-classification",
        json={"trigger_source": "manual_button", "user_reported_category": "safety"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["emergency_type"] == "SAFETY"
    assert body["confidence"] == 1.0


def test_emergency_classification_fall_signal():
    resp = client.post(
        "/emergency-classification",
        json={
            "trigger_source": "fall_detection",
            "fall_detected": True,
            "fall_confidence": 0.85,
        },
    )
    assert resp.status_code == 200
    assert resp.json()["emergency_type"] == "FALL"


def test_emergency_classification_unknown_manual_no_signals():
    resp = client.post(
        "/emergency-classification",
        json={"trigger_source": "manual_button"},
    )
    assert resp.status_code == 200
    assert resp.json()["emergency_type"] == "UNKNOWN"
