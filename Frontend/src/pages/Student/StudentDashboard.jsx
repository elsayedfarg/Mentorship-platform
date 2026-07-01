import { Link } from "react-router";
import { useMemo } from "react";
import useAuthStore from "@/store/authStore";
import useStudentStore from "@/store/studentStore";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getId, getMentorFromSession, getSessionStart, formatTime, formatDate } from "@/lib/format";

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { sessions, mentors } = useStudentStore();

  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Student";

  const upcomingSessions = useMemo(
    () =>
      sessions?.filter((s) =>
        ["accepted", "pending"].includes((s.status || "").toLowerCase())
      ) ?? [],
    [sessions]
  );

  const completedSessions = useMemo(
    () =>
      sessions?.filter((s) => (s.status || "").toLowerCase() === "completed") ?? [],
    [sessions]
  );

  // Total hours mentored, based on actual start/end time of completed sessions
  const totalHours = useMemo(() => {
    const ms = completedSessions.reduce((sum, s) => {
      if (!s.start_time || !s.end_time) return sum;
      const diff = new Date(s.end_time) - new Date(s.start_time);
      return sum + (diff > 0 ? diff : 0);
    }, 0);
    return Math.round((ms / (1000 * 60 * 60)) * 10) / 10; // 1 decimal place
  }, [completedSessions]);

  // Sessions completed out of all non-cancelled sessions booked
  const goalsStats = useMemo(() => {
    const relevant = sessions?.filter(
      (s) => (s.status || "").toLowerCase() !== "cancelled"
    ) ?? [];
    return {
      completed: completedSessions.length,
      total: relevant.length,
    };
  }, [sessions, completedSessions]);

  const goalsPercent =
    goalsStats.total > 0
      ? Math.round((goalsStats.completed / goalsStats.total) * 100)
      : 0;

  const hoursPercent = Math.min(100, Math.round((totalHours / 20) * 100)); // capped progress vs a 20hr soft target

  // Chart: hours per completed session, ordered by date
  const chartData = useMemo(() => {
    return completedSessions
      .filter((s) => s.start_time && s.end_time)
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      .map((s) => {
        const start = new Date(s.start_time);
        const hours =
          Math.round(
            ((new Date(s.end_time) - start) / (1000 * 60 * 60)) * 10
          ) / 10;
        return {
          name: start.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
          hours,
        };
      });
  }, [completedSessions]);

  return (
    <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6 md:gap-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          Welcome back, {firstName}.
        </h2>
        <p className="text-base text-muted-foreground">
          Here is an overview of your mentorship journey this week.
        </p>
      </div>

      {/* Dashboard Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Top Row: Learning Progress (col 8) & Upcoming Sessions (col 4) */}

        {/* Learning Progress */}
        <div className="md:col-span-8 bg-card border border-[var(--brand-outline)] rounded-xl p-6 flex flex-col gap-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--brand-surface-muted)] to-transparent rounded-bl-[100px] -z-0 opacity-50"></div>
          <div className="flex justify-between items-center z-10">
            <h3 className="text-xl font-bold text-card-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--brand-brown-light)]">
                trending_up
              </span>
              Learning Progress
            </h3>
            <Link
              to="/dashboard/student/sessions"
              className="text-[var(--brand-brown-light)] text-sm font-semibold hover:underline"
            >
              View Detailed Report
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2 z-10">
            {/* Stats */}
            <div className="flex flex-col gap-4 col-span-1">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Hours Mentored
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-[var(--brand-brown)] leading-none">
                    {totalHours}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">
                    hrs
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[var(--brand-brown-light)] h-full rounded-full transition-all"
                    style={{ width: `${hoursPercent}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Sessions Completed
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-[var(--brand-brown)] leading-none">
                    {goalsStats.completed}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">
                    / {goalsStats.total}
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[var(--brand-teal)] h-full rounded-full transition-all"
                    style={{ width: `${goalsPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="col-span-1 sm:col-span-2 h-48 w-full border border-[var(--brand-outline)] rounded-lg p-2 bg-[var(--brand-surface-muted)]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--brand-brown-light)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--brand-brown-light)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--brand-outline)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--brand-brown)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--brand-brown)' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--brand-outline)' }}
                      itemStyle={{ color: 'var(--brand-brown)' }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="var(--brand-brown-light)" fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                  No completed sessions yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="md:col-span-4 bg-card border border-[var(--brand-outline)] rounded-xl p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-card-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--brand-brown-light)]">
                calendar_month
              </span>
              Upcoming Sessions
            </h3>
            <Link
              to="/dashboard/student/mentors"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-muted-foreground"
              aria-label="Book new session"
            >
              <span className="material-symbols-outlined">add</span>
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.slice(0, 3).map((session, i) => {
                const mentor = getMentorFromSession(session);
                const startTime = getSessionStart(session);
                const status = session.status?.toLowerCase();

                return (
                  <Link
                    key={getId(session) || i}
                    to="/dashboard/student/sessions"
                    className="bg-[var(--brand-surface-muted)] p-4 rounded-lg border border-[var(--brand-outline)] flex flex-col gap-3 hover:border-[var(--brand-brown-light)] transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--brand-outline)] text-[var(--brand-brown)] font-bold uppercase">
                          {mentor.name?.[0] || 'M'}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-card-foreground">
                            {mentor.name || "Unknown Mentor"}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {mentor.title || "Mentorship Session"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="bg-[var(--brand-teal)] text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">
                          {startTime ? formatDate(startTime) : 'Upcoming'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {status === "accepted" ? "Accepted" : "Pending"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1 pt-3 border-t border-[var(--brand-outline)]/50">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        <span className="text-xs font-semibold">
                          {formatTime(startTime)}
                        </span>
                      </div>
                      <span className="text-[var(--brand-brown-light)] group-hover:text-[var(--brand-brown)] text-sm font-bold transition-colors">
                        View
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground p-4 border border-dashed border-[var(--brand-outline)] rounded-lg text-center">
                No upcoming sessions. Time to book one!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Row: Recommended Mentors (col 8) & Activity Feed (col 4) */}

        {/* Recommended Mentors */}
        <div className="md:col-span-8 bg-card border border-[var(--brand-outline)] rounded-xl p-6 flex flex-col gap-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-card-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--brand-brown-light)]">
                lightbulb
              </span>
              Recommended Mentors
            </h3>
            <Link
              to="/dashboard/student/mentors"
              className="text-[var(--brand-brown-light)] text-sm font-semibold hover:underline"
            >
              Browse All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentors?.length > 0 ? (
              mentors.slice(0, 3).map((mentor, i) => (
                <div key={getId(mentor) || i} className="bg-card rounded-lg border border-[var(--brand-outline)] p-5 flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-[var(--brand-surface-muted)] bg-[var(--brand-surface-muted)] text-[var(--brand-brown)] text-2xl font-bold uppercase mb-1">
                    {mentor.name?.[0] || 'M'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-card-foreground">
                      {mentor.name || "Mentor Name"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {mentor.title || "Professional Mentor"}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    <span className="bg-[var(--brand-surface-muted)] text-muted-foreground px-2 py-0.5 rounded text-[11px] font-medium border border-[var(--brand-outline)]">
                      Mentorship
                    </span>
                    <span className="bg-[var(--brand-surface-muted)] text-muted-foreground px-2 py-0.5 rounded text-[11px] font-medium border border-[var(--brand-outline)]">
                      Career
                    </span>
                  </div>
                  <Link
                    to={`/dashboard/student/mentors/${getId(mentor)}`}
                    className="mt-3 w-full py-2 text-center bg-transparent border border-[var(--brand-brown-light)] dark:border-[var(--brand-teal)] text-[var(--brand-brown-light)] dark:text-[var(--brand-teal)] text-sm font-bold rounded hover:bg-[var(--brand-brown-light)] dark:hover:bg-[var(--brand-teal)] hover:text-white dark:hover:text-white transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground col-span-3 p-4 border border-dashed border-[var(--brand-outline)] rounded-lg text-center">
                No recommended mentors available at the moment.
              </p>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="md:col-span-4 bg-card border border-[var(--brand-outline)] rounded-xl p-6 flex flex-col gap-6 shadow-sm">
          <h3 className="text-xl font-bold text-card-foreground flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--brand-brown-light)]">
              history
            </span>
            Recent Activity
          </h3>
          <div className="relative border-l border-[var(--brand-outline)] ml-3 pl-5 flex flex-col gap-6">
            <div className="relative">
              <div className="absolute -left-[26px] top-1 w-[11px] h-[11px] rounded-full bg-[var(--brand-brown-light)] border-2 border-white"></div>
              <p className="text-sm text-card-foreground">
                You logged in successfully to your student portal.
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                Just now
              </span>
            </div>

            {upcomingSessions.length > 0 && (
              <div className="relative">
                <div className="absolute -left-[26px] top-1 w-[11px] h-[11px] rounded-full bg-[var(--brand-outline)] border-2 border-white"></div>
                <p className="text-sm text-card-foreground">
                  You have{" "}
                  <span className="text-sm font-semibold">
                    {upcomingSessions.length}
                  </span>{" "}
                  upcoming sessions.
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  System update
                </span>
              </div>
            )}

            <div className="relative">
              <div className="absolute -left-[26px] top-1 w-[11px] h-[11px] rounded-full bg-[var(--brand-outline)] border-2 border-white"></div>
              <p className="text-sm text-card-foreground">
                <span className="text-sm font-semibold">Account created</span> and profile setup complete.
              </p>
              <span className="text-xs text-muted-foreground mt-2 block">
                Recently
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;