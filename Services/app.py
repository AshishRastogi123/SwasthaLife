from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union, Dict, Any
import joblib
import numpy as np
import os
import re
import json
import warnings

# Suppress benign sklearn feature name warnings
warnings.filterwarnings("ignore", category=UserWarning)

try:
    import pandas as pd
except ImportError:
    pd = None

# ---------------------------------------------------------------------------
# Canonical 132 dataset symptoms from Training.csv
# ---------------------------------------------------------------------------
CANONICAL_132_SYMPTOMS = [
    "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", "shivering",
    "chills", "joint_pain", "stomach_pain", "acidity", "ulcers_on_tongue",
    "muscle_wasting", "vomiting", "burning_micturition", "spotting_ urination", "fatigue",
    "weight_gain", "anxiety", "cold_hands_and_feets", "mood_swings", "weight_loss",
    "restlessness", "lethargy", "patches_in_throat", "irregular_sugar_level", "cough",
    "high_fever", "sunken_eyes", "breathlessness", "sweating", "dehydration",
    "indigestion", "headache", "yellowish_skin", "dark_urine", "nausea",
    "loss_of_appetite", "pain_behind_the_eyes", "back_pain", "constipation", "abdominal_pain",
    "diarrhoea", "mild_fever", "yellow_urine", "yellowing_of_eyes", "acute_liver_failure",
    "fluid_overload", "swelling_of_stomach", "swelled_lymph_nodes", "malaise", "blurred_and_distorted_vision",
    "phlegm", "throat_irritation", "redness_of_eyes", "sinus_pressure", "runny_nose",
    "congestion", "chest_pain", "weakness_in_limbs", "fast_heart_rate", "pain_during_bowel_movements",
    "pain_in_anal_region", "bloody_stool", "irritation_in_anus", "neck_pain", "dizziness",
    "cramps", "bruising", "obesity", "swollen_legs", "swollen_blood_vessels",
    "puffy_face_and_eyes", "enlarged_thyroid", "brittle_nails", "swollen_extremeties", "excessive_hunger",
    "extra_marital_contacts", "drying_and_tingling_lips", "slurred_speech", "knee_pain", "hip_joint_pain",
    "muscle_weakness", "stiff_neck", "swelling_joints", "movement_stiffness", "spinning_movements",
    "loss_of_balance", "unsteadiness", "weakness_of_one_body_side", "loss_of_smell", "bladder_discomfort",
    "foul_smell_of urine", "continuous_feel_of_urine", "passage_of_gases", "internal_itching", "toxic_look_(typhos)",
    "depression", "irritability", "muscle_pain", "altered_sensorium", "red_spots_over_body",
    "belly_pain", "abnormal_menstruation", "dischromic _patches", "watering_from_eyes", "increased_appetite",
    "polyuria", "family_history", "mucoid_sputum", "rusty_sputum", "lack_of_concentration",
    "visual_disturbances", "receiving_blood_transfusion", "receiving_unsterile_injections", "coma", "stomach_bleeding",
    "distention_of_abdomen", "history_of_alcohol_consumption", "fluid_overload.1", "blood_in_sputum", "prominent_veins_on_calf",
    "palpitations", "painful_walking", "pus_filled_pimples", "blackheads", "scurring",
    "skin_peeling", "silver_like_dusting", "small_dents_in_nails", "inflammatory_nails", "blister",
    "red_sore_around_nose", "yellow_crust_ooze"
]

