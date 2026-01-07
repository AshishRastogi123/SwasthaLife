const http = require('http');
const Prediction = require("../models/Prediction");

// Helper to call FastAPI ML service
const fetchPredictionFromML = (symptoms) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ symptoms });

    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/predict',
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
          const parsed = JSON.parse(body);
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
      vitals,
      lifestyle,
      familyHistory,
      allergies,
      symptoms,
      prediction: clientPrediction,
    } = req.body;

    let prediction = clientPrediction || null;

    // If no prediction provided by client, call ML service server-side
    if (!prediction) {
      try {
        const ml = await fetchPredictionFromML(symptoms);
        if (ml && (ml.predicted_disease || ml.predicted_disease === '')) {
          prediction = {
            disease: ml.predicted_disease,
            probability: ml.confidence || null,
            modelUsed: 'FastAPI-ML',
          };
        }
      } catch (err) {
        console.warn('Could not fetch prediction from ML service:', err.message);
      }
    }

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
      symptoms,
      prediction,
    });

    return res.status(201).json({
      message: "Prediction data saved successfully",
      data: created,
    });
  } catch (error) {
    console.error("Prediction save error:", error);
    return res.status(500).json({
      message: "Server error while saving prediction",
    });
  }
};

module.exports = { createPrediction };
