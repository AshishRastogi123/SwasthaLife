const parseRegistrationForm = (req, res, next) => {
  if (!req.is("multipart/form-data")) return next();
  if (typeof req.body.registrationData !== "string") {
    return res.status(400).json({ message: "Registration details are required" });
  }
  try {
    const registrationData = JSON.parse(req.body.registrationData);
    if (!registrationData || typeof registrationData !== "object" || Array.isArray(registrationData)) {
      return res.status(400).json({ message: "Registration details must be an object" });
    }
    req.body = registrationData;
    return next();
  } catch {
    return res.status(400).json({ message: "Registration details must contain valid JSON" });
  }
};

module.exports = parseRegistrationForm;