# Common aliases, clinical terminology, and UI symptom mapping
SYNONYM_MAP = {
    "fever": ["mild_fever", "high_fever"],
    "pyrexia": ["mild_fever", "high_fever"],
    "weakness": ["muscle_weakness", "weakness_in_limbs"],
    "fatigue": ["fatigue"],
    "tiredness": ["fatigue"],
    "exhaustion": ["fatigue", "lethargy"],
    "diarrhea": ["diarrhoea"],
    "loose motion": ["diarrhoea"],
    "loose stools": ["diarrhoea"],
    "shortness of breath": ["breathlessness"],
    "difficulty breathing": ["breathlessness"],
    "breathless": ["breathlessness"],
    "dyspnea": ["breathlessness"],
    "belly pain": ["belly_pain", "stomach_pain", "abdominal_pain"],
    "stomach ache": ["stomach_pain", "abdominal_pain"],
    "tummy pain": ["stomach_pain", "abdominal_pain"],
    "stomach pain": ["stomach_pain"],
    "abdominal pain": ["abdominal_pain"],
    "rash": ["skin_rash"],
    "rashes": ["skin_rash"],
    "skin rash": ["skin_rash"],
    "itch": ["itching"],
    "itchy": ["itching"],
    "itching": ["itching"],
    "dizzy": ["dizziness"],
    "dizziness": ["dizziness"],
    "nauseous": ["nausea"],
    "nausea": ["nausea"],
    "vomit": ["vomiting"],
    "vomiting": ["vomiting"],
    "coughing": ["cough"],
    "cough": ["cough"],
    "persistent cough": ["cough"],
    "bloody stool": ["bloody_stool"],
    "blood in stool": ["bloody_stool"],
    "yellow eyes": ["yellowing_of_eyes"],
    "yellow skin": ["yellowish_skin"],
    "jaundice": ["yellowish_skin", "yellowing_of_eyes"],
    "fast heart rate": ["fast_heart_rate"],
    "rapid heartbeat": ["fast_heart_rate", "palpitations"],
    "palpitation": ["palpitations"],
    "palpitations": ["palpitations"],
    "chest pain": ["chest_pain"],
    "headache": ["headache"],
    "head ache": ["headache"],
    "joint pain": ["joint_pain"],
    "muscle pain": ["muscle_pain"],
    "back pain": ["back_pain"],
    "neck pain": ["neck_pain"],
    "stiff neck": ["stiff_neck"],
    "loss of appetite": ["loss_of_appetite"],
    "cold hands and feet": ["cold_hands_and_feets"],
    "cold feet": ["cold_hands_and_feets"],
    "cold hands": ["cold_hands_and_feets"],
    "spotting urination": ["spotting_ urination"],
    "spotting_urination": ["spotting_ urination"],
    "foul smell of urine": ["foul_smell_of urine"],
    "foul_smell_of_urine": ["foul_smell_of urine"],
    "dischromic patches": ["dischromic _patches"],
    "dischromic_patches": ["dischromic _patches"],
    "speech difficulty": ["slurred_speech"],
    "slurred speech": ["slurred_speech"],
    "vision changes": ["visual_disturbances", "blurred_and_distorted_vision"],
    "blurred vision": ["blurred_and_distorted_vision"],
    "blood in sputum": ["blood_in_sputum"],
    "weight loss": ["weight_loss"],
    "weight gain": ["weight_gain"],
    "loss of balance": ["loss_of_balance"],
    "unsteadiness": ["unsteadiness"],
    "acidity": ["acidity"],
    "indigestion": ["indigestion"],
    "constipation": ["constipation"],
    "burning urination": ["burning_micturition"],
    "burning micturition": ["burning_micturition"],
    "sinus pressure": ["sinus_pressure"],
    "runny nose": ["runny_nose"],
    "nasal congestion": ["congestion"],
    "congestion": ["congestion"],
    "throat irritation": ["throat_irritation"],
    "redness of eyes": ["redness_of_eyes"],
    "watering eyes": ["watering_from_eyes"],
    "watering from eyes": ["watering_from_eyes"],
    "altered sensorium": ["altered_sensorium"],
    "coma": ["coma"],
    "loss of smell": ["loss_of_smell"],
    "swelling joints": ["swelling_joints"],
    "painful walking": ["painful_walking"],
    "skin peeling": ["skin_peeling"],
    "pus filled pimples": ["pus_filled_pimples"],
    "blackheads": ["blackheads"],
    "blister": ["blister"],
}

# ---------------------------------------------------------------------------
# Global State & Artifact Loading
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best_model.joblib")
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, "label_encoder.joblib")
SYMPTOM_JSON_PATH = os.path.join(BASE_DIR, "symptom_columns.json")
SYMPTOM_JOBLIB_PATH = os.path.join(BASE_DIR, "symptom_columns.joblib")

model = None
label_encoder = None
symptom_columns: List[str] = []
json_symptom_columns: List[str] = []
model_load_error: Optional[str] = None

# Lookup structures
exact_col_map: Dict[str, int] = {}
norm_col_map: Dict[str, List[int]] = {}

