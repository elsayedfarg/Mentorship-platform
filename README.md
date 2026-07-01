# Academic Mentorship Platform

A full-stack mentorship booking platform that connects students with verified mentors. The project is split into a Node.js/Express backend and a React/Vite frontend.

## Project Structure

- `Backend/` - Express API server with MongoDB integration.
- `Frontend/` - React SPA built with Vite, Tailwind CSS, Zustand state management, and React Router data loaders.
- `UI/` - Design and documentation assets for the platform.

## Technology Stack

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT authentication
- Joi validation
- Helmet, HPP, XSS sanitizer for security
- Winston logging
- Rate limiting with `express-rate-limit`

### Frontend

- React 19
- Vite
- Tailwind CSS v4
- Zustand for state management
- React Router v8 with loaders and nested layout routes
- `axios` for API communication
- `next-themes` for theme support
- `i18next`/`react-i18next` dependencies available (not wired into pages yet)

## Backend Overview

### Entry points

- `Backend/index.js` - connects to MongoDB, starts the server, and handles graceful shutdown.
- `Backend/app.js` - configures middleware and mounts API routes.

### Core middleware

- `Backend/middlewares/authenticate.js` - verifies JWT tokens.
- `Backend/middlewares/restrictTo.js` - enforces role-based access.
- `Backend/middlewares/validate.js` - validates incoming requests with Joi schemas.
- `Backend/middlewares/rateLimiter.js` - rate limits authentication and general API requests.
- `Backend/middlewares/errorHandler.js` - catches errors and sends JSON responses.

### Main API route groups

- `POST /api/auth/register` - create a new user account.
- `POST /api/auth/login` - authenticate and receive a JWT.
- `GET /api/auth/profile` - get the authenticated user's profile.

- `GET /api/students/profile` - get student profile data.
- `PUT /api/students/profile` - update student profile (student-only).
- `GET /api/students` - list all students (admin-only).

- `GET /api/mentors` - list verified mentors, with optional search, sort, and filters.
- `POST /api/mentors/profile` - create mentor profile (mentor-only).
- `GET /api/mentors/profile` - get current mentor profile (mentor-only).
- `PUT /api/mentors/profile` - update mentor profile (mentor-only).
- `GET /api/mentors/me/availability` - get mentor availability blocks (mentor-only).
- `POST /api/mentors/availability` - add availability block (mentor-only).
- `DELETE /api/mentors/availability/:blockId` - remove mentor availability block (mentor-only).
- `GET /api/mentors/:id/availability` - get mentor availability or available slots for a date.
- `GET /api/mentors/:id` - get mentor profile by mentor ID.
- `GET /api/mentors/stack/:stackId` - list mentors by stack.

- `GET /api/stacks` - list technology stacks.
- `GET /api/stacks/stats` - list stacks with mentor counts.
- `GET /api/stacks/:id` - get stack details.
- `POST /api/stacks` - create stack (admin-only).
- `PUT /api/stacks/:id` - update stack (admin-only).
- `DELETE /api/stacks/:id` - delete stack (admin-only).

- `POST /api/sessions/book` - book a session with a mentor.
- `GET /api/sessions` - list sessions for current user.
- `PUT /api/sessions/:sessionId/status` - update session status.

- `GET /api/admin/users` - list users with paging and role filter (admin-only).
- `PUT /api/admin/users/:userId/status` - update user verification status (admin-only).
- `GET /api/admin/mentors/pending` - list pending mentor approvals (admin-only).

### Data models

#### User

- `email`, `password_hash`, `role` (`admin`, `mentor`, `student`), `created_at`
- Passwords hashed with bcrypt.

#### StudentProfile

- `user_id` (ref `User`), `name`, `created_at`

#### MentorProfile

- `user_id` (ref `User`), `stack_id` (ref `Stack`), `name`, `title`, `bio`, `hourly_rate`, `average_rating`, `is_verified`

#### MentorAvailability

- `mentor_id` (ref `MentorProfile`), `day_of_week`, `start_time`, `end_time`

