const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const AUTH_PATHS_WITHOUT_SESSION_EXPIRY = [
  "/api/auth/csrf",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/me",
  "/api/auth/logout",
];

const STATUS_MESSAGES = {
  400: "Please review the information and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested information could not be found.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "A server error occurred. Please try again later.",
  502: "The service could not complete your request. Please try again later.",
  503: "The service is temporarily unavailable. Please try again later.",
};

export class ApiError extends Error {
  constructor(message, { status = 0, code = "API_ERROR" } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

let csrfToken;
let csrfRequest;

const parseResponse = async (response) => {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export async function getCsrfToken({ signal } = {}) {
  if (csrfToken) return csrfToken;
  if (!csrfRequest) {
    csrfRequest = fetch(`${API_BASE}/api/auth/csrf`, {
      credentials: "include",
      signal,
    }).then(async (response) => {
      const body = await parseResponse(response);
      if (!response.ok || typeof body?.csrfToken !== "string") {
        throw new ApiError("Could not establish a secure session. Please try again.", {
          status: response.status,
          code: "CSRF_INITIALIZATION_FAILED",
        });
      }
      csrfToken = body.csrfToken;
      return csrfToken;
    }).finally(() => {
      csrfRequest = undefined;
    });
  }
  return csrfRequest;
}

export function clearCsrfToken() {
  csrfToken = undefined;
  csrfRequest = undefined;
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!SAFE_METHODS.has(method)) {
    headers.set("X-CSRF-Token", await getCsrfToken({ signal: options.signal }));
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      method,
      credentials: "include",
      headers,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Could not reach the service. Check your connection and try again.", {
      code: "NETWORK_ERROR",
    });
  }

  const body = await parseResponse(response);
  if (!response.ok) {
    const csrfFailure = response.status === 403 && body?.message?.includes("Request could not be verified");
    const isLoginFailure = response.status === 401 && path.startsWith("/api/auth/login");
    const message = csrfFailure
      ? "Your secure request token expired. Please try again."
      : isLoginFailure
        ? "Email or password is incorrect."
      : STATUS_MESSAGES[response.status] || "The request could not be completed. Please try again.";
    if (
      response.status === 401 &&
      !AUTH_PATHS_WITHOUT_SESSION_EXPIRY.some((authPath) => path.startsWith(authPath))
    ) {
      window.dispatchEvent(new Event("auth:session-expired"));
    }
    throw new ApiError(message, {
      status: response.status,
      code: csrfFailure ? "CSRF_INVALID" : `HTTP_${response.status}`,
    });
  }
  return body;
}

export { API_BASE };
