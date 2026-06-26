import { redirect } from "react-router";
import useAuthStore from "@/store/authStore";

/**
 * Loader that hydrates the auth state from a stored token.
 * Runs before every page render; redirects to /login if the
 * route is protected and the user is not authenticated.
 */
export async function requireAuthLoader() {
  // Hydrate store from localStorage / API
  await useAuthStore.getState().hydrate();

  const token = useAuthStore.getState().token;

  if (!token) {
    throw redirect("/login");
  }

  return null;
}

/**
 * Loader for public-only routes (login / register).
 * Redirects authenticated users to the home page.
 */
export async function guestOnlyLoader() {
  await useAuthStore.getState().hydrate();

  const token = useAuthStore.getState().token;

  if (token) {
    throw redirect("/");
  }

  return null;
}
