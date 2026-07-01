import { toast } from "sonner";
import { Link } from "react-router";
import useStudentStore from "@/store/studentStore";
import {
  formatDateTime,
  getId,
  getMentorFromSession,
  getSessionStart,
  getSessionStatus,
} from "@/lib/format";

const MySessions = () => {
  const { sessions, updateSessionStatus } = useStudentStore();

  const handleStatusUpdate = async (sessionId, status) => {
    const result = await updateSessionStatus(sessionId, status);
    if (result.success) {
      toast.success(`Session marked as ${status}.`);
    } else {
      toast.error(result.error || "Failed to update session.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
            My Sessions
          </h2>
          <p className="text-base text-muted-foreground">
            View and manage your mentorship sessions.
          </p>
        </div>
        <Link
          to="/dashboard/student/mentors"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-[var(--brand-brown)]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Book New Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-card border border-dashed border-[var(--brand-outline)] rounded-xl p-12 text-center">
          <p className="text-muted-foreground mb-4">No sessions yet.</p>
          <Link
            to="/dashboard/student/mentors"
            className="text-sm font-semibold text-[var(--brand-brown-light)] hover:underline"
          >
            Browse mentors to book your first session
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => {
            const mentor = getMentorFromSession(session);
            const sessionId = getId(session);
            const status = getSessionStatus(session);

            return (
              <div
                key={sessionId}
                className="bg-card border border-[var(--brand-outline)] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-surface-muted)] flex items-center justify-center text-[var(--brand-brown)] font-bold uppercase">
                    {mentor.name?.[0] || "M"}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground">
                      {mentor.name || "Mentor Session"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(getSessionStart(session))}
                    </p>
                    {session.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {session.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-[var(--brand-surface-muted)] text-[var(--brand-brown)]">
                    {status}
                  </span>
                  {status === "Accepted" && (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(sessionId, "Completed")}
                      className="text-xs font-semibold text-[var(--brand-teal)] hover:underline"
                    >
                      Mark Complete
                    </button>
                  )}
                  {status === "Pending" && (
                    <span className="text-xs text-muted-foreground">
                      Waiting for mentor acceptance
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MySessions;
