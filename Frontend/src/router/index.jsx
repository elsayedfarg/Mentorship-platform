import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import StudentProfileSetup from "@/pages/StudentProfileSetup";
import MentorProfileSetup from "@/pages/MentorProfileSetup";
import Home from "@/pages/Home";
import StudentDashboard from "@/pages/Student/StudentDashboard";
import MentorDashboard from "@/pages/Mentor/MentorDashboard";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/NotFound";
import {
  requireAuthLoader,
  guestOnlyLoader,
  homeLoader,
} from "@/loaders/authLoader";
import {
  profileSetupRedirectLoader,
  studentProfileSetupLoader,
  mentorProfileSetupLoader,
} from "@/loaders/profileSetupLoader";
import {
  dashboardIndexLoader,
  studentDashboardLoader,
  mentorDashboardLoader,
  adminDashboardLoader,
} from "@/loaders/dashboardLoaders";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: homeLoader,
      },
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
      {
        path: "/profile-setup",
        loader: profileSetupRedirectLoader,
      },
      {
        path: "/profile-setup/student",
        element: <StudentProfileSetup />,
        loader: studentProfileSetupLoader,
      },
      {
        path: "/profile-setup/mentor",
        element: <MentorProfileSetup />,
        loader: mentorProfileSetupLoader,
      },
      {
        path: "/dashboard",
        element: <MainLayout />,
        loader: requireAuthLoader,
        children: [
          {
            index: true,
            loader: dashboardIndexLoader,
            element: null,
          },
          {
            path: "student",
            element: <StudentDashboard />,
            loader: studentDashboardLoader,
          },
          {
            path: "mentor",
            element: <MentorDashboard />,
            loader: mentorDashboardLoader,
          },
          {
            path: "admin",
            element: <AdminDashboard />,
            loader: adminDashboardLoader,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
