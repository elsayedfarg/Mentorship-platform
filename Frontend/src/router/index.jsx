import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import StudentProfileSetup from "@/pages/StudentProfileSetup";
import MentorProfileSetup from "@/pages/MentorProfileSetup";
import Home from "@/pages/Home";
import StudentDashboard from "@/pages/Student/StudentDashboard";
import BrowseMentors from "@/pages/Student/BrowseMentors";
import MentorDetail from "@/pages/Student/MentorDetail";
import MySessions from "@/pages/Student/MySessions";
import StudentProfile from "@/pages/Student/StudentProfile";
import StudentSettings from "@/pages/Student/StudentSettings";
import MentorDashboard from "@/pages/Mentor/MentorDashboard";
import MentorSessions from "@/pages/Mentor/MentorSessions";
import MentorAvailability from "@/pages/Mentor/MentorAvailability";
import MentorProfile from "@/pages/Mentor/MentorProfile";
import MentorSettings from "@/pages/Mentor/MentorSettings";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import UsersManagement from "@/pages/Admin/UsersManagement";
import AdminReports from "@/pages/Admin/AdminReports";
import AdminSettings from "@/pages/Admin/AdminSettings";
import AdminStacks from "@/pages/Admin/AdminStacks";
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
  studentMentorsLoader,
  studentMentorDetailLoader,
  studentSessionsLoader,
  studentProfileLoader,
  studentSettingsLoader,
  mentorDashboardLoader,
  mentorSessionsLoader,
  mentorAvailabilityLoader,
  mentorProfileLoader,
  mentorSettingsLoader,
  adminDashboardLoader,
  adminUsersLoader,
  adminReportsLoader,
  adminSettingsLoader,
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
            path: "student/mentors",
            element: <BrowseMentors />,
            loader: studentMentorsLoader,
          },
          {
            path: "student/mentors/:mentorId",
            element: <MentorDetail />,
            loader: studentMentorDetailLoader,
          },
          {
            path: "student/sessions",
            element: <MySessions />,
            loader: studentSessionsLoader,
          },
          {
            path: "student/profile",
            element: <StudentProfile />,
            loader: studentProfileLoader,
          },
          {
            path: "student/settings",
            element: <StudentSettings />,
            loader: studentSettingsLoader,
          },
          {
            path: "admin/stacks",
            element: <AdminStacks />,
            loader: adminReportsLoader,
          },
          {
            path: "mentor",
            element: <MentorDashboard />,
            loader: mentorDashboardLoader,
          },
          {
            path: "mentor/sessions",
            element: <MentorSessions />,
            loader: mentorSessionsLoader,
          },
          {
            path: "mentor/availability",
            element: <MentorAvailability />,
            loader: mentorAvailabilityLoader,
          },
          {
            path: "mentor/profile",
            element: <MentorProfile />,
            loader: mentorProfileLoader,
          },
          {
            path: "mentor/settings",
            element: <MentorSettings />,
            loader: mentorSettingsLoader,
          },
          {
            path: "admin",
            element: <AdminDashboard />,
            loader: adminDashboardLoader,
          },
          {
            path: "admin/users",
            element: <UsersManagement />,
            loader: adminUsersLoader,
          },
          {
            path: "admin/reports",
            element: <AdminReports />,
            loader: adminReportsLoader,
          },
          {
            path: "admin/settings",
            element: <AdminSettings />,
            loader: adminSettingsLoader,
          },
          {
            path: "*",
            element: <NotFound />,
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
