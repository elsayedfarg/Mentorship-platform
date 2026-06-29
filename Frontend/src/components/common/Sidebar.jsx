import { Link, useLocation, useNavigate } from "react-router";
import useAuthStore from "@/store/authStore";
import { NAV_LINKS, DASHBOARD_PATHS } from "@/lib/routes";
import { isNavActive } from "@/lib/format";

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const role = user?.role;
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!role) return null;

  const navLinks = NAV_LINKS[role] ?? [];

  return (
    <nav className="hidden md:flex bg-[var(--brand-surface-muted)] fixed left-0 top-0 h-full w-[280px] border-r border-[var(--brand-outline)] flex-col py-6 z-20">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--brand-brown-light)] flex items-center justify-center text-white">
          <span className="material-symbols-outlined icon-fill">school</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--brand-brown)]">
            MentorHub
          </h1>
          <p className="text-xs font-medium text-muted-foreground capitalize">
            {role} Portal
          </p>
        </div>
      </div>
      <div className="flex-1 px-4 flex flex-col gap-1">
        {navLinks.map((link) => {
          const dashboardPath = DASHBOARD_PATHS[role];
          const isActive = isNavActive(location.pathname, link.path, dashboardPath);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold flex items-center gap-3 px-4 py-3 rounded-r-lg border-l-4 transition-all ${
                isActive
                  ? "bg-white text-[var(--brand-brown)] border-[var(--brand-brown)] shadow-sm"
                  : "text-muted-foreground border-transparent hover:bg-white hover:text-[var(--brand-brown)]"
              }`}
            >
              <span
                className={`material-symbols-outlined ${isActive ? "icon-fill" : ""}`}
                data-icon={link.icon}
              >
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="px-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full text-muted-foreground text-sm font-semibold flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:text-[var(--brand-brown)] transition-all"
        >
          <span className="material-symbols-outlined" data-icon="logout">
            logout
          </span>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
