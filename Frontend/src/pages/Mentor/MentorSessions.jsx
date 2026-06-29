import { toast } from "sonner";
import { Link } from "react-router";
import useMentorStore from "@/store/mentorStore";
import {
  formatDateTime,
  getId,
  getSessionStart,
  getSessionStatus,
  getStudentFromSession,
} from "@/lib/format";

const MentorSessions = () => {
  const { sessions, updateSessionStatus } = useMentorStore();

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
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          Upcoming Sessions
        </h2>
        <p className="text-base text-muted-foreground">
          Sessions booked with your mentees.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white border border-dashed border-[var(--brand-outline)] rounded-xl p-12 text-center">
          <p className="text-muted-foreground mb-4">No sessions scheduled yet.</p>
          <Link
            to="/dashboard/mentor/availability"
            className="text-sm font-semibold text-[var(--brand-brown-light)] hover:underline"
          >
            Set your availability to get started
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => {
            const student = getStudentFromSession(session);
            const sessionId = getId(session);
            const status = getSessionStatus(session);

            return (
              <div
                key={sessionId}
                className="bg-white border border-[var(--brand-outline)] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-surface-muted)] flex items-center justify-center text-[var(--brand-brown)] font-bold uppercase">
                    {student.name?.[0] || student.email?.[0] || "S"}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {student.name || student.email || "Student Session"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(getSessionStart(session))}
                    </p>
                    {session.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {session.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-[var(--brand-teal)] text-white">
                    {status}
                  </span>
                  {status === "Pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(sessionId, "Accepted")}
                        className="text-xs font-semibold text-[var(--brand-teal)] hover:underline"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(sessionId, "Rejected")}
                        className="text-xs font-semibold text-destructive hover:underline"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {status === "Accepted" && (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(sessionId, "Completed")}
                      className="text-xs font-semibold text-[var(--brand-teal)] hover:underline"
                    >
                      Mark Complete
                    </button>
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

export default MentorSessions;
