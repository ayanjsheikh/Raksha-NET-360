"""
train_models.py
==================
Trains the RandomForestClassifier used by services/risk_score.py and
saves it to models/risk_model.pkl.

>>> IMPORTANT <<<
This trains on datasets/sample_health.csv, a small hand-authored CSV
(20 rows) used to validate the pipeline shape. The resulting model is a
STRUCTURAL PLACEHOLDER, not a clinically meaningful predictor — it will
mostly reproduce the assumptions baked into the sample data. Retrain
against real (or properly sourced synthetic) data before relying on
`/risk` predictions for anything user-facing.

Usage:
    python train_models.py
    python train_models.py --data datasets/sample_health.csv --out models/risk_model.pkl
"""
from __future__ import annotations

import argparse
import datetime as dt
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from utils.preprocess import FEATURE_COLUMNS

DEFAULT_DATA = Path(__file__).parent / "datasets" / "sample_health.csv"
DEFAULT_OUT = Path(__file__).parent / "models" / "risk_model.pkl"


def train(data_path: Path, out_path: Path) -> None:
    df = pd.read_csv(data_path)

    missing = [c for c in FEATURE_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"Dataset is missing required columns: {missing}")

    X = df[FEATURE_COLUMNS]
    y_raw = df["risk_level"]

    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(y_raw)

    # Sample dataset is tiny (~20 rows) — stratified split still gives a
    # sanity-check holdout without needing real volume.
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=5,
        random_state=42,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    train_acc = model.score(X_train, y_train)
    test_acc = model.score(X_test, y_test)
    print(f"Train accuracy: {train_acc:.2f}")
    print(f"Holdout accuracy: {test_acc:.2f}  (holdout is only 5 rows — indicative, not statistically robust)")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    bundle = {
        "model": model,
        "label_encoder": label_encoder,
        "feature_columns": FEATURE_COLUMNS,
        "trained_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "source_data": str(data_path),
        "n_training_rows": len(df),
        "version": "placeholder-v0.1-sample-data",
    }
    joblib.dump(bundle, out_path)
    print(f"Saved model bundle to {out_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train the risk prediction model.")
    parser.add_argument("--data", type=Path, default=DEFAULT_DATA)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args()
    train(args.data, args.out)
