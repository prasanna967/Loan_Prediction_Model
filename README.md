# CreditLens · Loan Eligibility ML

An end-to-end loan-eligibility app: an **XGBoost credit-risk model** served by **FastAPI**, with an animated **React** frontend (Vite, plain CSS, [Motion](https://motion.dev) for animations).

```
Loan_Eligibility_ML/
├── main.py                    # FastAPI app (/predict, /health)
├── credit_risk_model.pkl      # Trained sklearn Pipeline + XGBClassifier
├── best_threshold.pkl         # Tuned decision threshold
├── loan_model.ipynb           # Training notebook
├── credit_risk_dataset.csv    # Training data
├── requirements.txt           # Runtime deps (production)
├── requirements-dev.txt       # Notebook + test deps
├── tests/                     # API tests (pytest)
├── Dockerfile                 # API container
├── docker-compose.yml         # Full stack locally
├── render.yaml                # One-click Render deployment
├── .github/workflows/ci.yml   # Lint, build & test on every push
└── Frontend/                  # React app
    ├── src/
    │   ├── api/               # Fetch client (timeouts, error handling)
    │   ├── config/env.js      # Reads VITE_* env vars
    │   ├── constants/         # Form options matching the model's categories
    │   ├── hooks/             # useApiHealth (live API status)
    │   ├── utils/             # Validation & payload building
    │   ├── components/
    │   │   ├── layout/        # Background, Navbar, Footer
    │   │   ├── sections/      # Hero, HowItWorks, Eligibility
    │   │   ├── form/          # Multi-step form, fields, stepper
    │   │   ├── result/        # Loading animation, result panel
    │   │   └── ui/            # RiskGauge, AnimatedNumber, Reveal
    │   └── styles/global.css  # Design tokens & base styles
    ├── Dockerfile             # Build + serve with nginx
    └── nginx.conf
```

## Local development

### 1. Backend (FastAPI)

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn main:app --reload
```

API docs are at http://localhost:8000/docs.

> **Note:** `xgboost` is pinned to **3.4.0** because the pickled model was serialized with that version. Don't upgrade it without re-exporting the model.

### 2. Frontend (React + Vite)

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173.

### Tests and checks

```bash
pytest -q                 # API tests
cd Frontend && npm run lint && npm run build
```

## Environment variables

| Where | Variable | Purpose |
|-------|----------|---------|
| Backend `.env` | `ALLOWED_ORIGINS` | Comma-separated frontend URLs allowed by CORS |
| Backend `.env` | `MODEL_PATH`, `THRESHOLD_PATH` | Model artifact paths |
| Backend `.env` | `LOG_LEVEL` | Logging level |
| Frontend `.env` | `VITE_API_BASE_URL` | URL of the API (no trailing slash) |
| Frontend `.env` | `VITE_REQUEST_TIMEOUT_MS` | Request timeout |

Real `.env` files are git-ignored. Only the `.env.example` templates are committed. `VITE_*` values are baked into the frontend at **build time** and are visible in the browser, so never put secrets in them.

## Deployment

### Option A: Docker Compose (any VM)

```bash
docker compose up --build -d
# Frontend: http://localhost:8080   API: http://localhost:8000
```

For a real domain, change `ALLOWED_ORIGINS` and the `VITE_API_BASE_URL` build arg in `docker-compose.yml`.

### Option B: Render (Blueprint)

1. Push this repo to GitHub.
2. In Render, choose **New → Blueprint** and select the repo (it reads `render.yaml`).
3. Set `ALLOWED_ORIGINS` on the API to your frontend URL, and `VITE_API_BASE_URL` on the static site to your API URL. Then redeploy both.

### Option C: Split hosting

- **API:** any Docker host (Render, Railway, Fly.io, Azure Container Apps, Cloud Run). The container honours `$PORT`.
- **Frontend:** Vercel or Netlify with root directory `Frontend`, build command `npm run build`, output `dist`. Set `VITE_API_BASE_URL` in the project's environment settings.

## API

`POST /predict`

```json
{
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
  "cb_person_cred_hist_length": 5
}
```

Response:

```json
{ "default_probability": 0.12, "default_prediction": 0, "threshold": 0.668, "Result": "Low Risk" }
```

`GET /health` returns `{ "status": "ok", "model_loaded": true }`.
