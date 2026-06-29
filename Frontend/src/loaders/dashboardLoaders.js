import { redirect } from "react-router";
import useAuthStore from "@/store/authStore";
import useStudentStore from "@/store/studentStore";
import {
  getDashboardPath,
  getProfileSetupPath,
  requireAuth,
  requireRole,
} from "@/lib/routes";
import { hasCompletedProfile } from "@/lib/profile";

export async function dashboardIndexLoader() {
  const { user } = await requireAuth();

  if (user.role === "admin") {
    throw redirect(getDashboardPath("admin"));
  }

  const complete = await hasCompletedProfile(user.role);
  if (!complete) {
    throw redirect(getProfileSetupPath(user.role));
  }

  throw redirect(getDashboardPath(user.role));
}

export async function studentDashboardLoader() {
  await requireRole("student");
  await useStudentStore.getState().fetchDashboardData();
  return null;
}

export async function mentorDashboardLoader() {
  await requireRole("mentor");
  return null;
}

export async function adminDashboardLoader() {
  await requireRole("admin");
  return null;
}
