import { Link, useNavigate } from "react-router";
import useAuthStore from "@/store/authStore";
import { getProfilePath } from "@/lib/format";

const SettingsPage = ({ title = "Settings" }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          {title}
        </h2>
        <p className="text-base text-muted-foreground">
          Manage your account preferences.
        </p>
      </div>

      <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-6 flex flex-col gap-6 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-[var(--brand-brown)] uppercase tracking-wider mb-4">
            Account
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Role</label>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {role}
              </p>
            </div>
          </div>
        </div>

        {role !== "admin" && (
          <div className="border-t border-[var(--brand-outline)] pt-6">
            <Link
              to={getProfilePath(role)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-brown-light)] hover:text-[var(--brand-brown)] hover:underline"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              Edit Profile
            </Link>
          </div>
        )}

        <div className="border-t border-[var(--brand-outline)] pt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
