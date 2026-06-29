import useAuthStore from "@/store/authStore";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { NAV_LINKS, DASHBOARD_PATHS } from "@/lib/routes";
import { getProfilePath, isNavActive } from "@/lib/format";

const Topbar = () => {
  const { user, logout } = useAuthStore();
  const role = user?.role;
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = role ? (NAV_LINKS[role] ?? []) : [];

  const avatarUrl =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${user?.name || user?.email || "U"}&background=random`;

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate("/login");
  };

  if (!role) return null;

  return (
    <header className="bg-[var(--brand-surface)] sticky top-0 z-10 h-[72px] border-b border-[var(--brand-outline)] flex justify-between items-center w-full px-4 md:px-6 shrink-0">
      <div className="flex-1 max-w-md relative hidden md:block">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          search
        </span>
        <input
          className="w-full bg-[var(--brand-surface-muted)] border border-[var(--brand-outline)] rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:border-[var(--brand-brown-light)] focus:ring-1 focus:ring-[var(--brand-brown-light)] transition-colors"
          placeholder="Search mentors, skills, or sessions..."
          type="text"
        />
      </div>

      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-muted-foreground p-1"
          aria-label="Toggle mobile menu"
        >
          <span className="material-symbols-outlined">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
        <h2 className="text-lg font-bold text-[var(--brand-brown)]">
          MentorHub
        </h2>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-gray-100 transition-colors relative">
          <span className="material-symbols-outlined" data-icon="notifications">
            notifications
          </span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-white"></span>
        </button>
        <Link
          to={getProfilePath(role)}
          className="w-10 h-10 rounded-full overflow-hidden border border-[var(--brand-outline)] hover:border-[var(--brand-brown)] transition-colors focus:outline-none"
          aria-label="Go to profile"
        >
          <img
            alt="User Profile"
            className="w-full h-full object-cover"
            src={avatarUrl}
          />
        </Link>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[72px] bg-black/40 z-[9998] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-[72px] left-0 w-full bg-white border-b border-[var(--brand-outline)] shadow-xl md:hidden flex flex-col z-[9999]">
            <div className="p-3 border-b border-[var(--brand-outline)] bg-[var(--brand-surface-muted)]">
              <div className="flex items-center gap-3 px-2">
                <img
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover border border-[var(--brand-outline)]"
                  src={avatarUrl}
                />
                <div>
                  <p className="text-sm font-semibold text-[var(--brand-brown)]">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {role}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-2 gap-1">
              {links.map((link) => {
                const dashboardPath = DASHBOARD_PATHS[role];
                const isActive = isNavActive(location.pathname, link.path, dashboardPath);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[var(--brand-surface-muted)] text-[var(--brand-brown)]"
                        : "text-muted-foreground hover:bg-[var(--brand-surface-muted)] hover:text-[var(--brand-brown)]"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${isActive ? "icon-fill" : ""}`}
                    >
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="p-2 border-t border-[var(--brand-outline)]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-[var(--brand-surface-muted)] hover:text-[var(--brand-brown)] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Topbar;
