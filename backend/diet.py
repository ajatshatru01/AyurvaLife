from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
from pathlib import Path
import joblib
import pandas as pd

def _load_env_file_if_present():
    """
    Lightweight .env loader: reads key.env or .env from project root and
    injects any VAR=VALUE pairs into os.environ if not already set.
    Does nothing if files are missing.
    """
    root = Path(__file__).resolve().parent
    for fname in ("key.env", ".env"):
        fpath = root / fname
        if not fpath.exists():
            continue
        try:
            for raw_line in fpath.read_text(encoding="utf-8").splitlines():
                line = raw_line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                # Do not override existing environment
                if key and key not in os.environ:
                    os.environ[key] = value
        except Exception:
            # Fail silently; env can still be provided by the shell
            pass


# Load env from file(s) before accessing os.getenv
_load_env_file_if_present()

app = Flask(__name__)
CORS(app)

# Load ML model
MODEL_PATH = Path(__file__).resolve().parent / "dosha_model.pkl"
FEATURES_PATH = Path(__file__).resolve().parent / "feature_names.json"
dosha_model = None
feature_names = []
if MODEL_PATH.exists() and FEATURES_PATH.exists():
    try:
        dosha_model = joblib.load(MODEL_PATH)
        with open(FEATURES_PATH, 'r') as f:
            feature_names = json.load(f)
    except Exception as e:
        print(f"Error loading ML model: {e}")

# Load API key from environment (do not hardcode secrets)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemma-3-27b-it:free")
APP_URL = os.getenv("APP_URL", "http://localhost:8080")
APP_TITLE = os.getenv("APP_TITLE", "AyurvaLife")


def build_prompt(patient_data: dict) -> str:
    """
    Build a prompt string for the LLM, safely serializing any patient data.
    """
    try:
        patient_data_text = json.dumps(patient_data, indent=2, ensure_ascii=False)
    except Exception:
        # fallback in case patient_data has non-serializable fields
        patient_data_text = str(patient_data)

    return f"""
Generate a comprehensive Ayurvedic diet plan with varied meals, try to keep diet for different patients about half unique for the following patient in JSON format.
Include the keys and give in the same order as below:
- "breakfast": list of food items
- "lunch": list of food items
- "dinner": list of food items
- "snack": optional list of food items
- "general_guidelines": string

Patient data (all provided fields must be considered):
{patient_data_text}

Rules:
- Do not include explanations, only provide valid JSON.
- Each meal must be a list of items consisting of about 5-6 distinct food items.
- Keep it general (not day-specific).
"""


def extract_json_from_text(text: str):
    """
    Attempt to extract JSON object from a text block. Handles code fences and extra prose.
    """
    if not isinstance(text, str):
        return None

    # Strip common code fence wrappers
    cleaned = text.strip()
    if cleaned.startswith("```"):
        # Remove leading ```json or ```
        cleaned = cleaned.split("\n", 1)[-1]
    if cleaned.endswith("```"):
        cleaned = cleaned.rsplit("\n", 1)[0]

    # Try direct parse first
    try:
        return json.loads(cleaned)
    except Exception:
        pass

    # Fallback: find first { and last } and try that slice
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = cleaned[start:end+1]
        try:
            return json.loads(candidate)
        except Exception:
            return None
    return None


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/predict-dosha", methods=["POST"])
def predict_dosha():
    if not dosha_model:
        return jsonify({"error": "ML model not loaded"}), 500
    
    try:
        data = request.get_json(force=True, silent=False) or {}
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    # Ensure all required features are present
    missing_features = [f for f in feature_names if f not in data]
    if missing_features:
        return jsonify({"error": f"Missing features: {missing_features}"}), 400

    # Create a DataFrame for prediction
    try:
        df = pd.DataFrame([data])
        # Reorder columns to match training
        df = df[feature_names]
        prediction = dosha_model.predict(df)[0]
        return jsonify({"predicted_dosha": prediction})
    except Exception as e:
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500


@app.route("/api/diet-plan", methods=["POST"])
def generate_diet_plan():
    try:
        patient_data = request.get_json(force=True, silent=False) or {}
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    if not isinstance(patient_data, dict) or not patient_data:
        return jsonify({"error": "Patient data must be a non-empty JSON object"}), 400

    # Prefer env var; support fallback alias API_KEY
    api_key = OPENROUTER_API_KEY or os.getenv("OPENROUTER_API_KEY", "") or os.getenv("API_KEY", "")
    if not api_key:
        return jsonify({"error": "Server API key not configured"}), 500

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": APP_URL,
        "X-Title": APP_TITLE,
    }

    prompt = build_prompt(patient_data)

    data = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(OPENROUTER_URL, json=data, headers=headers, timeout=120)
        content_type = response.headers.get("Content-Type", "")
        try:
            upstream = response.json() if "application/json" in content_type else {"text": response.text}
        except ValueError:
            upstream = {"text": response.text}

        if response.status_code != 200:
            return jsonify({
                "error": "Upstream request failed",
                "upstream_status": response.status_code,
                "upstream_response": upstream
            }), 502

        # Try parsing LLM output safely
        llm_output = upstream.get("choices", [{}])[0].get("message", {}).get("content", "")
        parsed = extract_json_from_text(llm_output)
        if parsed is not None:
            return jsonify(parsed)
        # Fallback: return raw text if JSON parsing fails
        return jsonify({"raw": llm_output})

    except requests.RequestException as e:
        resp = getattr(e, "response", None)
        return jsonify({
            "error": "Upstream request exception",
            "details": str(e),
            "upstream_status": getattr(resp, "status_code", None),
            "upstream_text": getattr(resp, "text", None)
        }), 502
    except Exception as e:
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)