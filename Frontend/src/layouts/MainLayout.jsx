import { Outlet } from "react-router";
import { Toaster } from "sonner";
import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";

const MainLayout = () => {
  return (
    <div className="bg-[var(--brand-surface)] text-foreground font-sans antialiased overflow-x-hidden flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-[280px] h-full overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative z-0">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default MainLayout;
