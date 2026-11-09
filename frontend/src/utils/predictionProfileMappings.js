const hasValue = (value) => value !== undefined && value !== null && value !== "";

const putIfPresent = (target, key, value, convert = String) => {
  if (hasValue(value)) target[key] = convert(value);
};

const dateOnly = (value) => (typeof value === "string" ? value.slice(0, 10) : "");

export function mapProfileToHeartDisease(profile) {
  const mapped = {};
  const age = profile?.profile?.age;
  if (Number.isInteger(age) && age >= 1 && age <= 120) mapped.age = String(age);

  if (profile?.profile?.gender === "Female") mapped.sex = "0";
  if (profile?.profile?.gender === "Male") mapped.sex = "1";

  const bloodPressure = profile?.healthProfile?.bloodPressure;
  if (typeof bloodPressure === "string") {
    const match = bloodPressure.match(/^\s*(\d{2,3})\s*\/\s*\d{2,3}\s*$/);
    const systolic = match ? Number(match[1]) : NaN;
    if (Number.isInteger(systolic) && systolic >= 50 && systolic <= 250) {
      mapped.trestbps = String(systolic);
    }
  }
  return mapped;
}

export function mapProfileToSymptomAssessment(profile) {
  const mapped = {};
  const nameParts = (profile?.name || "").trim().split(/\s+/).filter(Boolean);
  if (nameParts.length) mapped.firstName = nameParts.shift();
  if (nameParts.length) mapped.lastName = nameParts.join(" ");

  putIfPresent(mapped, "age", profile?.profile?.age);
  putIfPresent(mapped, "gender", profile?.profile?.gender);
  putIfPresent(mapped, "dob", profile?.profile?.dateOfBirth, dateOnly);
  putIfPresent(mapped, "phone", profile?.phone);

  const healthProfile = profile?.healthProfile || {};
  putIfPresent(mapped, "height", healthProfile.heightCm);
  putIfPresent(mapped, "weight", healthProfile.weightKg);
  putIfPresent(mapped, "bp", healthProfile.bloodPressure);
  putIfPresent(mapped, "pulse", healthProfile.heartRate);

  const medicalHistory = profile?.medicalHistory || {};
  if (Array.isArray(medicalHistory.familyMedicalHistory) && medicalHistory.familyMedicalHistory.length) {
    mapped.familyHistory = medicalHistory.familyMedicalHistory.join(", ");
  }
  if (Array.isArray(medicalHistory.allergies) && medicalHistory.allergies.length) {
    mapped.allergies = medicalHistory.allergies.join(", ");
  }
  return mapped;
}

export function mapProfileToDiseaseAssessment(profile) {
  const mapped = {};
  putIfPresent(mapped, "fullName", profile?.name);
  putIfPresent(mapped, "age", profile?.profile?.age);
  putIfPresent(mapped, "gender", profile?.profile?.gender);
  putIfPresent(mapped, "dob", profile?.profile?.dateOfBirth, dateOnly);
  putIfPresent(mapped, "mobile", profile?.phone);
  putIfPresent(mapped, "email", profile?.email);

  const healthProfile = profile?.healthProfile || {};
  putIfPresent(mapped, "heightCm", healthProfile.heightCm);
  putIfPresent(mapped, "weightKg", healthProfile.weightKg);
  putIfPresent(mapped, "bloodPressure", healthProfile.bloodPressure);

  const smoking = { NEVER: "No", FORMER: "Former", CURRENT: "Yes" };
  const alcohol = { NONE: "No", OCCASIONAL: "Yes", REGULAR: "Yes" };
  const activity = { SEDENTARY: "None", LOW: "Low", MODERATE: "Moderate", HIGH: "High" };
  putIfPresent(mapped, "smoking", smoking[healthProfile.smokingStatus]);
  putIfPresent(mapped, "alcohol", alcohol[healthProfile.alcoholConsumption]);
  putIfPresent(mapped, "physicalActivity", activity[healthProfile.physicalActivityLevel]);
  return mapped;
}
