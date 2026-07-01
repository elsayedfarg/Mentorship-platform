import { useState } from "react";
import { toast } from "sonner";
import useAdminStore from "@/store/adminStore";
import { getId } from "@/lib/format";

const ROLES = ["student", "mentor", "admin"];

const UsersManagement = () => {
  const { users, loading, fetchUsers, updateUserStatus } = useAdminStore();
  const [roleFilter, setRoleFilter] = useState("student");
  const [updatingId, setUpdatingId] = useState(null);

  const handleRoleChange = (role) => {
    setRoleFilter(role);
    fetchUsers({ role });
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setUpdatingId(userId);
    const result = await updateUserStatus(userId, !currentStatus);
    setUpdatingId(null);

    if (result.success) {
      toast.success(`User ${!currentStatus ? "approved" : "blocked"}.`);
    } else {
      toast.error(result.error || "Failed to update user status.");
    }

    // Refresh the user list after updating status
    fetchUsers({ role: roleFilter });
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          Users Management
        </h2>
        <p className="text-base text-muted-foreground">
          View and manage platform users.
        </p>
      </div>

      <div className="flex gap-2">
        {ROLES.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => handleRoleChange(role)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${roleFilter === role
              ? "bg-[var(--brand-brown-light)] text-white dark:text-gray-900"
              : "bg-card border border-[var(--brand-outline)] text-muted-foreground hover:text-[var(--brand-brown)]"
              }`}
          >
            {role}s
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12 border border-dashed border-[var(--brand-outline)] rounded-xl">
          No {roleFilter}s found.
        </p>
      ) : (
        <div className="bg-card border border-[var(--brand-outline)] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[var(--brand-surface-muted)] border-b border-[var(--brand-outline)]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-[var(--brand-brown)]">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--brand-brown)]">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--brand-brown)]">
                  Status
                </th>
                {roleFilter === "mentor" && (
                  <th className="text-right px-4 py-3 font-semibold text-[var(--brand-brown)]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userId = getId(user);
                console.log(JSON.stringify(user, null, 4));
                const verified = user.role != "mentor" || (user.profile.is_verified ?? false);
                return (
                  <tr
                    key={userId}
                    className="border-b border-[var(--brand-outline)] last:border-0"
                  >
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.name || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${verified
                          ? "bg-[var(--brand-teal)]/10 text-[var(--brand-teal)]"
                          : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    {roleFilter === "mentor" && (
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(userId, verified)}
                          disabled={updatingId === userId}
                          className="text-xs font-semibold text-[var(--brand-brown-light)] hover:underline disabled:opacity-50"
                        >
                          {updatingId === userId
                            ? "Updating..."
                            : verified
                              ? "Block"
                              : "Approve"}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;