def normalize_symptom_string(s: str) -> str:
    """Normalize symptom string: lowercase, collapse underscores/spaces/hyphens."""
    if not isinstance(s, str):
        s = str(s)
    s = s.strip().lower()
    s = re.sub(r'[\s_\-]+', ' ', s)
    return s

def build_lookup_indexes():
    """Build exact and normalized symptom index maps for fast matching."""
    global exact_col_map, norm_col_map
    exact_col_map = {col: i for i, col in enumerate(symptom_columns)}
    norm_col_map = {}
    for i, col in enumerate(symptom_columns):
        norm = normalize_symptom_string(col)
        norm_col_map.setdefault(norm, []).append(i)
        cleaned = re.sub(r'[^\w\s]', '', norm).strip()
        if cleaned and cleaned != norm:
            norm_col_map.setdefault(cleaned, []).append(i)
        base = re.sub(r'\s*\(.*?\)', '', norm).strip()
        if base and base != norm:
            norm_col_map.setdefault(base, []).append(i)

def load_artifacts():
    """Load model, label encoder, and symptom columns with robust fallbacks."""
    global model, label_encoder, symptom_columns, json_symptom_columns, model_load_error

    try:
        # 1. Load trained model
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
        model = joblib.load(MODEL_PATH)

        # 2. Load label encoder
        if os.path.exists(LABEL_ENCODER_PATH):
            label_encoder = joblib.load(LABEL_ENCODER_PATH)
        else:
            label_encoder = None
            print("Notice: label_encoder.joblib not found. Predictions will return raw model classes.")

        # 3. Load symptom_columns.json if present
        if os.path.exists(SYMPTOM_JSON_PATH):
            try:
                with open(SYMPTOM_JSON_PATH, "r", encoding="utf-8") as f:
                    json_symptom_columns = json.load(f)
                    json_symptom_columns = [str(s) for s in json_symptom_columns]
            except Exception as json_err:
                print(f"Notice: Failed to read {SYMPTOM_JSON_PATH}: {json_err}")
                json_symptom_columns = []

        # 4. Resolve symptom columns (feature names)
        loaded_from = None
        if hasattr(model, "feature_names_in_"):
            symptom_columns = [str(s) for s in model.feature_names_in_]
            loaded_from = "model.feature_names_in_"
        elif os.path.exists(SYMPTOM_JOBLIB_PATH):
            symptom_columns = [str(s) for s in joblib.load(SYMPTOM_JOBLIB_PATH)]
            loaded_from = "symptom_columns.joblib"
        elif len(CANONICAL_132_SYMPTOMS) == getattr(model, "n_features_in_", 132):
            symptom_columns = list(CANONICAL_132_SYMPTOMS)
            loaded_from = "CANONICAL_132_SYMPTOMS"
        elif json_symptom_columns:
            symptom_columns = list(json_symptom_columns)
            loaded_from = "symptom_columns.json"
        else:
            symptom_columns = list(CANONICAL_132_SYMPTOMS)
            loaded_from = "CANONICAL_132_SYMPTOMS_FALLBACK"

        build_lookup_indexes()
        model_load_error = None
        print(f"ML service loaded successfully. Model features: {len(symptom_columns)} (source={loaded_from}).")

    except Exception as exc:
        model_load_error = str(exc)
        print(f"CRITICAL: Failed to load ML artifacts: {exc}")

# Initial load
load_artifacts()