#### Session

- `student_id` (ref `StudentProfile`), `mentor_id` (ref `MentorProfile`), `start_time`, `end_time`, `description`, `status`

#### Stack

- `name`, `description`, `icon`, `color`

## Frontend Overview

### Entry points

- `Frontend/src/main.jsx` - mounts the React app and wraps it with `ThemeProvider`.
- `Frontend/src/router/index.jsx` - defines app routes using `createBrowserRouter`.
- `Frontend/src/layouts/RootLayout.jsx` - root layout with `<Outlet />` and global `Toaster`.
- `Frontend/src/layouts/AuthLayout.jsx` - login/register layout with a home link and theme toggle.

### Theme support

- `Frontend/src/components/ThemeProvider.jsx` wraps `next-themes`.
- `Frontend/src/components/common/ThemeToggle.jsx` toggles light/dark themes.

### State management and API layer

- `Frontend/src/store/authStore.js` - manages authentication state, login/register/logout, and token hydration.
- `Frontend/src/store/studentStore.js` - manages student profile, mentor search, session booking, and dashboard data.
- `Frontend/src/store/mentorStore.js` - manages mentor profile, availability, and mentor sessions.
- `Frontend/src/store/adminStore.js` - manages admin user listings and stack statistics.
- `Frontend/src/lib/apiClient.js` - Axios instance with JWT header injector and response handling.

### Routing and loaders

- `Frontend/src/lib/routes.js` - route helpers and auth/profile setup redirects.
- `Frontend/src/loaders/authLoader.js` - protects guest-only and authenticated routes.
- `Frontend/src/loaders/dashboardLoaders.js` - loads dashboard data before rendering pages.
- `Frontend/src/loaders/profileSetupLoader.js` - redirects users to profile setup if needed.

### Selected pages

- `Frontend/src/pages/Login.jsx` and `Frontend/src/pages/Register.jsx` - auth forms with `zod` validation and `AuthLayout`.
- `Frontend/src/pages/Student/BrowseMentors.jsx` - live mentor search and sorting with debounced fetch.
- `Frontend/src/pages/Student/MentorDetail.jsx` - mentor detail view.
- `Frontend/src/pages/Student/MySessions.jsx` - student bookings.
- `Frontend/src/pages/Student/StudentProfile.jsx` and `StudentProfileSetup.jsx` - student profile management.
- `Frontend/src/pages/Mentor/*` - mentor dashboard, sessions, availability, and profile pages.
- `Frontend/src/pages/Admin/*` - admin dashboard, user management, reports, and stack management.

## Setup Instructions

### Backend

1. Open a terminal and navigate to `Backend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=mentorship_platform
   JWT_SECRET=your_jwt_secret_here
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal and navigate to `Frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` or `.env.local` file with:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend

- `PORT` - port for Express server.
- `MONGO_URI` - MongoDB connection URI.
- `DB_NAME` - MongoDB database name.
- `JWT_SECRET` - secret for signing JWT tokens.

### Frontend

- `VITE_API_URL` - backend API base URL.

## Available Scripts

### Backend

- `npm run dev` - start backend with `nodemon`.
- `npm start` - start backend with Node.

### Frontend

- `npm run dev` - run the Vite development server.
- `npm run build` - build the frontend for production.
- `npm run preview` - preview the production build.
- `npm run lint` - run ESLint.

## Notes

- Authentication is managed via JWT stored in `localStorage`.
- The frontend automatically attaches the JWT to API requests.
- Role-based routing is enforced by backend middleware and frontend loaders.
- Mentor search in `BrowseMentors.jsx` updates automatically as the user types, with a 250ms debounce.
- `AuthLayout.jsx` includes a home link so auth flows can return to the landing page.
- Dark mode is provided through `next-themes`; the current theme is persisted using the configured storage key.

## Design Assets

- The `UI/Documentation/stitch_mentorhub_saas_platform/` folder contains design and mockup assets used for the platform UI.
