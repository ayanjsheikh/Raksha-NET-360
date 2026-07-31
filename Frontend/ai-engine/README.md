# AI & Health Intelligence Module

FastAPI service implementing the five endpoints from the PRD.

## Setup

```bash
pip install -r requirements.txt
python train_models.py        # generates models/risk_model.pkl
uvicorn api:app --reload      # http://127.0.0.1:8000/docs for Swagger UI
```

## Run tests

```bash
pytest tests/ -v
```

(Service-level logic was smoke-tested directly against `services/*.py` in
the sandbox this was built in, since that environment couldn't install
`fastapi`/`pydantic`/`pytest` — no network access. The `pytest` suite in
`tests/test_api.py` exercises the actual HTTP layer via `TestClient` and
should be run once you have those installed, before treating this as
verified end-to-end.)

## Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/health-index` | POST | 0-100 health score from age/sleep/activity/BMI/HR/adherence |
| `/risk` | POST | LOW/MEDIUM/HIGH risk + probability from the trained model |
| `/recommend` | POST | Rule-based list of recommendations |
| `/fall-detection` | POST | Fall yes/no from a summarized sensor window |
| `/emergency-classification` | POST | FALL / MEDICAL / SAFETY / UNKNOWN from SOS signals |

Full request/response schemas are in `api.py` (Pydantic models) and
render interactively at `/docs` once the server is running.

## Open items for Member 1 / Member 3 review

1. **`/fall-detection` input contract**: this expects a *pre-aggregated
   summary* of a sensor window (`peak_acceleration_g`,
   `post_impact_stillness_sec`, `post_impact_accel_variance`,
   optional `orientation_change_deg`) — not a raw stream. If the mobile
   app can't compute these client-side, we need to either move that
   aggregation into this service (and accept raw samples) or have
   Member 3's backend do it before calling us.

2. **`/emergency-classification` input contract**: see the docstring in
   `services/emergency_classifier.py` for the full signal list
   (`trigger_source`, `fall_detected`, `heart_rate_abnormal`,
   `panic_keyword_detected`, `location_flagged_unsafe`,
   `user_reported_category`). Please confirm which of these the app can
   actually populate — anything not sent simply contributes no evidence
   rather than erroring.

3. **`models/risk_model.pkl` is a placeholder.** It's trained on the
   20-row hand-authored `datasets/sample_health.csv`, so it proves the
   pipeline works but isn't a clinically meaningful predictor yet.
   Retrain via `train_models.py --data <real_data.csv>` once real (or
   properly sourced synthetic) data is available — the model bundle
   records `source_data`, `n_training_rows`, and `trained_at` so it's
   obvious later which data trained which artifact.

4. **No persistence in this module** — per the plan's assumption, all
   five endpoints are stateless; Member 3's backend owns storing
   requests/results.

5. **Fall detection is threshold-based (v1)**, per the PRD. Flagged in
   `services/fall_detection.py` as a likely source of false
   positives/negatives; recommended fast-follow is a trained classifier
   once labeled fall data is available.
