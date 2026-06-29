import { Link } from "react-router";
import useAuthStore from "@/store/authStore";
import useMentorStore from "@/store/mentorStore";
import { formatDateTime, getId, getSessionStart, getSessionStatus } from "@/lib/format";

const MentorDashboard = () => {
  const { user } = useAuthStore();
  const { sessions, availability } = useMentorStore();
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Mentor";



  const upcomingSessions = sessions.filter(
    (s) => getSessionStatus(s) !== "Completed" && getSessionStatus(s) !== "Cancelled",
  );

  return (
    <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          Welcome back, {firstName}.
        </h2>
        <p className="text-base text-muted-foreground">
          Manage your mentorship sessions and availability.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Upcoming Sessions
          </p>
          <p className="text-3xl font-bold text-[var(--brand-brown)] mt-2">
            {upcomingSessions.length}
          </p>
          <Link
            to="/dashboard/mentor/sessions"
            className="text-xs font-semibold text-[var(--brand-brown-light)] hover:underline mt-2 inline-block"
          >
            View all sessions
          </Link>
        </div>
        <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Availability Blocks
          </p>
          <p className="text-3xl font-bold text-[var(--brand-brown)] mt-2">
            {availability.length}
          </p>
          <Link
            to="/dashboard/mentor/availability"
            className="text-xs font-semibold text-[var(--brand-brown-light)] hover:underline mt-2 inline-block"
          >
            Manage availability
          </Link>
        </div>
        <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Total Sessions
          </p>
          <p className="text-3xl font-bold text-[var(--brand-brown)] mt-2">
            {sessions.length}
          </p>
          <Link
            to="/dashboard/mentor/profile"
            className="text-xs font-semibold text-[var(--brand-brown-light)] hover:underline mt-2 inline-block"
          >
            Edit profile
          </Link>
        </div>
      </div>

      <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--brand-brown-light)]">
              event_note
            </span>
            Recent Sessions
          </h3>
          <Link
            to="/dashboard/mentor/sessions"
            className="text-sm font-semibold text-[var(--brand-brown-light)] hover:underline"
          >
            View All
          </Link>
        </div>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-[var(--brand-outline)] rounded-lg">
            No sessions yet.{" "}
            <Link to="/dashboard/mentor/availability" className="text-[var(--brand-brown-light)] hover:underline">
              Set your availability
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.slice(0, 5).map((session) => {
              const student = session.student || session.student_id || {};
              return (
                <div
                  key={getId(session)}
                  className="flex items-center justify-between p-4 rounded-lg border border-[var(--brand-outline)] bg-[var(--brand-surface-muted)]"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {student.name || student.email || "Student"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(getSessionStart(session))}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-[var(--brand-teal)] text-white">
                    {getSessionStatus(session)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
