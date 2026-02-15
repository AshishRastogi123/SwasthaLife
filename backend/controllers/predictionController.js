const http = require('http');
const Prediction = require("../models/Prediction");

// Helper to call FastAPI ML service
// Accepts either { symptoms: [...] } or { input_vector: [...] } or just a symptoms array
const fetchPredictionFromML = (payload, debug = false) => {
  return new Promise((resolve, reject) => {
    let bodyObj = null;

    // Payload may be an array (symptoms) or an object
    if (Array.isArray(payload)) {
      bodyObj = { symptoms: payload };
    } else if (payload && typeof payload === 'object') {
      if (payload.input_vector) bodyObj = { input_vector: payload.input_vector };
      else if (payload.symptoms) bodyObj = { symptoms: Array.isArray(payload.symptoms) ? payload.symptoms : Object.keys(payload.symptoms).filter(k => !!payload.symptoms[k]) };
    }

    if (!bodyObj) return reject(new Error('No valid payload provided to ML service'));

    const data = JSON.stringify(bodyObj);

    const options = {
      hostname: 'localhost',
      port: 8000,
      path: debug ? '/predict?debug=1' : '/predict',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          if (res.statusCode >= 400) {
            const msg = parsed && (parsed.detail || parsed.message) ? (parsed.detail || parsed.message) : `ML service error: ${res.statusCode}`;
            return reject(new Error(msg));
          }
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy(new Error('ML service timeout'));
    });

    req.write(data);
    req.end();
  });
};

const createPrediction = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      firstName,
      lastName,
      age,
      dob,
      gender,
      phone,
      heightCm,
      weightKg,
      vitals = {},
      lifestyle = {},
      familyHistory = {},
      allergies = [],
      symptoms = [],
      diseaseContext = {},
      prediction: clientPrediction,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !age || !gender) {
      return res.status(400).json({
        message: "Required fields: firstName, lastName, age, gender",
      });
    }

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        message: "At least one symptom is required",
      });
    }

    // Preserve client provided prediction if present
    let prediction = clientPrediction || null;

    // Normalize symptoms input: accept array or object of booleans
    let normalizedSymptoms = [];
    if (Array.isArray(symptoms)) {
      normalizedSymptoms = symptoms.filter(s => s && s.trim() !== "");
    } else if (symptoms && typeof symptoms === 'object') {
      normalizedSymptoms = Object.keys(symptoms).filter((k) => !!symptoms[k]);
    }

    if (normalizedSymptoms.length === 0) {
      return res.status(400).json({
        message: "At least one symptom is required",
      });
    }

    // Call ML service if no prediction provided
    if (!clientPrediction) {
      try {
        console.log("Calling ML service with symptoms:", normalizedSymptoms);
        const ml = await fetchPredictionFromML(normalizedSymptoms);
        
        if (ml && ml.predicted_disease) {
          prediction = {
            disease: ml.predicted_disease,
            probability: ml.confidence || null,
            modelUsed: 'FastAPI-ML',
          };
          console.log("ML prediction received:", prediction);
        }
      } catch (err) {
        console.warn('Could not fetch prediction from ML service:', err.message);
        // Don't fail - allow saving even if ML service is down
        prediction = {
          disease: diseaseContext.disease || 'Unknown',
          probability: null,
          modelUsed: 'Fallback',
          error: err.message,
        };
      }
    }

    // Create prediction record in database
    const created = await Prediction.create({
      userId,
      firstName,
      lastName,
      age,
      dob,
      gender,
      phone,
      heightCm,
      weightKg,
      vitals,
      lifestyle,
      familyHistory,
      allergies,
      symptoms: normalizedSymptoms,
      prediction,
      diseaseContext,
      createdAt: new Date(),
    });

    console.log("Prediction saved:", created._id);

    return res.status(201).json({
      message: "Prediction data saved successfully",
      data: created,
      prediction: prediction,
    });
  } catch (error) {
    console.error("Prediction save error:", error);
    return res.status(500).json({
      message: "Server error while saving prediction",
      error: error.message,
    });
  }
};

// Endpoint to only return ML prediction (no DB save, no auth required)
const predictOnly = async (req, res) => {
  try {
    const { symptoms, input_vector } = req.body;

    // Prefer input_vector if provided (client provided full 0/1 vector)
    let payload = null;
    if (input_vector && Array.isArray(input_vector)) {
      payload = { input_vector };
    } else if (Array.isArray(symptoms)) {
      payload = symptoms.filter(s => s && s.trim() !== "");
    } else if (symptoms && typeof symptoms === 'object') {
      payload = Object.keys(symptoms).filter(k => !!symptoms[k]);
    }

    if (!payload || (Array.isArray(payload) && payload.length === 0)) {
      return res.status(400).json({ message: 'At least one symptom or input_vector is required' });
    }

    try {
      const debugFlag = req.query && (req.query.debug === '1' || req.query.debug === 'true');
      const ml = await fetchPredictionFromML(payload, debugFlag);
      
      if (!ml || !('predicted_disease' in ml)) {
        return res.status(502).json({ message: 'Invalid response from ML service' });
      }
      
      const response = { 
        predicted_disease: ml.predicted_disease, 
        confidence: ml.confidence 
      };
      
      if (ml.input_vector) response.input_vector = ml.input_vector;
      
      return res.status(200).json(response);
    } catch (err) {
      console.error('ML prediction error:', err.message);
      return res.status(502).json({ message: err.message || 'ML service error' });
    }
  } catch (err) {
    console.error('Prediction-only error:', err);
    return res.status(500).json({ message: 'Server error while fetching prediction' });
  }
};

// Fetch symptom columns from ML service
const fetchColumnsFromML = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/columns',
      method: 'GET',
      timeout: 3000,
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          if (res.statusCode >= 400) return reject(new Error(parsed && parsed.detail ? parsed.detail : `ML service error: ${res.statusCode}`));
          resolve(parsed && parsed.columns ? parsed.columns : null);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy(new Error('ML service timeout'));
    });

    req.end();
  });
};

const getColumns = async (req, res) => {
  try {
    const cols = await fetchColumnsFromML();
    if (!cols) return res.status(502).json({ message: 'Could not fetch columns from ML service' });
    return res.status(200).json({ columns: cols });
  } catch (err) {
    console.error('Columns fetch error:', err.message);
    return res.status(502).json({ message: err.message || 'ML service error' });
  }
};

module.exports = { createPrediction, predictOnly, getColumns };
