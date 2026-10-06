const { isObjectId } = require("./validateDomains");

exports.validateSignup = (req, res, next) => {
  const { name, email, password, role, confirmPassword, phone, departmentId, licenseNumber } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ message: "A valid name is required" });
  }
  if (phone !== undefined && typeof phone !== "string") {
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
