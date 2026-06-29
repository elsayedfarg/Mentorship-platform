import { redirect } from "react-router";
import {
  requireAuth,
  requireIncompleteProfile,
  getDashboardPath,
  getProfileSetupPath,
} from "@/lib/routes";
import { hasCompletedProfile } from "@/lib/profile";

export async function profileSetupRedirectLoader() {
  const { user } = await requireAuth();

  if (user.role === "admin") {
    throw redirect(getDashboardPath("admin"));
  }

  const complete = await hasCompletedProfile(user.role);
  if (complete) {
    throw redirect(getDashboardPath(user.role));
  }

  throw redirect(getProfileSetupPath(user.role));
}

export async function studentProfileSetupLoader() {
  const { user } = await requireIncompleteProfile("student");
  return { user };
}

export async function mentorProfileSetupLoader() {
  const { user } = await requireIncompleteProfile("mentor");
  return { user };
}
