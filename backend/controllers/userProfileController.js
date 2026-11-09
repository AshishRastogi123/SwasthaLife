const User = require("../models/User");

const PROFILE_FIELDS = ["name", "email", "phone", "dateOfBirth", "gender"];
const HEALTH_FIELDS = [
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
const MEDICAL_FIELDS = [
  "existingDiseases",
  "allergies",
  "currentMedications",
  "previousSurgeries",
  "familyMedicalHistory",
];

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isEmpty = (value) => value === undefined || value === null || value === "";

const invalid = (res, message) => res.status(400).json({ message });

const rejectUnknownFields = (body, allowed, res) => {
  const unknown = Object.keys(body).find((key) => !allowed.includes(key));
  if (unknown) {
    invalid(res, `Unsupported field: ${unknown}`);
    return true;
  }
  return false;
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  const beforeBirthday =
    today.getUTCMonth() < birthDate.getUTCMonth() ||
    (today.getUTCMonth() === birthDate.getUTCMonth() && today.getUTCDate() < birthDate.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age >= 0 ? age : null;
};

const serializeProfile = (user) => {
  const profile = user.profile || {};
  const healthProfile = user.healthProfile || {};
  const medicalHistory = user.medicalHistory || {};
  const completionFields = [
    user.name,
    profile.dateOfBirth,
    profile.gender,
    user.phone,
    healthProfile.heightCm,
    healthProfile.weightKg,
  ];
  const completed = completionFields.filter((value) => !isEmpty(value)).length;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    profile: {
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().slice(0, 10) : "",
      age: calculateAge(profile.dateOfBirth),
      gender: profile.gender || "",
    },
    healthProfile: Object.fromEntries(HEALTH_FIELDS.map((field) => [field, healthProfile[field] ?? ""])),
    medicalHistory: Object.fromEntries(MEDICAL_FIELDS.map((field) => [field, medicalHistory[field] || []])),
    profileCompletion: {
      completed,
      total: completionFields.length,
      percentage: Math.round((completed / completionFields.length) * 100),
    },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User profile not found" });
    return res.status(200).json({ data: serializeProfile(user) });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    if (!isObject(req.body)) return invalid(res, "Profile information must be an object");
    if (rejectUnknownFields(req.body, PROFILE_FIELDS, res)) return undefined;
    if (Object.keys(req.body).length === 0) return invalid(res, "At least one profile field is required");

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User profile not found" });

    if (Object.hasOwn(req.body, "name")) {
      if (typeof req.body.name !== "string" || !req.body.name.trim() || req.body.name.trim().length > 120) {
        return invalid(res, "Name must be a non-empty string of at most 120 characters");
      }
      user.name = req.body.name.trim();
    }

    if (Object.hasOwn(req.body, "email")) {
      if (typeof req.body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email.trim())) {
        return invalid(res, "A valid email is required for account sign-in");
      }
      user.email = req.body.email.trim().toLowerCase();
    }

    if (Object.hasOwn(req.body, "phone")) {
      if (!isEmpty(req.body.phone) && typeof req.body.phone !== "string") {
        return invalid(res, "Phone must be a string");
      }
      user.phone = isEmpty(req.body.phone) ? undefined : req.body.phone.trim();
    }

    if (Object.hasOwn(req.body, "dateOfBirth")) {
      const value = req.body.dateOfBirth;
      if (isEmpty(value)) {
        user.profile.dateOfBirth = null;
      } else {
        const validDateString = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
        const date = validDateString ? new Date(`${value}T00:00:00.000Z`) : new Date(Number.NaN);
        if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value || date > new Date()) {
          return invalid(res, "Date of birth must be a valid date that is not in the future");
        }
        user.profile.dateOfBirth = date;
      }
    }

    if (Object.hasOwn(req.body, "gender")) {
      const value = req.body.gender;
      if (!isEmpty(value) && !["Male", "Female", "Other"].includes(value)) {
        return invalid(res, "Gender must be Male, Female, or Other");
      }
      user.profile.gender = isEmpty(value) ? null : value;
    }

    await user.save();
    const savedUser = await User.findById(user._id).select("-password");
    return res.status(200).json({ message: "Profile updated successfully", data: serializeProfile(savedUser) });
  } catch (error) {
    return next(error);
  }
};

const updateHealthProfile = async (req, res, next) => {
  try {
    if (!isObject(req.body)) return invalid(res, "Health profile information must be an object");
    if (rejectUnknownFields(req.body, HEALTH_FIELDS, res)) return undefined;
    if (Object.keys(req.body).length === 0) return invalid(res, "At least one health profile field is required");

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User profile not found" });

    const numberFields = {
      heightCm: [30, 300],
      weightKg: [1, 500],
      heartRate: [20, 300],
      bodyTemperature: [30, 45],
    };
    const enums = {
      bloodGroup: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      smokingStatus: ["NEVER", "FORMER", "CURRENT"],
      alcoholConsumption: ["NONE", "OCCASIONAL", "REGULAR"],
      physicalActivityLevel: ["SEDENTARY", "LOW", "MODERATE", "HIGH"],
    };

    for (const [field, value] of Object.entries(req.body)) {
      if (Object.hasOwn(numberFields, field)) {
        if (isEmpty(value)) {
          user.healthProfile[field] = null;
          continue;
        }
        if (typeof value !== "number" || !Number.isFinite(value)) {
          return invalid(res, `${field} must be a finite number`);
        }
        const [minimum, maximum] = numberFields[field];
        if (value < minimum || value > maximum) {
          return invalid(res, `${field} must be between ${minimum} and ${maximum}`);
        }
        user.healthProfile[field] = value;
        continue;
      }

      if (field === "bloodPressure") {
        if (!isEmpty(value) && (typeof value !== "string" || !/^\d{2,3}\s*\/\s*\d{2,3}$/.test(value.trim()))) {
          return invalid(res, "Blood pressure must be in systolic/diastolic format");
        }
        user.healthProfile[field] = isEmpty(value) ? null : value.trim();
        continue;
      }

      if (isEmpty(value)) {
        user.healthProfile[field] = null;
      } else if (typeof value !== "string" || !enums[field].includes(value)) {
        return invalid(res, `${field} must be one of ${enums[field].join(", ")}`);
      } else {
        user.healthProfile[field] = value;
      }
    }

    await user.save();
    const savedUser = await User.findById(user._id).select("-password");
    return res.status(200).json({ message: "Health profile updated successfully", data: serializeProfile(savedUser) });
  } catch (error) {
    return next(error);
  }
};

const updateMedicalHistory = async (req, res, next) => {
  try {
    if (!isObject(req.body)) return invalid(res, "Medical history must be an object");
    if (rejectUnknownFields(req.body, MEDICAL_FIELDS, res)) return undefined;
    if (Object.keys(req.body).length === 0) return invalid(res, "At least one medical history field is required");

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User profile not found" });

    for (const [field, value] of Object.entries(req.body)) {
      if (
        !Array.isArray(value) ||
        value.length > 50 ||
        value.some((entry) => typeof entry !== "string" || !entry.trim() || entry.trim().length > 200)
      ) {
        return invalid(res, `${field} must be an array of up to 50 non-empty strings (200 characters maximum each)`);
      }
      user.medicalHistory[field] = value.map((entry) => entry.trim());
    }

    await user.save();
    const savedUser = await User.findById(user._id).select("-password");
    return res.status(200).json({ message: "Medical history updated successfully", data: serializeProfile(savedUser) });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCurrentUser,
  updateProfile,
  updateHealthProfile,
  updateMedicalHistory,
};
