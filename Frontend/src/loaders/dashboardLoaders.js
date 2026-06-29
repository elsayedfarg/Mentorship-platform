import { redirect } from "react-router";
import useAuthStore from "@/store/authStore";
import useStudentStore from "@/store/studentStore";
import useMentorStore from "@/store/mentorStore";
import useAdminStore from "@/store/adminStore";
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

export async function studentMentorsLoader() {
  await requireRole("student");
  await useStudentStore.getState().fetchMentors({ sort_by: "average_rating" });
  return null;
}

export async function studentMentorDetailLoader({ params }) {
  await requireRole("student");
  await useStudentStore.getState().fetchMentor(params.mentorId);
  return null;
}

export async function studentSessionsLoader() {
  await requireRole("student");
  await useStudentStore.getState().fetchSessions();
  return null;
}

export async function studentProfileLoader() {
  await requireRole("student");
  await useStudentStore.getState().fetchProfile();
  return null;
}

export async function studentSettingsLoader() {
  await requireRole("student");
  return null;
}

export async function mentorDashboardLoader() {
  await requireRole("mentor");
  await Promise.all([
    useMentorStore.getState().fetchSessions(),
    useMentorStore.getState().fetchAvailability(),
  ]);
  return null;
}

export async function mentorSessionsLoader() {
  await requireRole("mentor");
  await useMentorStore.getState().fetchSessions();
  return null;
}

export async function mentorAvailabilityLoader() {
  await requireRole("mentor");
  await useMentorStore.getState().fetchAvailability();
  return null;
}

export async function mentorProfileLoader() {
  await requireRole("mentor");
  await useMentorStore.getState().fetchProfile();
  return null;
}

export async function mentorSettingsLoader() {
  await requireRole("mentor");
  return null;
}

export async function adminDashboardLoader() {
  await requireRole("admin");
  await Promise.all([
    useAdminStore.getState().fetchPendingMentors(),
    useAdminStore.getState().fetchStackStats(),
  ]);
  return null;
}

export async function adminUsersLoader() {
  await requireRole("admin");
  await useAdminStore.getState().fetchUsers({ role: "student" });
  return null;
}

export async function adminReportsLoader() {
  await requireRole("admin");
  await Promise.all([
    useAdminStore.getState().fetchPendingMentors(),
    useAdminStore.getState().fetchStackStats(),
  ]);
  return null;
}

export async function adminSettingsLoader() {
  await requireRole("admin");
  return null;
}
