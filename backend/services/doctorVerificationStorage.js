const crypto = require("node:crypto");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const FILE_TYPES = {
  ".pdf": { mimeType: "application/pdf", signature: (buffer) => buffer.subarray(0, 5).toString() === "%PDF-" },
  ".jpg": { mimeType: "image/jpeg", signature: (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  ".jpeg": { mimeType: "image/jpeg", signature: (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  ".png": { mimeType: "image/png", signature: (buffer) => buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
};

const getConfig = () => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DOCTOR_VERIFICATION_BUCKET } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const error = new Error("Doctor document storage is not configured");
    error.statusCode = 503;
    throw error;
  }
  const baseUrl = new URL(SUPABASE_URL);
  if (!["https:", "http:"].includes(baseUrl.protocol)) {
    throw new Error("SUPABASE_URL must use HTTP or HTTPS");
  }
  return {
    baseUrl: baseUrl.toString().replace(/\/$/, ""),
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
    bucket: SUPABASE_DOCTOR_VERIFICATION_BUCKET || "doctor-verification-documents",
  };
};

const storageUrl = (baseUrl, operation, bucket, objectPath = "") =>
  `${baseUrl}/storage/v1/object/${operation}/${encodeURIComponent(bucket)}${objectPath ? `/${objectPath.split("/").map(encodeURIComponent).join("/")}` : ""}`;

const storageRequest = async (url, options, serviceRoleKey) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    const error = new Error(`Doctor document storage request failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`);
    error.statusCode = response.status === 413 ? 413 : 502;
    throw error;
  }
  return response.status === 204 ? null : response.json();
};

const inspectDocument = (file) => {
  if (!file || !Buffer.isBuffer(file.buffer)) {
    const error = new Error("A license or registration certificate is required");
    error.statusCode = 400;
    throw error;
  }
  if (file.size < 1 || file.size > MAX_FILE_SIZE) {
    const error = new Error("The verification document must be no larger than 5 MB");
    error.statusCode = 400;
    throw error;
  }

  const extension = file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0];
  const expectedType = FILE_TYPES[extension];
  if (!expectedType || file.mimetype !== expectedType.mimeType || !expectedType.signature(file.buffer)) {
    const error = new Error("Upload a valid PDF, JPG, JPEG, or PNG verification document");
    error.statusCode = 400;
    throw error;
  }
  return { extension, mimeType: expectedType.mimeType };
};

const uploadDoctorDocument = async (userId, file) => {
  const { extension, mimeType } = inspectDocument(file);
  const config = getConfig();
  const storagePath = `${userId}/${crypto.randomUUID()}${extension}`;
  await storageRequest(
    storageUrl(config.baseUrl, "", config.bucket, storagePath),
    {
      method: "POST",
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(file.size),
        "x-upsert": "false",
      },
      body: file.buffer,
    },
    config.serviceRoleKey
  );
  return {
    storagePath,
    originalName: file.originalname.replace(/[^\w .()-]/g, "_").slice(0, 255),
    mimeType,
    sizeBytes: file.size,
    uploadedAt: new Date(),
  };
};

const deleteDoctorDocument = async (storagePath) => {
  if (!storagePath) return;
  const config = getConfig();
  await storageRequest(
    storageUrl(config.baseUrl, "", config.bucket),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefixes: [storagePath] }),
    },
    config.serviceRoleKey
  );
};

const createDoctorDocumentSignedUrl = async (storagePath, expiresIn = 300) => {
  const config = getConfig();
  const result = await storageRequest(
    storageUrl(config.baseUrl, "sign", config.bucket, storagePath),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn }),
    },
    config.serviceRoleKey
  );
  const signedPath = result?.signedURL || result?.signedUrl;
  if (typeof signedPath !== "string") throw new Error("Storage did not return a signed document URL");
  if (/^https?:\/\//i.test(signedPath)) return signedPath;
  const normalizedPath = signedPath.startsWith("/storage/v1/")
    ? signedPath
    : `/storage/v1/${signedPath.replace(/^\/+/, "")}`;
  return new URL(normalizedPath, config.baseUrl).toString();
};

const getUploadMiddleware = () => {
  const multer = require("multer");
  const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: 1, fields: 1, fieldSize: 64 * 1024 },
    fileFilter(req, file, callback) {
      const extension = file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0];
      if (!allowedTypes.has(file.mimetype) || !FILE_TYPES[extension] || FILE_TYPES[extension].mimeType !== file.mimetype) {
        const error = new Error("Upload a PDF, JPG, JPEG, or PNG verification document");
        error.statusCode = 400;
        callback(error);
        return;
      }
      callback(null, true);
    },
  }).single("verificationDocument");
};

module.exports = {
  MAX_FILE_SIZE,
  inspectDocument,
  uploadDoctorDocument,
  deleteDoctorDocument,
  createDoctorDocumentSignedUrl,
  getUploadMiddleware,
};
