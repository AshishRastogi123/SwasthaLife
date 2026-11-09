const { isObjectId } = require("./validateDomains");

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const hasUnsupportedKeys = (value, allowed) => Object.keys(value).some((key) => !allowed.includes(key));

exports.validateSignup = (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    confirmPassword,
    phone,
    departmentId,
    licenseNumber,
    professionalProfile,
    profile,
    healthProfile,
    medicalHistory,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  if (typeof name !== "string" || !name.trim() || name.trim().length > 120) {
    return res.status(400).json({ message: "A valid name of at most 120 characters is required" });
  }
  if (phone !== undefined && (typeof phone !== "string" || phone.length > 30)) {
    return res.status(400).json({ message: "Phone must be a string" });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "A valid email is required" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  if (confirmPassword !== undefined && confirmPassword !== password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  if (role !== undefined && !["PATIENT", "DOCTOR"].includes(role)) {
    return res.status(400).json({ message: "Public registration is limited to PATIENT and DOCTOR roles" });
  }
  if (role === "DOCTOR" && (!isObjectId(departmentId) || typeof licenseNumber !== "string" || !licenseNumber.trim())) {
    return res.status(400).json({ message: "departmentId and licenseNumber are required for doctor registration" });
  }
  if (role === "DOCTOR" && licenseNumber.trim().length > 100) {
    return res.status(400).json({ message: "Medical license number must be 100 characters or fewer" });
  }
  if (role === "DOCTOR" && (!req.file || !req.file.buffer)) {
    return res.status(400).json({ message: "A license or registration certificate document is required for doctor registration" });
  }
  if (role !== "DOCTOR" && (req.file || licenseNumber !== undefined || departmentId !== undefined || professionalProfile !== undefined)) {
    return res.status(400).json({ message: "Professional registration details are only valid for doctor accounts" });
  }

  if (professionalProfile !== undefined) {
    if (
      role !== "DOCTOR" ||
      !isPlainObject(professionalProfile) ||
      hasUnsupportedKeys(professionalProfile, [
        "registrationAuthority",
        "specialization",
        "qualification",
        "yearsOfExperience",
        "facilityName",
        "summary",
      ])
    ) {
      return res.status(400).json({ message: "Professional profile contains unsupported information" });
    }
    if (
      professionalProfile.yearsOfExperience !== undefined &&
      professionalProfile.yearsOfExperience !== "" &&
      professionalProfile.yearsOfExperience !== null &&
      (typeof professionalProfile.yearsOfExperience !== "number" ||
        !Number.isInteger(professionalProfile.yearsOfExperience) ||
        professionalProfile.yearsOfExperience < 0 ||
        professionalProfile.yearsOfExperience > 80)
    ) {
      return res.status(400).json({ message: "Years of experience must be a whole number between 0 and 80" });
    }
    for (const [field, maximum] of Object.entries({
      registrationAuthority: 160,
      specialization: 160,
      qualification: 300,
      facilityName: 200,
      summary: 2000,
    })) {
      const value = professionalProfile[field];
      if (value !== undefined && value !== null && value !== "" &&
        (typeof value !== "string" || value.trim().length > maximum)) {
        return res.status(400).json({ message: `${field} must be a string of at most ${maximum} characters` });
      }
    }
  }

  if (profile !== undefined) {
    if (!isPlainObject(profile) || hasUnsupportedKeys(profile, ["dateOfBirth", "gender"])) {
      return res.status(400).json({ message: "Profile must contain only dateOfBirth and gender" });
    }
    if (profile.dateOfBirth !== undefined && profile.dateOfBirth !== "" && profile.dateOfBirth !== null) {
      if (typeof profile.dateOfBirth !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth)) {
        return res.status(400).json({ message: "Date of birth must use YYYY-MM-DD format" });
      }
      const date = new Date(`${profile.dateOfBirth}T00:00:00.000Z`);
      if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== profile.dateOfBirth || date > new Date()) {
        return res.status(400).json({ message: "Date of birth must be a valid date that is not in the future" });
      }
    }
    if (profile.gender !== undefined && profile.gender !== "" && profile.gender !== null && !["Prefer not to say", "Male", "Female", "Other"].includes(profile.gender)) {
      return res.status(400).json({ message: "Gender must be Prefer not to say, Male, Female, or Other" });
    }
  }

  const healthFields = [
    "heightCm",
    "weightKg",
    "bloodGroup",
    "bloodPressure",
    "heartRate",
    "bodyTemperature",
    "smokingStatus",
    "alcoholConsumption",
    "physicalActivityLevel",
  ];
  if (healthProfile !== undefined) {
    if (role === "DOCTOR" || !isPlainObject(healthProfile) || hasUnsupportedKeys(healthProfile, healthFields)) {
      return res.status(400).json({ message: "Health profile information is available only for patient accounts" });
    }
    const numericRanges = {
      heightCm: [30, 300],
      weightKg: [1, 500],
      heartRate: [20, 300],
      bodyTemperature: [30, 45],
    };
    for (const [field, [minimum, maximum]] of Object.entries(numericRanges)) {
      const value = healthProfile[field];
      if (value !== undefined && value !== "" && value !== null &&
        (typeof value !== "number" || !Number.isFinite(value) || value < minimum || value > maximum)) {
        return res.status(400).json({ message: `${field} must be a finite number between ${minimum} and ${maximum}` });
      }
    }
    const enumValues = {
      bloodGroup: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      smokingStatus: ["NEVER", "FORMER", "CURRENT"],
      alcoholConsumption: ["NONE", "OCCASIONAL", "REGULAR"],
      physicalActivityLevel: ["SEDENTARY", "LOW", "MODERATE", "HIGH"],
    };
    for (const [field, values] of Object.entries(enumValues)) {
      const value = healthProfile[field];
      if (value !== undefined && value !== "" && value !== null && !values.includes(value)) {
        return res.status(400).json({ message: `${field} must be one of ${values.join(", ")}` });
      }
    }
    if (healthProfile.bloodPressure !== undefined && healthProfile.bloodPressure !== "" &&
      healthProfile.bloodPressure !== null &&
      (typeof healthProfile.bloodPressure !== "string" || !/^\d{2,3}\s*\/\s*\d{2,3}$/.test(healthProfile.bloodPressure.trim()))) {
      return res.status(400).json({ message: "Blood pressure must be in systolic/diastolic format" });
    }
  }

  const historyFields = [
    "existingDiseases",
    "allergies",
    "currentMedications",
    "previousSurgeries",
    "familyMedicalHistory",
  ];
  if (medicalHistory !== undefined) {
    if (role === "DOCTOR" || !isPlainObject(medicalHistory) || hasUnsupportedKeys(medicalHistory, historyFields)) {
      return res.status(400).json({ message: "Medical history is available only for patient accounts" });
    }
    for (const [field, values] of Object.entries(medicalHistory)) {
      if (
        !Array.isArray(values) ||
        values.length > 50 ||
        values.some((value) => typeof value !== "string" || !value.trim() || value.trim().length > 200)
      ) {
        return res.status(400).json({ message: `${field} must be an array of up to 50 non-empty strings` });
      }
    }
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password must be strings" });
  }

  next();
};
