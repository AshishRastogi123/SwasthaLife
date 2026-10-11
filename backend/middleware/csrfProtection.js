const crypto = require("node:crypto");

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const signatureFor = (nonce) =>
  crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(nonce)
    .digest("hex");

const isValidToken = (token) => {
  if (typeof token !== "string") return false;
  const [nonce, signature, extra] = token.split(".");
  if (!nonce || !signature || extra) return false;
  const expected = Buffer.from(signatureFor(nonce), "hex");
  let received;
  try {
    received = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
};

const createToken = () => {
  const nonce = crypto.randomBytes(32).toString("hex");
  return `${nonce}.${signatureFor(nonce)}`;
};

const cookieSettings = () => {
  const sameSite = (process.env.COOKIE_SAME_SITE || "lax").toLowerCase();
  if (!["strict", "lax", "none"].includes(sameSite)) {
    throw new Error("COOKIE_SAME_SITE must be strict, lax, or none");
  }
  return {
    secure: process.env.NODE_ENV === "production" || sameSite === "none",
    sameSite,
    path: "/",
  };
};

const setCsrfCookie = (res, token) => {
  res.cookie(CSRF_COOKIE, token, {
    ...cookieSettings(),
    httpOnly: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearCsrfCookie = (res) => {
  res.clearCookie(CSRF_COOKIE, cookieSettings());
};

const isAuthRoute = (req) => {
  const pathname = req.path || "";
  return [
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/csrf",
  ].some((route) => pathname === route || pathname.endsWith(route));
};

const csrfProtection = ({ allowedOrigins }) => (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();
  if (isAuthRoute(req)) return next();

  const authorization = req.headers.authorization || "";
  if (/^Bearer\s+\S+$/i.test(authorization)) return next();

  const origin = req.headers.origin;
  if (!origin) return next();
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: "Request could not be verified. Refresh and try again." });
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.get(CSRF_HEADER);
  if (!cookieToken || cookieToken !== headerToken || !isValidToken(cookieToken)) {
    return res.status(403).json({ message: "Request could not be verified. Refresh and try again." });
  }
  return next();
};

csrfProtection.createToken = createToken;
csrfProtection.setCsrfCookie = setCsrfCookie;
csrfProtection.clearCsrfCookie = clearCsrfCookie;
csrfProtection.cookieName = CSRF_COOKIE;

module.exports = csrfProtection;
