import { Link } from "react-router";
import useAuthStore from "@/store/authStore";
import useAdminStore from "@/store/adminStore";
import { getId } from "@/lib/format";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { pendingMentors, stackStats } = useAdminStore();
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Admin";

  return (
    <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          Welcome back, {firstName}.
        </h2>
        <p className="text-base text-muted-foreground">
          Platform overview and administration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Pending Approvals
          </p>
          <p className="text-3xl font-bold text-[var(--brand-brown)] mt-2">
            {pendingMentors.length}
          </p>
          <Link
            to="/dashboard/admin/reports"
            className="text-xs font-semibold text-[var(--brand-brown-light)] hover:underline mt-2 inline-block"
          >
            Review pending mentors
          </Link>
        </div>
        <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Technical Stacks
          </p>
          <p className="text-3xl font-bold text-[var(--brand-brown)] mt-2">
            {stackStats.length}
          </p>
          <Link
            to="/dashboard/admin/reports"
            className="text-xs font-semibold text-[var(--brand-brown-light)] hover:underline mt-2 inline-block"
          >
            View stack stats
          </Link>
        </div>
        <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            User Management
          </p>
          <p className="text-3xl font-bold text-[var(--brand-brown)] mt-2">—</p>
          <Link
            to="/dashboard/admin/users"
            className="text-xs font-semibold text-[var(--brand-brown-light)] hover:underline mt-2 inline-block"
          >
            Manage users
          </Link>
        </div>
      </div>

      {pendingMentors.length > 0 && (
        <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Pending Mentor Approvals
            </h3>
            <Link
              to="/dashboard/admin/reports"
              className="text-sm font-semibold text-[var(--brand-brown-light)] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {pendingMentors.slice(0, 3).map((mentor) => (
              <div
                key={getId(mentor)}
                className="flex items-center justify-between p-4 rounded-lg border border-[var(--brand-outline)]"
              >
                <div>
                  <p className="text-sm font-semibold">{mentor.name || mentor.email}</p>
                  <p className="text-xs text-muted-foreground">{mentor.title || mentor.email}</p>
                </div>
                <Link
                  to="/dashboard/admin/reports"
                  className="text-xs font-semibold text-[var(--brand-teal)] hover:underline"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
