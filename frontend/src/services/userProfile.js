import { apiRequest } from "../api";

export async function fetchUserProfile({ signal } = {}) {
  const response = await apiRequest("/api/users/profile", { signal });
  return response.data;
}
