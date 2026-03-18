<div align="center">

<h1 align="center">AyurBuddy</h1>

<svg width="900" height="120" viewBox="0 0 900 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AyurvaLife: AI-Based Ayurvedic Diet Generator">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2CB67D"/>
      <stop offset="50%" stop-color="#7F5AF0"/>
      <stop offset="100%" stop-color="#F9C74F"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2.2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect x="0" y="0" width="900" height="120" fill="#0B1020" rx="18"/>
  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
        font-family="ui-sans-serif, -apple-system, Segoe UI, Roboto, Inter, Arial"
        font-size="34" font-weight="800" fill="url(#g)" filter="url(#glow)">
    AyurBuddy • AI Ayurvedic Diet Generator
    <animate attributeName="opacity" values="0.25;1;0.75;1" dur="3.2s" repeatCount="indefinite"/>
  </text>
  <text x="50%" y="80%" text-anchor="middle" dominant-baseline="middle"
        font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        font-size="14" fill="#C7D2FE" opacity="0.95">
    Ancient Ayurveda × Modern ML · Dosha Prediction · Personalized Meal Plans · Cloud-Ready
  </text>
</svg>




<svg width="220" height="44" viewBox="0 0 220 44" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated leaf">
  <defs>
    <linearGradient id="leafg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2CB67D"/>
      <stop offset="100%" stop-color="#F9C74F"/>
    </linearGradient>
  </defs>
  <g transform="translate(110 22)">
    <g>
      <path d="M0,-14 C10,-14 18,-6 18,4 C18,16 8,20 0,20 C-8,20 -18,16 -18,4 C-18,-6 -10,-14 0,-14 Z"
            fill="url(#leafg)" opacity="0.95"/>
      <path d="M0,-12 C0,-2 0,8 0,18" stroke="#0B1020" stroke-width="2.5" opacity="0.45"/>
      <animateTransform attributeName="transform" type="rotate" values="-8;8;-8" dur="2.4s" repeatCount="indefinite"/>
    </g>
  </g>
  <text x="110" y="41" text-anchor="middle"
        font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        font-size="12" fill="#475569">
    Ayurveda × AI · Always in balance
  </text>
</svg>

<p>
  <b>AyurBuddy (AyurvaLife)</b> is a next-gen, AI-first platform that predicts <b>Prakriti (Dosha)</b> and generates <b>personalized Ayurvedic diet plans</b> for patients—built to feel like a production-grade health-tech product, not a demo.
</p>

<p>
  <a href="#quick-start">Quick Start</a> ·
  <a href="#key-features">Key Features</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#project-structure">Structure</a> ·
  <a href="#api-overview">API</a> ·
  <a href="#installation--running">Install</a>
</p>

<p>
  <img alt="AI" src="https://img.shields.io/badge/AI-Personalization-2CB67D?style=for-the-badge">
  <img alt="Ayurveda" src="https://img.shields.io/badge/Ayurveda-Science%20of%20Life-F9C74F?style=for-the-badge">
  <img alt="Backend" src="https://img.shields.io/badge/Backend-FastAPI%20%7C%20Flask-7F5AF0?style=for-the-badge">
  <img alt="DB" src="https://img.shields.io/badge/DB-Supabase%20(Postgres)-3ECF8E?style=for-the-badge">
  <img alt="ML" src="https://img.shields.io/badge/ML-XGBoost%20%2B%20LLMs-111827?style=for-the-badge">
</p>

</div>

---

## Quick Start
From `AyurvaLife/` (two terminals):

**Terminal A (backend)**

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install flask flask-cors requests
python diet.py
```

**Terminal B (frontend)**

```bash
python -m http.server 8080
```

Open `http://localhost:8080` and click **Patient Management → Generate Diet Plan**.

---

## Why this exists (problem)
- **Manual diet chart creation** in Ayurvedic hospitals is slow, inconsistent, and hard to standardize.
- **Modern nutrition apps ignore Ayurvedic concepts** (doshas, agni, rasa, virya, vipaka), so recommendations feel “generic.”
- **Dietitians need patient management + plan generation** in one flow—fast, explainable, and audit-friendly.

---

