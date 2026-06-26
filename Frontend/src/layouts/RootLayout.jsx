import { Outlet } from "react-router";
import { Toaster } from "sonner";

/**
 * Root layout — rendered for every route.
 * Provides the Toaster and any future global providers
 * (ThemeProvider, etc.). Uses <Outlet /> to render matched children.
 */
export default function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
