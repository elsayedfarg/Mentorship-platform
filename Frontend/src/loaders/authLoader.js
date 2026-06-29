import { redirect } from "react-router";
import { requireAuth, resolvePostAuthPath } from "@/lib/routes";

export async function requireAuthLoader() {
  await requireAuth();
  return null;
}

export async function guestOnlyLoader() {
  const destination = await resolvePostAuthPath();
  if (destination !== "/login") {
    throw redirect(destination);
  }
  return null;
}

export async function homeLoader() {
  const destination = await resolvePostAuthPath();
  if (destination !== "/login") {
    throw redirect(destination);
  }
  return null;
}
