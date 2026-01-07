from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List, Optional
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

# -----------------------------
# Load model & symptom columns
# -----------------------------
try:
    import os
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    model = joblib.load(os.path.join(BASE_DIR, "best_model.joblib"))
    # Load label encoder (for decoding predicted labels)
    label_encoder = joblib.load(os.path.join(BASE_DIR, "label_encoder.joblib"))

    # Attempt to load explicit symptom columns list (if saved during training)
    symptom_columns_path = os.path.join(BASE_DIR, "symptom_columns.joblib")
    symptom_columns_json_path = os.path.join(BASE_DIR, "symptom_columns.json")
    symptom_columns = None

    if os.path.exists(symptom_columns_path):
        symptom_columns = joblib.load(symptom_columns_path)
        loaded_from = 'symptom_columns.joblib'
    elif os.path.exists(symptom_columns_json_path):
        import json
        with open(symptom_columns_json_path, 'r', encoding='utf-8') as fh:
            symptom_columns = json.load(fh)
        loaded_from = 'symptom_columns.json'
    else:
        loaded_from = None

    # If model exposes feature names, prefer those — they are authoritative
    model_cols = list(model.feature_names_in_) if hasattr(model, 'feature_names_in_') else None

    if model_cols is not None:
        if symptom_columns is None:
            symptom_columns = model_cols
            loaded_from = 'model.feature_names_in_'
        else:
            if len(symptom_columns) != len(model_cols):
                print(f"WARNING: symptom columns ({loaded_from}) length {len(symptom_columns)} does not match model.feature_names_in_ length {len(model_cols)}. Using model's feature names.")
                symptom_columns = model_cols
                loaded_from = 'model.feature_names_in_'
    else:
        if symptom_columns is None:
            # Unable to determine symptom columns — raise a helpful error
            raise RuntimeError(
                "Symptom columns not found. Please provide 'symptom_columns.joblib' or 'symptom_columns.json', or ensure the model has 'feature_names_in_' attribute."
            )

    # Normalize symptom columns to list of strings
    symptom_columns = [str(s) for s in symptom_columns]

    # Log basic info for debugging
    print(f"ML service started. Model loaded; symptom columns: {len(symptom_columns)} items (source={loaded_from}).")

    # Log basic info for debugging
    print(f"ML service started. Model loaded; symptom columns: {len(symptom_columns)} items.")
except Exception as e:
    raise RuntimeError(f"Model loading failed: {e}")

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(
    title="SwasthaLife Disease Prediction API",
    description="ML microservice for symptom-based disease prediction",
    version="1.0.0"
)

# Allow CORS from local frontend origins during development
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Request schema
# -----------------------------
class SymptomRequest(BaseModel):
    symptoms: Optional[List[str]] = None
    input_vector: Optional[List[int]] = None

# -----------------------------
# Health check
# -----------------------------
@app.get("/")
def health_check():
    return {"status": "ok", "message": "ML service is running"}

@app.get("/columns")
def get_columns():
    return {"columns": symptom_columns}

# -----------------------------
# Prediction endpoint
# -----------------------------
@app.post("/predict")
def predict_disease(request: SymptomRequest, debug: bool = False):
    # Accept either an explicit binary input_vector, or a list of symptom keys
    if request.input_vector is not None:
        iv = request.input_vector
        if not isinstance(iv, list):
            raise HTTPException(status_code=400, detail="input_vector must be a list of 0/1 integers")
        if len(iv) != len(symptom_columns):
            raise HTTPException(status_code=400, detail=f"input_vector length {len(iv)} does not match expected {len(symptom_columns)}")
        try:
            arr = np.array(iv, dtype=int)
        except Exception:
            raise HTTPException(status_code=400, detail="input_vector must contain integers")
        if not np.all(np.isin(arr, [0, 1])):
            raise HTTPException(status_code=400, detail="input_vector must be binary (0 or 1)")

        input_vector = arr
        used_input_vector = arr.tolist()

    else:
        user_symptoms = request.symptoms
        if not user_symptoms:
            raise HTTPException(status_code=400, detail="Symptoms list cannot be empty")

        # Create binary vector from symptom names
        input_vector = np.zeros(len(symptom_columns), dtype=int)
        symptom_index = {symptom: idx for idx, symptom in enumerate(symptom_columns)}

        unknown_symptoms = []
        for symptom in user_symptoms:
            if symptom in symptom_index:
                input_vector[symptom_index[symptom]] = 1
            else:
                unknown_symptoms.append(symptom)

        if unknown_symptoms:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown symptoms: {unknown_symptoms}"
            )

        used_input_vector = input_vector.tolist()

    # Reshape for model
    input_vector = input_vector.reshape(1, -1)

    # Prediction (model may return encoded label)
    encoded_pred = model.predict(input_vector)[0]

    # Decode predicted label if label_encoder is available
    predicted_disease = encoded_pred
    try:
        if 'label_encoder' in globals() and hasattr(label_encoder, 'inverse_transform'):
            predicted_disease = label_encoder.inverse_transform([encoded_pred])[0]
    except Exception:
        # If decoding fails, fall back to raw prediction
        predicted_disease = encoded_pred

    # Confidence (if supported)
    confidence = None
    if hasattr(model, "predict_proba"):
        try:
            confidence = float(np.max(model.predict_proba(input_vector)))
        except Exception:
            confidence = None

    return {
        "predicted_disease": predicted_disease,
        "confidence": confidence
    }
