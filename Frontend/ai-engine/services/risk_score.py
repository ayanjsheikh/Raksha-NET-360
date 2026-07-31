"""
Risk Score Service
====================
Loads the trained RandomForestClassifier (models/risk_model.pkl) and
predicts a risk label (LOW / MEDIUM / HIGH) + probability.

>>> IMPORTANT CAVEAT <<<
risk_model.pkl is trained on a small, hand-authored sample dataset
(datasets/sample_health.csv). It is a STRUCTURAL PLACEHOLDER — it proves
the pipeline works end-to-end, but its predictions are NOT clinically
validated. Do not treat outputs as medically meaningful until the model
is retrained on real or properly-sourced synthetic data. See
train_models.py for the retraining entrypoint.
"""
from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd

from utils.preprocess import FEATURE_COLUMNS, normalize_inputs

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "risk_model.pkl"

_model = None
_label_encoder = None


def _load_model():
    global _model, _label_encoder
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Risk model not found at {MODEL_PATH}. Run `python train_models.py` first."
            )
        bundle = joblib.load(MODEL_PATH)
        _model = bundle["model"]
        _label_encoder = bundle["label_encoder"]
    return _model, _label_encoder


def predict_risk(payload: dict) -> dict:
    """
    payload keys expected: age, sleep_hours, activity_minutes, bmi,
    resting_heart_rate, medication_adherence_pct, health_index

    Returns: {"risk_level": "LOW"|"MEDIUM"|"HIGH", "probability": float,
              "class_probabilities": {label: prob}, "model_version": str}
    """
    model, label_encoder = _load_model()
    cleaned = normalize_inputs(payload)
    feature_row = pd.DataFrame([{col: cleaned[col] for col in FEATURE_COLUMNS}])

    probabilities = model.predict_proba(feature_row)[0]
    predicted_idx = probabilities.argmax()
    predicted_label = label_encoder.inverse_transform([predicted_idx])[0]

    class_probabilities = {
        label: round(float(prob), 4)
        for label, prob in zip(label_encoder.classes_, probabilities)
    }

    return {
        "risk_level": predicted_label,
        "probability": round(float(probabilities[predicted_idx]), 4),
        "class_probabilities": class_probabilities,
        "model_version": "placeholder-v0.1-sample-data",
    }
