import { useLoaderData } from "react-router";
import StudentProfileSetup from "@/pages/StudentProfileSetup";
import MentorProfileSetup from "@/pages/MentorProfileSetup";

/**
 * Route: /profile-setup
 *
 * The profileSetupLoader already handled:
 *  - Redirecting unauthenticated users to /login
 *  - Redirecting users who already have a complete profile to /
 *
 * By the time this component renders, we know the user is
 * authenticated and their profile is incomplete. We just need
 * to pick the correct setup form based on their role.
 */
export default function ProfileSetup() {
  const { user } = useLoaderData();

  if (user?.role === "mentor") {
    return <MentorProfileSetup />;
  }

  return <StudentProfileSetup />;
}
