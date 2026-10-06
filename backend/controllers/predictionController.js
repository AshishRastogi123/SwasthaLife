const http = require('http');
const Prediction = require("../models/Prediction");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const { createNotification } = require("../services/notificationService");
const { writeAuditLog } = require("../services/auditLogService");

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
      lifestyle = "",
      familyHistory = [],
      allergies = [],
      symptoms = [],
      diseaseContext = {},
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

    let prediction = null;

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

    try {
      const ml = await fetchPredictionFromML(normalizedSymptoms);
      if (ml && ml.predicted_disease) {
        prediction = {
          disease: ml.predicted_disease,
          probability: ml.confidence || null,
          modelUsed: "FastAPI-ML",
          status: "AVAILABLE",
        };
      }
    } catch (err) {
      prediction = { modelUsed: "FastAPI-ML", status: "UNAVAILABLE" };
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
      lifestyle: typeof lifestyle === "string" ? lifestyle : JSON.stringify(lifestyle),
      familyHistory: Array.isArray(familyHistory) ? familyHistory : Object.keys(familyHistory || {}).filter((key) => familyHistory[key]),
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
      error: "Unable to save prediction",
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

const listPatientPredictions = async (req, res) => {
  const data = await Prediction.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json({ data });
};

const getPrediction = async (req, res) => {
  const prediction = await Prediction.findById(req.params.id);
  if (!prediction) return res.status(404).json({ message: "Assessment not found" });
  if (req.user.role === "PATIENT" && prediction.userId.toString() !== req.user.userId) {
    return res.status(403).json({ message: "You may only access your own assessments" });
  }
  if (req.user.role === "DOCTOR") {
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    const appointment = await Appointment.findOne({ doctorId: doctor?._id, assessmentId: prediction._id });
    if (!appointment) return res.status(403).json({ message: "Assessment is not assigned to this doctor" });
  }
  res.json({ data: prediction });
};

const reviewPrediction = async (req, res) => {
  const prediction = await Prediction.findById(req.params.id);
  if (!prediction) return res.status(404).json({ message: "Assessment not found" });
  if (req.user.role === "DOCTOR") {
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    const appointment = await Appointment.findOne({ doctorId: doctor?._id, assessmentId: prediction._id });
    if (!appointment) return res.status(403).json({ message: "Assessment is not assigned to this doctor" });
  }
  if (req.body.clinicalNotes !== undefined && typeof req.body.clinicalNotes !== "string") {
    return res.status(400).json({ message: "clinicalNotes must be text" });
  }
  const wasReviewed = prediction.reviewStatus === "REVIEWED";
  const previousNotes = prediction.clinicalNotes || "";
  const updatedNotes = req.body.clinicalNotes?.trim() ?? previousNotes;
  const notesChanged = updatedNotes !== previousNotes;
  prediction.reviewStatus = "REVIEWED";
  prediction.reviewedBy = req.user.userId;
  prediction.reviewedAt = new Date();
  prediction.clinicalNotes = updatedNotes;
  await prediction.save();
  await writeAuditLog({
    req,
    action: "doctor.assessment.reviewed",
    resourceType: "ASSESSMENT",
    resourceId: prediction._id,
    changes: { toStatus: "REVIEWED" },
  });
  if (notesChanged && updatedNotes) {
    await writeAuditLog({
      req,
      action: "doctor.note.created",
      resourceType: "ASSESSMENT",
      resourceId: prediction._id,
    });
  }
  if (!wasReviewed || (notesChanged && updatedNotes)) {
    await createNotification({
      recipient: prediction.userId,
      type: wasReviewed ? "ASSESSMENT_UPDATED" : "ASSESSMENT_REVIEWED",
      title: wasReviewed ? "Assessment review updated" : "Assessment reviewed",
      message: wasReviewed
        ? "Your assessment review has been updated."
        : "Your assessment has been reviewed.",
      relatedEntityType: "ASSESSMENT",
      relatedEntityId: prediction._id,
    });
  }
  res.json({ data: prediction });
};

module.exports = {
  createPrediction,
  predictOnly,
  getColumns,
  listPatientPredictions,
  getPrediction,
  reviewPrediction,
};
