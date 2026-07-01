import { toast } from "sonner";
import useAdminStore from "@/store/adminStore";
import { getId } from "@/lib/format";

const AdminReports = () => {
  const { pendingMentors, stackStats, updateUserStatus } = useAdminStore();

  const handleApprove = async (mentorId) => {
    const result = await updateUserStatus(mentorId, true);
    if (result.success) {
      toast.success("Mentor approved.");
    } else {
      toast.error(result.error || "Failed to approve mentor.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          Reports
        </h2>
        <p className="text-base text-muted-foreground">
          Platform overview and pending mentor approvals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-card-foreground mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--brand-brown-light)]">
              pending_actions
            </span>
            Pending Mentor Approvals
          </h3>
          {pendingMentors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending approvals.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingMentors.map((mentor) => (
                <div
                  key={getId(mentor)}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--brand-outline)]"
                >
                  <div>
                    <p className="text-sm font-semibold">{mentor.name || mentor.email}</p>
                    <p className="text-xs text-muted-foreground">{mentor.title || mentor.email}</p>
                  </div>
                  {console.log(mentor)}
                  <button
                    type="button"
                    onClick={() => handleApprove(mentor.user_id._id)}
                    className="text-xs font-semibold text-[var(--brand-teal)] hover:underline"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-card-foreground mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--brand-brown-light)]">
              stacked_bar_chart
            </span>
            Stack Statistics
          </h3>
          {stackStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No stack data available.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stackStats.map((stack) => (
                <div
                  key={getId(stack)}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--brand-outline)]"
                >
                  <div>
                    <p className="text-sm font-semibold">{stack.name}</p>
                    {stack.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {stack.description}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-[var(--brand-brown)]">
                    {stack.mentorCount ?? stack.mentors_count ?? 0} mentors
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
