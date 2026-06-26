import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProfileSetup from "@/pages/ProfileSetup";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { requireAuthLoader, guestOnlyLoader } from "@/loaders/authLoader";
import { profileSetupLoader } from "@/loaders/profileSetupLoader";

const router = createBrowserRouter([
  {
    // Root layout wraps every route (Toaster, ThemeProvider, etc.)
    element: <RootLayout />,
    children: [
      // ── Public / guest-only routes ──────────────────────────────────
      {
        path: "/login",
        element: <Login />,
        loader: guestOnlyLoader,
      },
      {
        path: "/register",
        element: <Register />,
        loader: guestOnlyLoader,
      },

      // ── Protected routes ────────────────────────────────────────────
      {
        path: "/",
        element: <Home />,
        loader: requireAuthLoader,
      },
      {
        path: "/profile-setup",
        element: <ProfileSetup />,
        loader: profileSetupLoader,
      },

      // ── Catch-all ───────────────────────────────────────────────────
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
