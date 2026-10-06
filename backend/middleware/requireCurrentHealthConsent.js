const HealthConsent = require("../models/HealthConsent");
const { HEALTH_CONSENT_VERSION } = require("../config/healthConsent");

const requireCurrentHealthConsent = async (req, res, next) => {
  try {
    const consent = await HealthConsent.exists({
      userId: req.user.userId,
      consentStatus: true,
      consentVersion: HEALTH_CONSENT_VERSION,
    });
    if (!consent) {
      return res.status(403).json({
        message: "Current health information consent is required before using this feature",
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = requireCurrentHealthConsent;
