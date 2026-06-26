import { redirect } from "react-router";
import useAuthStore from "@/store/authStore";
import { hasCompletedProfile } from "@/lib/profile";

/**
 * Loader for /profile-setup.
 *
 * 1. Ensures the user is authenticated (redirects to /login if not).
 * 2. If the user has already completed their profile, redirects to /.
 * 3. Returns the user object so the page can use it via useLoaderData().
 */
export async function profileSetupLoader() {
  await useAuthStore.getState().hydrate();

  const { token, user } = useAuthStore.getState();

  if (!token) {
    throw redirect("/login");
  }

  if (user?.role) {
    const complete = await hasCompletedProfile(user.role);
    if (complete) {
      throw redirect("/");
    }
  }

  return { user };
}
