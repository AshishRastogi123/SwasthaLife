from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

# -----------------------------
# Load model & symptom columns
# -----------------------------
try:
    import os
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    model = joblib.load(os.path.join(BASE_DIR, "best_model.joblib"))
    symptom_columns = joblib.load(os.path.join(BASE_DIR, "label_encoder.joblib"))
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

# -----------------------------
# Request schema
# -----------------------------
class SymptomRequest(BaseModel):
    symptoms: list[str]

# -----------------------------
# Health check
# -----------------------------
@app.get("/")
def health_check():
    return {"status": "ok", "message": "ML service is running"}

# -----------------------------
# Prediction endpoint
# -----------------------------
@app.post("/predict")
def predict_disease(request: SymptomRequest):
    user_symptoms = request.symptoms

    if not user_symptoms:
        raise HTTPException(status_code=400, detail="Symptoms list cannot be empty")

    # Create 132-length binary vector
    input_vector = np.zeros(len(symptom_columns))

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

    # Reshape for model
    input_vector = input_vector.reshape(1, -1)

    # Prediction
    prediction = model.predict(input_vector)[0]

    # Confidence (if supported)
    confidence = None
    if hasattr(model, "predict_proba"):
        confidence = float(np.max(model.predict_proba(input_vector)))

    return {
        "predicted_disease": prediction,
        "confidence": confidence
    }
