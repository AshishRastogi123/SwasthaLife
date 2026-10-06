const HealthConsent = require("../models/HealthConsent");
const { HEALTH_CONSENT_VERSION } = require("../config/healthConsent");

const getHealthConsent = async (req, res) => {
  const consent = await HealthConsent.findOne({ userId: req.user.userId }).lean();
  const isCurrent = consent?.consentVersion === HEALTH_CONSENT_VERSION;
  res.json({
    data: {
      consentStatus: Boolean(isCurrent && consent.consentStatus),
      consentTimestamp: consent?.consentTimestamp || null,
      consentVersion: consent?.consentVersion || null,
      currentVersion: HEALTH_CONSENT_VERSION,
    },
  });
};

const setHealthConsent = async (req, res) => {
  if (typeof req.body.consentStatus !== "boolean") {
    return res.status(400).json({ message: "consentStatus must be a boolean" });
  }
  const consent = await HealthConsent.findOneAndUpdate(
    { userId: req.user.userId },
    {
      $set: {
        consentStatus: req.body.consentStatus,
        consentTimestamp: new Date(),
        consentVersion: HEALTH_CONSENT_VERSION,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json({
    data: {
      consentStatus: consent.consentStatus,
      consentTimestamp: consent.consentTimestamp,
      consentVersion: consent.consentVersion,
    },
  });
};

module.exports = { getHealthConsent, setHealthConsent };
