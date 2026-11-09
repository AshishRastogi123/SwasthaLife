const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { EventEmitter } = require("node:events");
const fs = require("node:fs/promises");
const http = require("node:http");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { after, before, test } = require("node:test");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "integration-test-secret-only";
process.env.NODE_ENV = "test";

const originalHttpRequest = http.request;
let heartPredictionRequest;
http.request = function mockPredictionService(options, callback) {
  if (
    options.hostname === "localhost" &&
    options.port === 8000 &&
    (options.path.startsWith("/predict") || options.path === "/heart/predict")
  ) {
    const request = new EventEmitter();
    let requestBody = "";
    request.write = (chunk) => {
      requestBody += chunk;
      return true;
    };
    request.end = () => {
      const response = new EventEmitter();
      response.statusCode = 200;
      process.nextTick(() => {
        callback(response);
        const body = options.path === "/heart/predict"
          ? {
            prediction: 1,
            prediction_label: "Heart disease class",
            has_heart_disease: true,
            positive_class_probability: 0.75,
            confidence: 0.75,
            model: "heart_disease_model",
            disclaimer: "Informational model result only.",
          }
          : { predicted_disease: "Test assessment result", confidence: 0.75 };
        if (options.path === "/heart/predict") {
          heartPredictionRequest = { options, body: JSON.parse(requestBody) };
        }
        response.emit("data", JSON.stringify(body));
        response.emit("end");
      });
    };
    request.destroy = (error) => process.nextTick(() => request.emit("error", error));
    return request;
  }
  return originalHttpRequest.apply(this, arguments);
};

const app = require("../app");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const Appointment = require("../models/Appointment");
const Prediction = require("../models/Prediction");
const EmergencyRequest = require("../models/EmergencyRequest");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const HealthConsent = require("../models/HealthConsent");
const { HEALTH_CONSENT_VERSION } = require("../config/healthConsent");

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const futureDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
};

const getFreePort = async () => new Promise((resolve, reject) => {
  const server = net.createServer();
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const { port } = server.address();
    server.close((error) => error ? reject(error) : resolve(port));
  });
});

const closeServer = async (server) => new Promise((resolve, reject) => {
  server.close((error) => error ? reject(error) : resolve());
});

let mongoProcess;
let mongoDirectory;
let mongoOutput = "";
let httpServer;
let baseUrl;
let fixtures;