# ---------------------------------------------------------------------------
# Symptom Matching Logic
# ---------------------------------------------------------------------------
def resolve_symptom_indices(raw_symptom: str) -> List[int]:
    """
    Resolve a user-provided symptom string to one or more model feature indices.
    Supports exact names, normalized names, synonyms, and sub-phrase matching.
    """
    if not raw_symptom:
        return []
    raw = str(raw_symptom).strip()
    if not raw:
        return []

    # 1. Exact match
    if raw in exact_col_map:
        return [exact_col_map[raw]]

    norm = normalize_symptom_string(raw)

    # 2. Normalized match
    if norm in norm_col_map:
        return norm_col_map[norm]

    # 3. Cleaned match (no punctuation)
    cleaned = re.sub(r'[^\w\s]', '', norm).strip()
    if cleaned in norm_col_map:
        return norm_col_map[cleaned]

    # 4. Synonym match
    if norm in SYNONYM_MAP:
        indices: List[int] = []
        for target in SYNONYM_MAP[norm]:
            if target in exact_col_map:
                indices.append(exact_col_map[target])
            elif normalize_symptom_string(target) in norm_col_map:
                indices.extend(norm_col_map[normalize_symptom_string(target)])
        if indices:
            return list(set(indices))

    if cleaned in SYNONYM_MAP:
        indices: List[int] = []
        for target in SYNONYM_MAP[cleaned]:
            if target in exact_col_map:
                indices.append(exact_col_map[target])
            elif normalize_symptom_string(target) in norm_col_map:
                indices.extend(norm_col_map[normalize_symptom_string(target)])
        if indices:
            return list(set(indices))

    # 5. Check if any synonym key is a substring within the input
    sub_indices: List[int] = []
    for syn_key, targets in SYNONYM_MAP.items():
        if len(syn_key) >= 4 and syn_key in norm:
            for target in targets:
                if target in exact_col_map:
                    sub_indices.append(exact_col_map[target])
                elif normalize_symptom_string(target) in norm_col_map:
                    sub_indices.extend(norm_col_map[normalize_symptom_string(target)])
    if sub_indices:
        return list(set(sub_indices))

    # 6. Check if any normalized feature name is a substring of the input or vice versa
    for col_norm, idx_list in norm_col_map.items():
        if len(col_norm) >= 4 and (col_norm in norm or norm in col_norm):
            sub_indices.extend(idx_list)
    if sub_indices:
        return list(set(sub_indices))

    return []

