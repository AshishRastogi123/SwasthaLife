import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, clearCsrfToken, getCsrfToken } from "../api";

const AuthContext = createContext(null);

const clearLegacyCredentials = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");

  const refreshSession = useCallback(async ({ signal } = {}) => {
    setIsLoading(true);
    setSessionError("");
    try {
      await getCsrfToken({ signal });
      const result = await apiRequest("/api/auth/me", { signal });
      setUser(result.data);
      return result.data;
    } catch (error) {
      if (error.name === "AbortError") return null;
      setUser(null);
      if (error.status !== 401) setSessionError(error.message);
      return null;
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    clearLegacyCredentials();
    const controller = new AbortController();
    refreshSession({ signal: controller.signal });
    const expireSession = () => {
      setUser(null);
      clearLegacyCredentials();
    };
    window.addEventListener("auth:session-expired", expireSession);
    return () => {
      controller.abort();
      window.removeEventListener("auth:session-expired", expireSession);
    };
  }, [refreshSession]);

  const login = useCallback(async (credentials) => {
    const result = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (!result?.user) {
      throw new Error("The server did not return an authenticated user.");
    }
    clearLegacyCredentials();
    setSessionError("");
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
      if (error.status !== 401) throw error;
    }
    clearLegacyCredentials();
    clearCsrfToken();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    isLoading,
    sessionError,
    login,
    logout,
    refreshSession,
  }), [user, isLoading, sessionError, login, logout, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
