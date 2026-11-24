from fastapi.testclient import TestClient

from main import app

SAMPLE = {
    "person_age": 28,
    "person_income": 60000,
    "person_home_ownership": "RENT",
    "person_emp_length": 4,
    "loan_intent": "EDUCATION",
    "loan_grade": "B",
    "loan_amnt": 10000,
    "loan_int_rate": 11.5,
    "loan_percent_income": 0.17,
    "cb_person_default_on_file": "N",
    "cb_person_cred_hist_length": 5,
}


def test_health():
    with TestClient(app) as client:
        res = client.get("/health")
        assert res.status_code == 200
        assert res.json() == {"status": "ok", "model_loaded": True}


def test_predict_returns_probability():
    with TestClient(app) as client:
        res = client.post("/predict", json=SAMPLE)
        assert res.status_code == 200
        body = res.json()
        assert 0.0 <= body["default_probability"] <= 1.0
        assert body["default_prediction"] in (0, 1)
        assert body["Result"] in ("High Risk", "Low Risk")


def test_predict_rejects_invalid_category():
    with TestClient(app) as client:
        res = client.post("/predict", json={**SAMPLE, "loan_grade": "Z"})
        assert res.status_code == 422
