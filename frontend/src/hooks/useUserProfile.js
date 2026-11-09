import { useCallback, useEffect, useState } from "react";
import { fetchUserProfile } from "../services/userProfile";
import { useAuth } from "../auth/AuthContext";

export function useUserProfile() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id;
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async ({ signal } = {}) => {
    if (!userId) {
      setProfile(null);
      setError("");
      setIsLoading(false);
      return null;
    }
    setIsLoading(true);
    setError("");
    try {
      const currentProfile = await fetchUserProfile({ signal });
      setProfile(currentProfile);
      return currentProfile;
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message || "Unable to load your saved profile.");
      }
      return null;
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isAuthLoading) return undefined;
    if (!userId) {
      setProfile(null);
      setError("");
      setIsLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    refresh({ signal: controller.signal });
    return () => controller.abort();
  }, [isAuthLoading, refresh, userId]);

  return { profile, isLoading, error, refresh };
}
