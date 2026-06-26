/**
 * ProtectedRoute is no longer needed.
 *
 * Auth protection is now handled by route loaders in the Data Router API:
 *  - src/loaders/authLoader.js      → requireAuthLoader / guestOnlyLoader
 *  - src/loaders/profileSetupLoader.js → profileSetupLoader
 *
 * Loaders run *before* the component renders and use `throw redirect()`
 * to handle auth failures, which is the recommended pattern in
 * React Router v7/v8.
 */
