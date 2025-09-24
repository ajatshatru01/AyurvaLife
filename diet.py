from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
from pathlib import Path
import google.generativeai as genai
import base64
from io import BytesIO
from PIL import Image

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

# Configure Gemini API
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    vision_model = genai.GenerativeModel("gemini-1.5-flash")
    text_model = genai.GenerativeModel("gemini-1.5-flash")
    print(f"Gemini API configured successfully")
else:
    vision_model = None
    text_model = None
    print("WARNING: GOOGLE_API_KEY not found. Image analysis will not work.")

app = Flask(__name__)
CORS(app)
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


def identify_dish_and_ingredients(image_data):
    """
    Identify dish and ingredients from base64 image data using Gemini Vision
    """
    if not vision_model:
        return {"error": "Google API key not configured for image analysis"}
    
    prompt = """You are an expert chef and food analyst. Look at this food image and:
    1. Identify the main dish or food item
    2. List the top 4-6 visible ingredients with their approximate percentages
    
    Return ONLY valid JSON in this exact format:
    {
      "dish": "Name of the dish",
      "ingredients": ["ingredient1 (30%)", "ingredient2 (25%)", "ingredient3 (20%)", "ingredient4 (15%)"]
    }
    
    Important: 
    - Be specific with dish names (e.g., "Chicken Biryani" not just "Rice dish")
    - Include percentage estimates that add up to roughly 90-100%
    - Focus on main visible ingredients
    - Return ONLY the JSON, no other text"""

    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        print(f"Image decoded successfully, size: {len(image_bytes)} bytes")
        
        response = vision_model.generate_content(
            [prompt, {"mime_type": "image/jpeg", "data": image_bytes}]
        )
        
        print(f"Gemini response received: {response.text[:200]}...")
        
        cleaned_text = response.text.strip().replace('```json', '').replace('```', '').strip()
        
        # Try to extract JSON more robustly
        result = extract_json_from_text(cleaned_text)
        if result and "dish" in result:
            print(f"Successfully parsed dish: {result['dish']}")
            return result
        else:
            print(f"Failed to parse JSON or missing dish field: {cleaned_text}")
            return {"dish": "Unknown", "ingredients": [], "debug_response": cleaned_text}
            
    except Exception as e:
        print(f"ERROR: Failed to analyze image: {e}")
        return {"error": f"Failed to analyze image: {str(e)}", "debug_info": str(e)}


def analyze_ingredients_ayurvedically(ingredients):
    """
    Analyze ingredients using Ayurvedic principles via Gemini
    """
    if not text_model:
        return {"error": "Google API key not configured for text analysis"}
        
    prompt = f"""As an Ayurvedic nutrition expert, analyze this dish and its ingredients. Provide both ingredient-level and dish-level analysis.

Return ONLY valid JSON in this exact format:
{{
  "ingredient_analysis": [
    {{
      "ingredient": "ingredient name",
      "rasa": ["taste1", "taste2"],
      "virya": "heating/cooling",
      "vipaka": "post-digestive effect",
      "dosha_effect": {{"vata":"effect", "pitta":"effect", "kapha":"effect"}},
      "recommendation": "specific advice"
    }}
  ],
  "dish_analysis": {{
    "dosha_score": {{"vata": "effect level", "pitta": "effect level", "kapha": "effect level"}},
    "ayurvedic_properties": "Overall properties and effects of the dish",
    "suitability": "Who should eat this dish and any precautions",
    "overall_rasa": "dominant tastes",
    "overall_virya": "heating/cooling",
    "health_benefits": "Main health benefits",
    "precautions": "Any warnings or contraindications"
  }}
}}

Ingredients to analyze: {ingredients}

Important:
- Provide practical, actionable advice
- Be specific about dosha effects
- Include both benefits and precautions
- Return ONLY the JSON, no other text"""

    try:
        response = text_model.generate_content(prompt)
        cleaned_text = response.text.strip().replace('```json', '').replace('```', '').strip()
        
        result = extract_json_from_text(cleaned_text)
        if result and "ingredient_analysis" in result:
            print(f"Successfully parsed Ayurvedic analysis")
            return result
        else:
            print(f"Failed to parse Ayurvedic analysis: {cleaned_text}")
            return {"ingredient_analysis": [], "debug_response": cleaned_text}
            
    except Exception as e:
        print(f"ERROR: Failed to analyze ingredients: {e}")
        return {"error": f"Failed to analyze ingredients: {str(e)}", "debug_info": str(e)}


def analyze_dish_from_image(image_data):
    """
    Complete dish analysis from image data
    """
    dish_info = identify_dish_and_ingredients(image_data)
    
    if "error" in dish_info:
        return dish_info
        
    dish = dish_info.get("dish", "Unknown Dish")
    ingredients = dish_info.get("ingredients", [])

    ayurvedic_data = analyze_ingredients_ayurvedically(ingredients)

    return {
        "dish": dish,
        "ingredients": ingredients,
        "ayurveda_analysis": ayurvedic_data
    }


@app.route("/api/analyze-image", methods=["POST"])
def analyze_image():
    """
    Analyze food image and return Ayurvedic analysis
    """
    try:
        data = request.get_json(force=True, silent=False) or {}
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    image_data = data.get("image")
    if not image_data:
        return jsonify({"error": "No image data provided"}), 400

    # Remove data URL prefix if present
    if image_data.startswith("data:image"):
        image_data = image_data.split(",", 1)[1]

    print(f"Received image data, length: {len(image_data)}")
    
    # Check if API key is configured
    if not vision_model:
        return jsonify({
            "error": "Google API key not configured", 
            "instructions": "Please set GOOGLE_API_KEY in your .env file"
        }), 500

    try:
        result = analyze_dish_from_image(image_data)
        print(f"Analysis result: {result}")
        return jsonify(result)
    except Exception as e:
        print(f"Analysis failed with error: {e}")
        return jsonify({"error": f"Analysis failed: {str(e)}", "debug": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


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