before(async () => {
  mongoDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "swasthalife-integration-"));
  const mongoPort = await getFreePort();
  mongoProcess = spawn("mongod", [
    "--bind_ip", "127.0.0.1",
    "--port", String(mongoPort),
    "--dbpath", mongoDirectory,
    "--quiet",
  ], { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  mongoProcess.stdout.on("data", (chunk) => { mongoOutput += chunk.toString(); });
  mongoProcess.stderr.on("data", (chunk) => { mongoOutput += chunk.toString(); });

  const mongoUri = `mongodb://127.0.0.1:${mongoPort}/swasthalife_integration?directConnection=true`;
  let connected = false;
  for (let attempt = 0; attempt < 30 && !connected; attempt += 1) {
    if (mongoProcess.exitCode !== null) {
      throw new Error(`mongod exited before test startup:\n${mongoOutput}`);
    }
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 750 });
      connected = true;
    } catch (error) {
      await mongoose.disconnect();
      if (attempt === 29) throw new Error(`Could not connect to test mongod: ${error.message}\n${mongoOutput}`);
      await sleep(250);
    }
  }

  httpServer = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    httpServer.once("listening", resolve);
    httpServer.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${httpServer.address().port}`;

  const passwordHash = await bcrypt.hash("correct horse battery staple", 4);
  const [patient, otherPatient, doctorUser, unrelatedDoctorUser, admin, newDoctorUser] = await User.create([
    { name: "Patient One", email: "patient.one@example.test", password: passwordHash, role: "PATIENT" },
    { name: "Patient Two", email: "patient.two@example.test", password: passwordHash, role: "PATIENT" },
    { name: "Assigned Doctor", email: "doctor.one@example.test", password: passwordHash, role: "DOCTOR" },
    { name: "Other Doctor", email: "doctor.two@example.test", password: passwordHash, role: "DOCTOR" },
    { name: "Admin User", email: "admin@example.test", password: passwordHash, role: "ADMIN" },
    { name: "New Doctor Candidate", email: "doctor.new@example.test", password: passwordHash, role: "PATIENT" },
  ]);
  const department = await Department.create({ name: "Integration Medicine" });
  const [doctor, unrelatedDoctor] = await Doctor.create([
    {
      userId: doctorUser._id,
      departmentId: department._id,
      licenseNumber: "TEST-LICENSE-001",
      availableSlots: ["09:00", "10:00", "11:00", "12:00"],
    },
    {
      userId: unrelatedDoctorUser._id,
      departmentId: department._id,
      licenseNumber: "TEST-LICENSE-002",
      availableSlots: ["09:00", "10:00"],
    },
  ]);
  await HealthConsent.create([
    { userId: patient._id, consentStatus: true, consentTimestamp: new Date(), consentVersion: HEALTH_CONSENT_VERSION },
    { userId: otherPatient._id, consentStatus: true, consentTimestamp: new Date(), consentVersion: HEALTH_CONSENT_VERSION },
  ]);
  fixtures = { patient, otherPatient, doctorUser, unrelatedDoctorUser, admin, newDoctorUser, department, doctor, unrelatedDoctor };
});

after(async () => {
  http.request = originalHttpRequest;
  if (httpServer?.listening) await closeServer(httpServer);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
  if (mongoProcess && mongoProcess.exitCode === null) {
    const exited = new Promise((resolve) => mongoProcess.once("exit", resolve));
    mongoProcess.kill();
    await Promise.race([exited, sleep(5000)]);
  }
  if (mongoDirectory) await fs.rm(mongoDirectory, { recursive: true, force: true });
});

const request = async (method, route, token, body) => {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  return {
    status: response.status,
    body: text && response.headers.get("content-type")?.includes("application/json") ? JSON.parse(text) : null,
    text,
  };
};

const login = async (email, password = "correct horse battery staple") => {
  const response = await request("POST", "/api/auth/login", null, { email, password });
  assert.equal(response.status, 200, JSON.stringify(response.body));
  return response.body.token;
};

test("backend API integration: auth, patient, doctor, admin, and lifecycles", { timeout: 120_000 }, async (t) => {
  await t.test("public signup defaults to patient and permits doctor profiles but rejects admin", async () => {
    const mismatchedPasswords = await request("POST", "/api/auth/signup", null, {
      name: "Signup Patient",
      email: "mismatched.password@example.test",
      password: "correct horse battery staple",
      confirmPassword: "different password",
    });
    assert.equal(mismatchedPasswords.status, 400);

    const patientSignup = await request("POST", "/api/auth/signup", null, {
      name: "Signup Patient",
      email: "signup.patient@example.test",
      password: "correct horse battery staple",
      profile: { dateOfBirth: "1998-06-15", gender: "Female" },
      healthProfile: {
        heightCm: 165,
        weightKg: 60,
        bloodGroup: "A+",
        bloodPressure: "118/76",
        smokingStatus: "NEVER",
      },
      medicalHistory: { allergies: ["Pollen"] },
    });
    assert.equal(patientSignup.status, 201);
    const patientUser = await User.findOne({ email: "signup.patient@example.test" });
    assert.equal(patientUser.role, "PATIENT");
    assert.equal(patientUser.profile.gender, "Female");
    assert.equal(patientUser.healthProfile.heightCm, 165);
    assert.deepEqual(patientUser.medicalHistory.allergies, ["Pollen"]);

    const adminSignup = await request("POST", "/api/auth/signup", null, {
      name: "Public Admin",
      email: "public.admin@example.test",
      password: "correct horse battery staple",
      role: "ADMIN",
    });
    assert.equal(adminSignup.status, 400);
    assert.equal(await User.exists({ email: "public.admin@example.test" }), null);

    const doctorSignup = await request("POST", "/api/auth/signup", null, {
      name: "Signup Doctor",
      email: "signup.doctor@example.test",
      password: "correct horse battery staple",
      role: "DOCTOR",
      departmentId: fixtures.department.id,
      licenseNumber: "SIGNUP-LICENSE-001",
    });
    assert.equal(doctorSignup.status, 201, JSON.stringify(doctorSignup.body));
    const doctorUser = await User.findOne({ email: "signup.doctor@example.test" });
    const doctorProfile = await Doctor.findOne({ userId: doctorUser._id });
    assert.equal(doctorUser.role, "DOCTOR");
    assert.equal(doctorProfile.departmentId.toString(), fixtures.department.id);
  });

  await t.test("valid login returns a usable token; invalid login is rejected", async () => {
    const loggedIn = await request("POST", "/api/auth/login", null, {
      email: fixtures.patient.email,
      password: "correct horse battery staple",
    });
    assert.equal(loggedIn.status, 200);
    assert.equal(loggedIn.body.user.role, "PATIENT");
    fixtures.patientToken = loggedIn.body.token;

    const invalid = await request("POST", "/api/auth/login", null, {
      email: fixtures.patient.email,
      password: "incorrect password",
    });
    assert.equal(invalid.status, 401);
    assert.ok(await AuditLog.exists({ action: "auth.login.failure", actorUserId: fixtures.patient._id }));
  });

  await t.test("profile APIs return and update only the authenticated user's profile", async () => {
    assert.equal((await request("GET", "/api/users/profile")).status, 401);

    const emptyProfile = await request("GET", "/api/users/profile", fixtures.patientToken);
    assert.equal(emptyProfile.status, 200);
    assert.equal(emptyProfile.body.data.id, fixtures.patient.id);
    assert.equal(emptyProfile.body.data.password, undefined);
    assert.equal(emptyProfile.body.data.profile.age, null);
    assert.equal(emptyProfile.body.data.healthProfile.heightCm, "");
    assert.equal(emptyProfile.body.data.profileCompletion.percentage, 17);

    const personal = await request("PUT", "/api/users/profile", fixtures.patientToken, {
      name: "Patient Updated",
      phone: "9876543210",
      dateOfBirth: "2000-01-01",
      gender: "Other",
    });
    assert.equal(personal.status, 200, JSON.stringify(personal.body));
    assert.equal(personal.body.data.name, "Patient Updated");
    assert.equal(personal.body.data.profile.age, new Date().getFullYear() - 2000);

    const health = await request("PUT", "/api/users/health-profile", fixtures.patientToken, {
      heightCm: 172.5,
      weightKg: 68,
      bloodGroup: "O+",
      bloodPressure: "120/80",
      heartRate: 72,
      smokingStatus: "NEVER",
      alcoholConsumption: "NONE",
      physicalActivityLevel: "MODERATE",
    });
    assert.equal(health.status, 200, JSON.stringify(health.body));
    assert.equal(health.body.data.healthProfile.heightCm, 172.5);
    assert.equal(health.body.data.healthProfile.bodyTemperature, "");

    const invalidHealth = await request("PUT", "/api/users/health-profile", fixtures.patientToken, {
      heightCm: 0,
    });
    assert.equal(invalidHealth.status, 400);
    const unsupportedField = await request("PUT", "/api/users/profile", fixtures.patientToken, {
      userId: fixtures.otherPatient.id,
    });
    assert.equal(unsupportedField.status, 400);

    const history = await request("PUT", "/api/users/medical-history", fixtures.patientToken, {
      existingDiseases: ["Asthma"],
      allergies: ["Peanuts", "Pollen"],
      currentMedications: [],
      previousSurgeries: [],
      familyMedicalHistory: ["Heart disease"],
    });
    assert.equal(history.status, 200, JSON.stringify(history.body));
    assert.deepEqual(history.body.data.medicalHistory.allergies, ["Peanuts", "Pollen"]);
    assert.equal(history.body.data.password, undefined);

    const otherProfile = await request("GET", "/api/users/profile", await login(fixtures.otherPatient.email));
    assert.equal(otherProfile.status, 200);
    assert.equal(otherProfile.body.data.id, fixtures.otherPatient.id);
    assert.notEqual(otherProfile.body.data.name, personal.body.data.name);

    const doctorProfile = await request("GET", "/api/users/profile", await login(fixtures.doctorUser.email));
    assert.equal(doctorProfile.status, 200);
    assert.equal(doctorProfile.body.data.id, fixtures.doctorUser.id);
    const adminProfile = await request("GET", "/api/users/profile", await login(fixtures.admin.email));
    assert.equal(adminProfile.status, 200);
    assert.equal(adminProfile.body.data.id, fixtures.admin.id);

    const invalidMedicalHistory = await request("PUT", "/api/users/medical-history", fixtures.patientToken, {
      allergies: "not-an-array",
    });
    assert.equal(invalidMedicalHistory.status, 400);
  });

  await t.test("protected routes return 401 for a missing or invalid token", async () => {
    assert.equal((await request("GET", "/api/appointments/mine")).status, 401);
    const invalid = await request("GET", "/api/appointments/mine", "not-a-valid-jwt");
    assert.equal(invalid.status, 401);
    assert.equal((await request("POST", "/api/heart/predict", null, {})).status, 401);
  });

  await t.test("heart model endpoint validates input and requires current patient consent", async () => {
    const payload = {
      age: 63,
      sex: 1,
      cp: 1,
      trestbps: 145,
      chol: 233,
      fbs: 1,
      restecg: 2,
      thalach: 150,
      exang: 0,
      oldpeak: 2.3,
      slope: 0,
      ca: null,
      thal: null,
    };

    const invalid = await request("POST", "/api/heart/predict", fixtures.patientToken, {
      ...payload,
      cp: 4,
    });
    assert.equal(invalid.status, 400);

    const noConsentUser = await User.create({
      name: "Patient Without Consent",
      email: "patient.without.consent@example.test",
      password: await bcrypt.hash("correct horse battery staple", 4),
      role: "PATIENT",
    });
    const noConsentToken = await login(noConsentUser.email);
    const noConsent = await request("POST", "/api/heart/predict", noConsentToken, payload);
    assert.equal(noConsent.status, 403);

    const prediction = await request("POST", "/api/heart/predict", fixtures.patientToken, payload);
    assert.equal(prediction.status, 200, JSON.stringify(prediction.body));
    assert.equal(prediction.body.has_heart_disease, true);
    assert.equal(prediction.body.positive_class_probability, 0.75);
    assert.ok(prediction.body.assessmentId);
    const savedAssessment = await Prediction.findById(prediction.body.assessmentId);
    assert.ok(savedAssessment);
    assert.equal(savedAssessment.userId.toString(), fixtures.patient._id.toString());
    assert.equal(savedAssessment.diseaseContext.assessmentType, "HEART_DISEASE_MODEL");
    assert.equal(heartPredictionRequest.options.path, "/heart/predict");
    assert.deepEqual(heartPredictionRequest.body, payload);

    const history = await request("GET", "/api/history/mine", fixtures.patientToken);
    assert.equal(history.status, 200);
    const heartHistory = history.body.data.find((event) => event.id === `assessment-${savedAssessment.id}`);
    assert.ok(heartHistory);
    assert.equal(heartHistory.title, "Heart disease model assessment");
    assert.match(heartHistory.summary, /Positive-class score: 75.0%/);
    assert.deepEqual(heartHistory.modelInput, payload);
  });

  await t.test("patient creates and retrieves only their own assessment", async () => {
    const created = await request("POST", "/api/prediction", fixtures.patientToken, {
      firstName: "Patient",
      lastName: "One",
      age: 35,
      gender: "Other",
      symptoms: ["headache", "fatigue"],
    });
    assert.equal(created.status, 201, JSON.stringify(created.body));
    fixtures.assessment = await Prediction.findById(created.body.data._id);
    assert.ok(fixtures.assessment);
    assert.equal(fixtures.assessment.userId.toString(), fixtures.patient._id.toString());
    assert.equal(fixtures.assessment.prediction.status, "AVAILABLE");
    assert.equal(fixtures.assessment.prediction.disease, "Test assessment result");

    const own = await request("GET", `/api/assessments/${fixtures.assessment.id}`, fixtures.patientToken);
    assert.equal(own.status, 200);
    const mine = await request("GET", "/api/assessments/mine", fixtures.patientToken);
    assert.equal(mine.status, 200);
    assert.ok(mine.body.data.some((assessment) => assessment._id === fixtures.assessment.id));

    fixtures.otherAssessment = await Prediction.create({
      userId: fixtures.otherPatient._id,
      firstName: "Patient",
      lastName: "Two",
      age: 42,
      gender: "Other",
      symptoms: ["cough"],
    });
    const crossUser = await request("GET", `/api/assessments/${fixtures.otherAssessment.id}`, fixtures.patientToken);
    assert.equal(crossUser.status, 403);
  });

  await t.test("patient creates and retrieves their own appointment", async () => {
    const created = await request("POST", "/api/appointments", fixtures.patientToken, {
      doctorId: fixtures.doctor.id,
      departmentId: fixtures.department.id,
      appointmentDate: futureDate(30),
      appointmentTime: "09:00",
      reason: "Routine consultation",
      assessmentId: fixtures.assessment.id,
    });
    assert.equal(created.status, 201, JSON.stringify(created.body));
    fixtures.appointment = await Appointment.findById(created.body.data._id);
    assert.equal(fixtures.appointment.status, "PENDING");
    assert.equal(fixtures.appointment.patientId.toString(), fixtures.patient.id);

    const own = await request("GET", "/api/appointments/mine", fixtures.patientToken);
    assert.equal(own.status, 200);
    assert.ok(own.body.data.some((appointment) => appointment._id === fixtures.appointment.id));
    fixtures.otherAppointment = await Appointment.create({
      patientId: fixtures.otherPatient._id,
      doctorId: fixtures.unrelatedDoctor._id,
      departmentId: fixtures.department._id,
      appointmentDate: futureDate(31),
      appointmentTime: "09:00",
      reason: "Other patient's consultation",
      assessmentId: fixtures.otherAssessment._id,
    });
    const ownOnly = await request("GET", "/api/appointments/mine", fixtures.patientToken);
    assert.ok(ownOnly.body.data.every((appointment) => appointment.patientId._id === fixtures.patient.id));
  });

  await t.test("patient retrieves only their own health history", async () => {
    const own = await request("GET", "/api/history/mine", fixtures.patientToken);
    assert.equal(own.status, 200);
    assert.ok(own.body.data.length > 0);
    const other = await request("GET", `/api/history/patient/${fixtures.otherPatient.id}`, fixtures.patientToken);
    assert.equal(other.status, 403);
  });

  await t.test("patient creates emergency requests and sees only their notifications", async () => {
    const created = await request("POST", "/api/emergencies", fixtures.patientToken, {
      symptoms: "Need urgent clinical review",
      assessmentId: fixtures.assessment.id,
    });
    assert.equal(created.status, 201, JSON.stringify(created.body));
    fixtures.emergency = await EmergencyRequest.findById(created.body.data._id);
    assert.equal(fixtures.emergency.status, "NEW");
    assert.equal(fixtures.emergency.patientId.toString(), fixtures.patient.id);
    const ownEmergencies = await request("GET", "/api/emergencies/mine", fixtures.patientToken);
    assert.equal(ownEmergencies.status, 200);
    assert.ok(ownEmergencies.body.data.some((item) => item._id === fixtures.emergency.id));

    const otherNotification = await Notification.create({
      recipient: fixtures.otherPatient._id,
      type: "TEST_PRIVATE",
      title: "Private notification",
      message: "Other user's notification",
    });
    await Notification.create({
      recipient: fixtures.patient._id,
      type: "TEST_OWN",
      title: "Own notification",
      message: "Visible to this patient",
    });
    const ownNotifications = await request("GET", "/api/notifications", fixtures.patientToken);
    assert.equal(ownNotifications.status, 200);
    assert.ok(ownNotifications.body.data.some((item) => item.type === "TEST_OWN"));
    assert.ok(ownNotifications.body.data.every((item) => item.recipient === fixtures.patient.id));
    const crossRead = await request("PATCH", `/api/notifications/${otherNotification.id}/read`, fixtures.patientToken);
    assert.equal(crossRead.status, 404);
    assert.equal((await Notification.findById(otherNotification.id)).read, false);
  });

  await t.test("doctor dashboard and assigned appointment APIs return only assigned records", async () => {
    fixtures.doctorToken = await login(fixtures.doctorUser.email);
    const dashboard = await request("GET", "/api/doctors/me/dashboard", fixtures.doctorToken);
    assert.equal(dashboard.status, 200);
    assert.equal(typeof dashboard.body.data.pendingAppointments, "number");
    assert.ok(dashboard.body.data.availableSlots.includes("09:00"));
    const duplicateSlot = await request("PATCH", "/api/doctors/me/slots", fixtures.doctorToken, {
      action: "add",
      slot: "09:00",
    });
    assert.equal(duplicateSlot.status, 409);
    const invalidSlot = await request("PATCH", "/api/doctors/me/slots", fixtures.doctorToken, {
      action: "add",
      slot: "9:00",
    });
    assert.equal(invalidSlot.status, 400);
    const addSlot = await request("PATCH", "/api/doctors/me/slots", fixtures.doctorToken, {
      action: "add",
      slot: "13:30",
    });
    assert.equal(addSlot.status, 200);
    assert.ok(addSlot.body.data.availableSlots.includes("13:30"));
    const availableSlots = await request(
      "GET",
      `/api/appointments/available?doctorId=${fixtures.doctor.id}&date=${futureDate(30)}`,
      fixtures.patientToken
    );
    assert.ok(availableSlots.body.data.includes("13:30"));
    const bookedSlotRemoval = await request("PATCH", "/api/doctors/me/slots", fixtures.doctorToken, {
      action: "remove",
      slot: "09:00",
    });
    assert.equal(bookedSlotRemoval.status, 409);
    const removeSlot = await request("PATCH", "/api/doctors/me/slots", fixtures.doctorToken, {
      action: "remove",
      slot: "13:30",
    });
    assert.equal(removeSlot.status, 200);
    assert.ok(!removeSlot.body.data.availableSlots.includes("13:30"));

    const assigned = await request("GET", "/api/appointments/assigned", fixtures.doctorToken);
    assert.equal(assigned.status, 200);
    assert.ok(assigned.body.data.some((appointment) => appointment._id === fixtures.appointment.id));
    assert.ok(assigned.body.data.every((appointment) => appointment.doctorId._id === fixtures.doctor.id));
    const unrelatedAssessment = await request("GET", `/api/assessments/${fixtures.otherAssessment.id}`, fixtures.doctorToken);
    assert.equal(unrelatedAssessment.status, 403);
    const unrelatedHistory = await request("GET", `/api/history/patient/${fixtures.otherPatient.id}`, fixtures.doctorToken);
    assert.equal(unrelatedHistory.status, 403);
  });

  await t.test("doctor can access assigned assessment and create its review", async () => {
    const assessment = await request("GET", `/api/assessments/${fixtures.assessment.id}`, fixtures.doctorToken);
    assert.equal(assessment.status, 200);
    const review = await request("PATCH", `/api/assessments/${fixtures.assessment.id}/review`, fixtures.doctorToken, {
      clinicalNotes: "Reviewed during the assigned consultation.",
    });
    assert.equal(review.status, 200);
    const stored = await Prediction.findById(fixtures.assessment.id);
    assert.equal(stored.reviewStatus, "REVIEWED");
    assert.equal(stored.reviewedBy.toString(), fixtures.doctorUser.id);
    assert.equal(stored.clinicalNotes, "Reviewed during the assigned consultation.");
  });

  await t.test("appointment lifecycle persists PENDING to CONFIRMED to COMPLETED", async () => {
    let persisted = await Appointment.findById(fixtures.appointment.id);
    assert.equal(persisted.status, "PENDING");

    const confirmed = await request("PATCH", `/api/appointments/${persisted.id}/status`, fixtures.doctorToken, {
      status: "CONFIRMED",
    });
    assert.equal(confirmed.status, 200);
    persisted = await Appointment.findById(persisted.id);
    assert.equal(persisted.status, "CONFIRMED");

    const completed = await request("PATCH", `/api/appointments/${persisted.id}/status`, fixtures.doctorToken, {
      status: "COMPLETED",
      clinicalNotes: "Consultation completed.",
    });
    assert.equal(completed.status, 200);
    persisted = await Appointment.findById(persisted.id);
    assert.equal(persisted.status, "COMPLETED");
    assert.ok(persisted.reviewedAt instanceof Date);
  });

  await t.test("patient can cancel their own pending appointment", async () => {
    const created = await request("POST", "/api/appointments", fixtures.patientToken, {
      doctorId: fixtures.doctor.id,
      departmentId: fixtures.department.id,
      appointmentDate: futureDate(32),
      appointmentTime: "10:00",
      reason: "Appointment to cancel",
    });
    assert.equal(created.status, 201);
    const cancelled = await request("PATCH", `/api/appointments/${created.body.data._id}/status`, fixtures.patientToken, {
      status: "CANCELLED",
    });
    assert.equal(cancelled.status, 200);
    assert.equal((await Appointment.findById(created.body.data._id)).status, "CANCELLED");
    const completedCancellation = await request("PATCH", `/api/appointments/${fixtures.appointment.id}/status`, fixtures.patientToken, {
      status: "CANCELLED",
    });
    assert.equal(completedCancellation.status, 409);
    const forbiddenCrossCancellation = await request("PATCH", `/api/appointments/${fixtures.otherAppointment.id}/status`, fixtures.patientToken, {
      status: "CANCELLED",
    });
    assert.equal(forbiddenCrossCancellation.status, 403);
  });

  await t.test("emergency lifecycle enforces authorization at every stage and persists each status", async () => {
    fixtures.unrelatedDoctorToken = await login(fixtures.unrelatedDoctorUser.email);
    for (const status of ["ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED"]) {
      const forbidden = await request("PATCH", `/api/emergencies/${fixtures.emergency.id}/status`, fixtures.unrelatedDoctorToken, {
        status,
      });
      assert.equal(forbidden.status, 403);
      assert.equal((await EmergencyRequest.findById(fixtures.emergency.id)).status, "NEW");
    }

    for (const status of ["ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED"]) {
      const updated = await request("PATCH", `/api/emergencies/${fixtures.emergency.id}/status`, fixtures.doctorToken, {
        status,
        ...(status === "RESOLVED" ? { resolutionNotes: "Care follow-up arranged." } : {}),
      });
      assert.equal(updated.status, 200, JSON.stringify(updated.body));
      assert.equal((await EmergencyRequest.findById(fixtures.emergency.id)).status, status);
    }
  });

  await t.test("non-admin roles receive 403 for admin APIs", async () => {
    const doctorDenied = await request("GET", "/api/admin/dashboard", fixtures.doctorToken);
    const patientDenied = await request("GET", "/api/admin/audit-logs", fixtures.patientToken);
    assert.equal(doctorDenied.status, 403);
    assert.equal(patientDenied.status, 403);
    assert.equal((await request("GET", "/api/admin/audit-logs", fixtures.doctorToken)).status, 403);
    assert.equal((await request("GET", "/api/users", fixtures.patientToken)).status, 403);
    assert.equal((await request("POST", "/api/users", fixtures.doctorToken, { name: "Forbidden" })).status, 403);
    assert.equal((await request("POST", "/api/departments", fixtures.doctorToken, { name: "Forbidden" })).status, 403);
    assert.equal((await request("DELETE", `/api/departments/${fixtures.department.id}`, fixtures.doctorToken)).status, 403);
    assert.equal((await request("GET", "/api/appointments", fixtures.patientToken)).status, 403);
    assert.equal((await request("GET", "/api/emergencies", fixtures.patientToken)).status, 403);
  });

  await t.test("admin dashboard and user, doctor, and department management APIs work", async () => {
    fixtures.adminToken = await login(fixtures.admin.email);
    const dashboard = await request("GET", "/api/admin/dashboard", fixtures.adminToken);
    assert.equal(dashboard.status, 200);
    assert.ok(dashboard.body.data.totalPatients >= 2);

    const users = await request("GET", "/api/users?role=PATIENT&page=1&limit=10", fixtures.adminToken);
    assert.equal(users.status, 200);
    assert.ok(users.body.data.some((user) => user._id === fixtures.patient.id));

    const department = await request("POST", "/api/departments", fixtures.adminToken, {
      name: "Admin Created Department",
      description: "Integration-test department",
    });
    assert.equal(department.status, 201);
    const updatedDepartment = await request("PATCH", `/api/departments/${department.body.data._id}`, fixtures.adminToken, {
      description: "Updated by admin",
    });
    assert.equal(updatedDepartment.status, 200);
    assert.equal(updatedDepartment.body.data.description, "Updated by admin");

    const managedDepartments = await request("GET", "/api/departments/manage", fixtures.adminToken);
    assert.equal(managedDepartments.status, 200);
    assert.ok(managedDepartments.body.data.some((item) => item._id === department.body.data._id));

    const createdPatient = await request("POST", "/api/users", fixtures.adminToken, {
      name: "Admin Added Patient",
      email: "admin.added.patient@example.test",
      password: "a secure password",
      role: "PATIENT",
    });
    assert.equal(createdPatient.status, 201, JSON.stringify(createdPatient.body));
    assert.equal(createdPatient.body.data.role, "PATIENT");
    assert.ok(await bcrypt.compare("a secure password", (await User.findById(createdPatient.body.data._id)).password));

    const adminRoleDenied = await request("POST", "/api/users", fixtures.adminToken, {
      name: "Admin from UI",
      email: "admin.from.ui@example.test",
      password: "a secure password",
      role: "ADMIN",
    });
    assert.equal(adminRoleDenied.status, 400);

    const createdAdminDoctor = await request("POST", "/api/users", fixtures.adminToken, {
      name: "Admin Added Doctor",
      email: "admin.added.doctor@example.test",
      password: "a secure password",
      role: "DOCTOR",
      departmentId: fixtures.department.id,
      licenseNumber: "ADMIN-ADDED-LICENSE",
      qualifications: ["MD"],
    });
    assert.equal(createdAdminDoctor.status, 201, JSON.stringify(createdAdminDoctor.body));
    assert.equal(createdAdminDoctor.body.data.role, "DOCTOR");
    assert.ok(await Doctor.findOne({ userId: createdAdminDoctor.body.data._id }));

    const departmentToDeactivate = await request("POST", "/api/departments", fixtures.adminToken, {
      name: "Department for deactivation",
    });
    assert.equal(departmentToDeactivate.status, 201);
    const deactivatedDepartment = await request("DELETE", `/api/departments/${departmentToDeactivate.body.data._id}`, fixtures.adminToken);
    assert.equal(deactivatedDepartment.status, 200);
    assert.equal(deactivatedDepartment.body.data.isActive, false);
    assert.equal((await Department.findById(departmentToDeactivate.body.data._id)).isActive, false);
    const departmentsForManagement = await request("GET", "/api/departments/manage", fixtures.adminToken);
    assert.ok(departmentsForManagement.body.data.some((item) => item._id === departmentToDeactivate.body.data._id && !item.isActive));
    const publicDepartments = await request("GET", "/api/departments");
    assert.ok(publicDepartments.body.data.every((item) => item._id !== departmentToDeactivate.body.data._id));

    const createdDoctor = await request("POST", "/api/doctors", fixtures.adminToken, {
      userId: fixtures.newDoctorUser.id,
      departmentId: fixtures.department.id,
      licenseNumber: "TEST-LICENSE-NEW",
      qualifications: ["MD"],
      availableSlots: ["14:00"],
    });
    assert.equal(createdDoctor.status, 201);
    assert.ok(await Doctor.findOne({ userId: fixtures.newDoctorUser.id }));
    assert.equal((await User.findById(fixtures.newDoctorUser.id)).role, "DOCTOR");
    const doctors = await request("GET", "/api/doctors");
    assert.equal(doctors.status, 200);
    assert.ok(doctors.body.data.some((doctor) => doctor._id === createdDoctor.body.data._id));

    const changedUser = await request("PATCH", `/api/users/${fixtures.otherPatient.id}/status`, fixtures.adminToken, {
      isActive: false,
    });
    assert.equal(changedUser.status, 200);
    assert.equal((await User.findById(fixtures.otherPatient.id)).isActive, false);

    const adminManagedAppointment = await request("POST", "/api/appointments", fixtures.patientToken, {
      doctorId: fixtures.doctor.id,
      departmentId: fixtures.department.id,
      appointmentDate: futureDate(33),
      appointmentTime: "11:00",
      reason: "Admin-managed appointment",
    });
    assert.equal(adminManagedAppointment.status, 201);
    const appointmentUpdate = await request("PATCH", `/api/appointments/${adminManagedAppointment.body.data._id}/status`, fixtures.adminToken, {
      status: "CANCELLED",
    });
    assert.equal(appointmentUpdate.status, 200);
    assert.equal((await Appointment.findById(adminManagedAppointment.body.data._id)).status, "CANCELLED");

    const adminManagedEmergency = await request("POST", "/api/emergencies", fixtures.patientToken, {
      symptoms: "Admin-managed emergency request",
    });
    assert.equal(adminManagedEmergency.status, 201);
    const emergencyUpdate = await request("PATCH", `/api/emergencies/${adminManagedEmergency.body.data._id}/status`, fixtures.adminToken, {
      status: "ACKNOWLEDGED",
    });
    assert.equal(emergencyUpdate.status, 200);
    assert.equal((await EmergencyRequest.findById(adminManagedEmergency.body.data._id)).status, "ACKNOWLEDGED");
  });

  await t.test("admin can list appointments, emergencies, and audit logs", async () => {
    const appointments = await request("GET", "/api/appointments", fixtures.adminToken);
    assert.equal(appointments.status, 200);
    assert.ok(appointments.body.data.some((appointment) => appointment._id === fixtures.appointment.id));
    const emergencies = await request("GET", "/api/emergencies", fixtures.adminToken);
    assert.equal(emergencies.status, 200);
    assert.ok(emergencies.body.data.some((emergency) => emergency._id === fixtures.emergency.id));
    const logs = await request("GET", "/api/admin/audit-logs?action=appointment.created", fixtures.adminToken);
    assert.equal(logs.status, 200);
    assert.ok(logs.body.data.some((log) => log.action === "appointment.created"));
  });

  await t.test("invalid tokens and role restrictions remain enforced", async () => {
    const forged = jwt.sign({ userId: fixtures.patient.id, role: "ADMIN" }, "wrong-secret");
    assert.equal((await request("GET", "/api/admin/dashboard", forged)).status, 401);
    assert.equal((await request("GET", "/api/doctors/me/dashboard", fixtures.patientToken)).status, 403);
    assert.equal((await request("GET", "/api/emergencies", fixtures.doctorToken)).status, 200);
  });

  await t.test("medical chatbot proxy enforces auth and conversation ownership", async () => {
    const previousFetch = global.fetch;
    const previousServiceUrl = process.env.MEDICAL_CHATBOT_URL;
    const previousServiceToken = process.env.MEDICAL_CHATBOT_TOKEN;
    const flaskConversationId = "10c8fe5d-09c7-4a1b-9bb2-0adee88406b9";
    const forwardedRequests = [];
    process.env.MEDICAL_CHATBOT_URL = "http://127.0.0.1:8080";
    process.env.MEDICAL_CHATBOT_TOKEN = "integration-test-service-token";
    global.fetch = async (url, options) => {
      if (String(url).startsWith("http://127.0.0.1:8080/")) {
        forwardedRequests.push({ url: String(url), options });
        if (String(url).endsWith("/health")) {
          return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
        }
        return new Response(JSON.stringify({
          answer: "General medical information.",
          conversation_id: flaskConversationId,
          sources: [{ source: "data/Medical_book.pdf" }],
        }), { status: 200 });
      }
      return previousFetch(url, options);
    };

    try {
      const unauthorized = await request("POST", "/api/chatbot/chat", null, { question: "What is acne?" });
      assert.equal(unauthorized.status, 401);

      const first = await request("POST", "/api/chatbot/chat", fixtures.patientToken, { question: "What is acne?" });
      assert.equal(first.status, 200, JSON.stringify(first.body));
      assert.equal(first.body.data.answer, "General medical information.");
      assert.notEqual(first.body.data.conversationId, flaskConversationId);
      assert.equal(JSON.stringify(first.body).includes(flaskConversationId), false);
      assert.equal(JSON.stringify(first.body).includes(process.env.MEDICAL_CHATBOT_TOKEN), false);
      assert.deepEqual(first.body.data.sources, [{ source: "data/Medical_book.pdf" }]);
      assert.equal(forwardedRequests[0].options.headers.Authorization, "Bearer integration-test-service-token");
      assert.deepEqual(JSON.parse(forwardedRequests[0].options.body), { question: "What is acne?" });

      const followUp = await request("POST", "/api/chatbot/chat", fixtures.patientToken, {
        question: "Can it be treated?",
        conversationId: first.body.data.conversationId,
      });
      assert.equal(followUp.status, 200);
      assert.deepEqual(JSON.parse(forwardedRequests[1].options.body), {
        question: "Can it be treated?",
        conversation_id: flaskConversationId,
      });

      const otherPatient = await User.create({
        name: "Chatbot Cross-User Patient",
        email: "chatbot.cross-user@example.test",
        password: await bcrypt.hash("correct horse battery staple", 4),
        role: "PATIENT",
      });
      await HealthConsent.create({
        userId: otherPatient._id,
        consentStatus: true,
        consentTimestamp: new Date(),
        consentVersion: HEALTH_CONSENT_VERSION,
      });
      const otherPatientToken = await login(otherPatient.email);
      const crossUser = await request("POST", "/api/chatbot/chat", otherPatientToken, {
        question: "Continue that chat",
        conversationId: first.body.data.conversationId,
      });
      assert.equal(crossUser.status, 404);
      assert.equal(forwardedRequests.length, 2);

      const health = await request("GET", "/api/chatbot/health");
      assert.equal(health.status, 200);
      assert.deepEqual(health.body, { status: "ok" });
    } finally {
      global.fetch = previousFetch;
      if (previousServiceUrl === undefined) delete process.env.MEDICAL_CHATBOT_URL;
      else process.env.MEDICAL_CHATBOT_URL = previousServiceUrl;
      if (previousServiceToken === undefined) delete process.env.MEDICAL_CHATBOT_TOKEN;
      else process.env.MEDICAL_CHATBOT_TOKEN = previousServiceToken;
    }
  });
});