## USPs (what makes AyurvaLife stand out)
- **Dosha-first personalization**: diet generation is conditioned on Prakriti + symptoms + lifestyle + constraints.
- **Hybrid AI stack**: **XGBoost** for robust dosha classification + **LLM reasoning** for meal-plan synthesis and variety.
- **8,000+ food knowledge graph**: multi-cuisine foods tagged with Ayurvedic properties + nutrition signals.
- **Clinic-ready workflow**: patient intake → constitution assessment → plan generation → PDF export → follow-ups.
- **Cloud-native**: designed for Supabase (Postgres + Auth + Storage) and API-first deployment.


---

## Key features
- **AI Diet Plan Generator**: generates meal plans (breakfast/lunch/dinner/snacks) + guidelines.
- **Dosha Quiz + Scoring**: interactive assessment with Vata/Pitta/Kapha score visualization.
- **Patient Management Dashboard**: create/edit/search/filter patient profiles, track vitals & habits.
- **Explainability layer (advanced)**: trace “why this food” using dosha balancing + rasa mapping (future-ready).
- **Safety & constraints (advanced)**: allergy-aware, medication-aware, condition-aware plan constraints.
- **Continuous learning loop (advanced)**: feedback → plan quality scoring → prompt/model tuning (MLOps-ready).
- **Offline-first UI (advanced)**: works in low-connectivity clinics; syncs when online.
- **EHR/HIS integration (advanced)**: HL7/FHIR-ready connector layer for hospital systems.

---

## Tech stack
- **Frontend**: Vanilla JS + HTML + CSS (responsive, modern UI)
- **Backend (this repo)**: Python microservice for diet generation endpoint
- **AI**: LLM (via OpenRouter) + XGBoost (dosha classifier module)
- **Data**: Supabase Postgres (patients, food items, feedback, audits)
- **Infra (recommended)**: Docker + GitHub Actions + Supabase Edge Functions

---

## Architecture
```text
┌──────────────────────────┐
│        Web UI (JS)        │
│  - Patient intake         │
│  - Dosha quiz             │
│  - Diet plan preview/PDF  │
└─────────────┬────────────┘
              │ HTTP (JSON)
              ▼
┌──────────────────────────┐
│ API Layer (FastAPI/Flask) │
│  POST /api/diet-plan      │
│  GET  /api/health         │
└─────────────┬────────────┘
              │
      ┌───────┴─────────┐
      ▼                 ▼
┌───────────────┐  ┌─────────────────┐
│ XGBoost Dosha  │  │  LLM Generator  │
│ Classifier      │  │ (OpenRouter)    │
└───────┬────────┘  └───────┬─────────┘
        │                   │
        └──────────┬────────┘
                   ▼
        ┌───────────────────────┐
        │ Supabase (Postgres)    │
        │ - patients             │
        │ - foods (8k+)           │
        │ - feedback & audits     │
        └───────────────────────┘
```


---

## API overview
### Health check
- **GET** `/api/health` → `{ "status": "ok" }`

### Diet plan generation
- **POST** `/api/diet-plan`
- **Body**: patient JSON (age, gender, height/weight, dosha, habits, conditions, allergies, etc.)
- **Returns**: JSON with `breakfast`, `lunch`, `dinner`, `snack`, `general_guidelines`

---

## Installation & running

### Prerequisites
- **Python 3.10+**
- Any static file server for the UI (VS Code Live Server / Python http server)

### 1) Backend (Python API)
From `AyurvaLife/`:

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install flask flask-cors requests
```

Create a `key.env` (or `.env`) in `AyurvaLife/`:

```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=google/gemma-3-27b-it:free
PORT=5000
APP_URL=http://localhost:8080
APP_TITLE=AyurvaLife
```

Run the API:

```bash
python diet.py
```

You should have:
- `http://localhost:5000/api/health`

### 2) Frontend (Web UI)
Open a second terminal in `AyurvaLife/`:

```bash
python -m http.server 8080
```

Open:
- `http://localhost:8080`

> The UI calls the backend at `http://localhost:5000` by default.

---


## Security & privacy (recommended best practices)
- Keep API keys in `.env` / `key.env` only (never commit).
- Store only necessary health data; add consent + data retention policies for production.
- Use Supabase Row Level Security (RLS) for patient data isolation.

---

## License
For hackathon/demo use. Add a license if you plan to open-source.