# ---------------------------------------------------------------------------
# FastAPI Application & CORS
# ---------------------------------------------------------------------------
app = FastAPI(
    title="SwasthaLife Disease Prediction API",
    description="ML microservice for symptom-based disease assessment and risk analysis",
    version="1.1.0"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Request & Response Schemas
# ---------------------------------------------------------------------------
class SymptomRequest(BaseModel):
    symptoms: Optional[Union[List[str], Dict[str, Any], str]] = None
    input_vector: Optional[List[int]] = None
    debug: Optional[bool] = None

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/")
def health_root():
    is_ready = model is not None and len(symptom_columns) > 0
    return {
        "status": "ok" if is_ready else "degraded",
        "service": "SwasthaLife ML Disease Prediction Service",
        "model_loaded": model is not None,
        "features_count": len(symptom_columns),
        "version": "1.1.0",
        "error": model_load_error
    }

@app.get("/health")
def health_check():
    is_ready = model is not None and len(symptom_columns) > 0
    return {
        "status": "ok" if is_ready else "degraded",
        "model_loaded": model is not None,
        "error": model_load_error
    }

@app.get("/columns")
def get_columns():
    if not symptom_columns:
        if model_load_error:
            raise HTTPException(status_code=503, detail=f"Model not loaded: {model_load_error}")
        raise HTTPException(status_code=503, detail="Symptom columns unavailable")
    return {
        "columns": symptom_columns,
        "count": len(symptom_columns)
    }

@app.get("/symptoms")
def get_symptoms():
    return get_columns()

@app.post("/predict")
def predict_disease(request: SymptomRequest, debug: bool = Query(False)):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail=f"ML model is not available. Error: {model_load_error or 'Artifacts not loaded'}"
        )

    is_debug = bool(debug or request.debug)
    num_features = len(symptom_columns)
    recognized_symptoms: List[str] = []
    unknown_symptoms: List[str] = []

    # Path A: explicit binary input_vector provided
    if request.input_vector is not None:
        iv = request.input_vector
        if not isinstance(iv, list):
            raise HTTPException(status_code=400, detail="input_vector must be a list of integers")

        # Case A1: matches authoritative model feature count (e.g. 132)
        if len(iv) == num_features:
            try:
                arr = np.array(iv, dtype=int)
            except Exception:
                raise HTTPException(status_code=400, detail="input_vector elements must be valid integers")
            if not np.all(np.isin(arr, [0, 1])):
                raise HTTPException(status_code=400, detail="input_vector must contain only binary 0 or 1 values")
            input_vector = arr

        # Case A2: matches 79 symptom_columns.json schema - map 79 to 132 features
        elif json_symptom_columns and len(iv) == len(json_symptom_columns):
            try:
                arr_79 = np.array(iv, dtype=int)
            except Exception:
                raise HTTPException(status_code=400, detail="input_vector elements must be valid integers")
            if not np.all(np.isin(arr_79, [0, 1])):
                raise HTTPException(status_code=400, detail="input_vector must contain only binary 0 or 1 values")

            input_vector = np.zeros(num_features, dtype=int)
            for idx, val in enumerate(arr_79):
                if val == 1:
                    symptom_name = json_symptom_columns[idx]
                    mapped_indices = resolve_symptom_indices(symptom_name)
                    for mi in mapped_indices:
                        input_vector[mi] = 1

        else:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"input_vector length {len(iv)} does not match expected length {num_features} "
                    f"(or {len(json_symptom_columns)} for legacy schema)"
                )
            )

    # Path B: symptoms list / dict / string provided
    elif request.symptoms is not None:
        user_symptoms: List[str] = []

        if isinstance(request.symptoms, list):
            user_symptoms = [str(s).strip() for s in request.symptoms if str(s).strip()]
        elif isinstance(request.symptoms, dict):
            user_symptoms = [str(k).strip() for k, v in request.symptoms.items() if v and str(k).strip()]
        elif isinstance(request.symptoms, str):
            user_symptoms = [s.strip() for s in request.symptoms.split(",") if s.strip()]

        if not user_symptoms:
            raise HTTPException(status_code=400, detail="Symptoms list cannot be empty")

        input_vector = np.zeros(num_features, dtype=int)

        for sym in user_symptoms:
            indices = resolve_symptom_indices(sym)
            if indices:
                for idx in indices:
                    input_vector[idx] = 1
                recognized_symptoms.append(sym)
            else:
                unknown_symptoms.append(sym)

        # If zero symptoms could be mapped at all
        if np.sum(input_vector) == 0:
            raise HTTPException(
                status_code=400,
                detail=f"None of the provided symptoms were recognized. Unrecognized symptoms: {unknown_symptoms}"
            )

    else:
        raise HTTPException(
            status_code=400,
            detail="Either 'symptoms' (list of symptom names) or 'input_vector' (binary 0/1 array) is required"
        )

    # -----------------------------
    # Model Inference
    # -----------------------------
    reshaped_vector = input_vector.reshape(1, -1)

    # Feed with feature names if pandas is available to suppress warnings & enforce feature ordering
    if pd is not None and symptom_columns:
        model_input = pd.DataFrame(reshaped_vector, columns=symptom_columns)
    else:
        model_input = reshaped_vector

    try:
        raw_pred = model.predict(model_input)[0]
    except Exception as pred_err:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {pred_err}")

    # Decode target label with label_encoder if available
    predicted_disease = raw_pred
    if label_encoder is not None and hasattr(label_encoder, "inverse_transform"):
        try:
            predicted_disease = label_encoder.inverse_transform([raw_pred])[0]
        except Exception:
            predicted_disease = raw_pred

    predicted_disease = str(predicted_disease)

    # Calculate model confidence score
    confidence: Optional[float] = None
    top_predictions = []
    if hasattr(model, "predict_proba"):
        try:
            probs = model.predict_proba(model_input)[0]
            confidence = round(float(np.max(probs)), 4)

            # Generate top 3 predictions for debug
            if is_debug and label_encoder is not None and hasattr(label_encoder, "classes_"):
                sorted_idx = np.argsort(probs)[::-1][:3]
                for idx in sorted_idx:
                    prob_val = float(probs[idx])
                    if prob_val > 0.001:
                        top_predictions.append({
                            "disease": str(label_encoder.classes_[idx]),
                            "confidence": round(prob_val, 4)
                        })
        except Exception:
            confidence = None

    # -----------------------------
    # Response Construction
    # -----------------------------
    response: Dict[str, Any] = {
        "predicted_disease": predicted_disease,
        "disease": predicted_disease,
        "confidence": confidence,
    }

    if is_debug:
        response["input_vector"] = input_vector.tolist()
        if recognized_symptoms:
            response["recognized_symptoms"] = recognized_symptoms
        if unknown_symptoms:
            response["unknown_symptoms"] = unknown_symptoms
        if top_predictions:
            response["top_predictions"] = top_predictions
    elif unknown_symptoms:
        response["warning"] = f"Some unrecognized symptoms were ignored: {unknown_symptoms}"

    return response
