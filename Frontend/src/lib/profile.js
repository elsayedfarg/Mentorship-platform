import api from "@/lib/apiClient";

export function isProfileComplete(profile, role) {
  if (!profile?.name?.trim() || profile.name.trim().length < 2) {
    return false;
  }

  if (role === "mentor") {
    return (
      Boolean(profile.title?.trim() && profile.title.trim().length >= 3) &&
      Boolean(profile.bio?.trim() && profile.bio.trim().length >= 10) &&
      Number(profile.hourly_rate) > 0
    );
  }

  return true;
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
    return isProfileComplete(profile, role);
  } catch {
    return false;
  }
}
