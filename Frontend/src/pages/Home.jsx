import { Link } from "react-router";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-surface)] p-6">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-[var(--brand-brown-light)] text-white">
          <span className="material-symbols-outlined text-[32px] icon-fill">school</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--brand-brown)]">
          MentorHub
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Connect with expert mentors and accelerate your learning journey.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/login"
            className="w-full sm:w-auto rounded-lg bg-[var(--brand-brown-light)] px-8 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)] transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto rounded-lg border border-[var(--brand-brown-light)] px-8 py-3 text-sm font-semibold text-[var(--brand-brown-light)] hover:bg-[var(--brand-brown-light)] hover:text-white transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
