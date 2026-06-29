import { redirect } from "react-router";
import useAuthStore from "@/store/authStore";
import { hasCompletedProfile } from "@/lib/profile";

export const DASHBOARD_PATHS = {
  student: "/dashboard/student",
  mentor: "/dashboard/mentor",
  admin: "/dashboard/admin",
};

export const PROFILE_SETUP_PATHS = {
  student: "/profile-setup/student",
  mentor: "/profile-setup/mentor",
};

export function getDashboardPath(role) {
  return DASHBOARD_PATHS[role] ?? "/login";
}

export function getProfileSetupPath(role) {
  return PROFILE_SETUP_PATHS[role] ?? "/login";
}

export async function resolvePostAuthPath() {
  await useAuthStore.getState().hydrate();

  const { user, token } = useAuthStore.getState();

  if (!token || !user?.role) {
    return "/login";
  }

  if (user.role === "admin") {
    return getDashboardPath("admin");
  }

  const complete = await hasCompletedProfile(user.role);
  return complete
    ? getDashboardPath(user.role)
    : getProfileSetupPath(user.role);
}

export async function requireAuth() {
  await useAuthStore.getState().hydrate();

  const { user, token } = useAuthStore.getState();

  if (!token) {
    throw redirect("/login");
  }

  return { user };
}

export async function requireRole(expectedRole) {
  const { user } = await requireAuth();

  if (user.role !== expectedRole) {
    throw redirect(getDashboardPath(user.role) ?? "/login");
  }

  if (expectedRole !== "admin") {
    const complete = await hasCompletedProfile(user.role);
    if (!complete) {
      throw redirect(getProfileSetupPath(user.role));
    }
  }

  return { user };
}

export async function requireIncompleteProfile(expectedRole) {
  const { user } = await requireAuth();

  if (user.role === "admin") {
    throw redirect(getDashboardPath("admin"));
  }

  if (user.role !== expectedRole) {
    const complete = await hasCompletedProfile(user.role);
    throw redirect(
      complete ? getDashboardPath(user.role) : getProfileSetupPath(user.role),
    );
  }

  const complete = await hasCompletedProfile(user.role);
  if (complete) {
    throw redirect(getDashboardPath(user.role));
  }

  return { user };
}

export const NAV_LINKS = {
  student: [
    { label: "Dashboard", path: DASHBOARD_PATHS.student, icon: "dashboard" },
    {
      label: "Browse Mentors",
      path: "/dashboard/student/mentors",
      icon: "explore",
    },
    {
      label: "My Sessions",
      path: "/dashboard/student/sessions",
      icon: "event_note",
    },
    { label: "Profile", path: "/dashboard/student/profile", icon: "person" },
    {
      label: "Settings",
      path: "/dashboard/student/settings",
      icon: "settings",
    },
  ],
  mentor: [
    { label: "Dashboard", path: DASHBOARD_PATHS.mentor, icon: "dashboard" },
    {
      label: "Upcoming Sessions",
      path: "/dashboard/mentor/sessions",
      icon: "event_note",
    },
    {
      label: "Availability",
      path: "/dashboard/mentor/availability",
      icon: "calendar_month",
    },
    { label: "Profile", path: "/dashboard/mentor/profile", icon: "person" },
    {
      label: "Settings",
      path: "/dashboard/mentor/settings",
      icon: "settings",
    },
  ],
  admin: [
    { label: "Dashboard", path: DASHBOARD_PATHS.admin, icon: "dashboard" },
    { label: "Users Management", path: "/dashboard/admin/users", icon: "group" },
    { label: "Reports", path: "/dashboard/admin/reports", icon: "assessment" },
    { label: "Stacks", path: "/dashboard/admin/stacks", icon: "category" },
    {
      label: "Settings",
      path: "/dashboard/admin/settings",
      icon: "settings",
    },
  ],
};
