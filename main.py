"""Loan eligibility / credit-risk prediction API.

Loads a pre-trained sklearn Pipeline (XGBoost classifier) plus a tuned decision
threshold at startup and exposes a /predict endpoint for the React frontend.
"""

import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / os.getenv("MODEL_PATH", "credit_risk_model.pkl")
THRESHOLD_PATH = BASE_DIR / os.getenv("THRESHOLD_PATH", "best_threshold.pkl")
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "https://loan-eligibility-ui-3ust.onrender.com,http://localhost:5173",
    ).split(",")
    if origin.strip()
]

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO").upper())
logger = logging.getLogger("loan-api")

ml_model: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    ml_model["model"] = joblib.load(MODEL_PATH)  # Load the model at startup
    ml_model["threshold"] = float(joblib.load(THRESHOLD_PATH))  # Load the threshold at startup
    logger.info("Model loaded (threshold=%.4f)", ml_model["threshold"])

    yield  # The app runs here

    ml_model.clear()  # Clear the model at shutdown


app = FastAPI(
    title="Loan Eligibility API",
    description="Predicts the probability that a loan applicant will default.",
    version="1.0.0",
    lifespan=lifespan,
)

# Middleware must be registered after `app` exists.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# The user provides the following input values for the loan application:
class LoanApplication(BaseModel):  # Pydantic Model (Validation)
    person_age: int = Field(..., ge=18, le=100)
    person_income: float = Field(..., gt=0)
    person_home_ownership: Literal["RENT", "OWN", "MORTGAGE", "OTHER"]
    person_emp_length: float = Field(..., ge=0, le=80)
    loan_intent: Literal[
        "DEBTCONSOLIDATION",
        "EDUCATION",
        "HOMEIMPROVEMENT",
        "MEDICAL",
        "PERSONAL",
        "VENTURE",
    ]
    loan_grade: Literal["A", "B", "C", "D", "E", "F", "G"]
    loan_amnt: float = Field(..., gt=0)
    loan_int_rate: float = Field(..., gt=0, le=100)
    loan_percent_income: float = Field(..., ge=0)
    cb_person_default_on_file: Literal["Y", "N"]
    cb_person_cred_hist_length: int = Field(..., ge=0, le=80)


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": "model" in ml_model}


@app.post("/predict")
def predict(data: LoanApplication):
    if "model" not in ml_model:
        raise HTTPException(status_code=503, detail="Model is not loaded")

    input_data = pd.DataFrame([data.model_dump()])  # Convert the input data to a DataFrame

    # [:, 1] -> probability of the positive class (default); [0] -> first (only) row
    probability = float(ml_model["model"].predict_proba(input_data)[:, 1][0])

    # Compare with the tuned threshold to get the prediction
    prediction = int(probability >= ml_model["threshold"])

    return {
        "default_probability": probability,
        "default_prediction": prediction,
        "threshold": ml_model["threshold"],
        "Result": "Not Eligible" if prediction == 1 else "Eligible",
    }
