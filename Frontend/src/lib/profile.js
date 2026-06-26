import api from "@/lib/apiClient";

export function isProfileComplete(profile) {
  return Boolean(profile?.name?.trim() && profile.name.trim().length >= 2);
}

export async function fetchRoleProfile(role) {
  const endpoint =
    role === "mentor" ? "/api/mentors/profile" : "/api/students/profile";

  const response = await api.get(endpoint);
  return response.data.data;
}

export async function hasCompletedProfile(role) {
  if (!role || role === "admin") return true;

  try {
    const profile = await fetchRoleProfile(role);
    return isProfileComplete(profile);
  } catch {
    return false;
  }
}
