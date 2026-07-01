import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "@/router";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
