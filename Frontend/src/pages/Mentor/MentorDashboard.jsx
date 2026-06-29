import useAuthStore from "@/store/authStore";

const MentorDashboard = () => {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Mentor";

  return (
    <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          Welcome back, {firstName}.
        </h2>
        <p className="text-base text-muted-foreground">
          Your mentor dashboard is coming soon.
        </p>
      </div>
      <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-10 flex flex-col items-center justify-center gap-4 shadow-sm text-center">
        <span className="material-symbols-outlined text-[64px] text-[var(--brand-brown-light)]">
          pending
        </span>
        <h3 className="text-xl font-bold text-gray-900">Mentor Dashboard</h3>
        <p className="text-muted-foreground max-w-sm">
          Your full mentor dashboard is being built. You'll be able to manage your sessions, availability, and mentees here.
        </p>
      </div>
    </div>
  );
};

export default MentorDashboard;
