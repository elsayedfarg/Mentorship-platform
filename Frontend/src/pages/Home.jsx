import { Link } from "react-router";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const stats = [
  { value: "2,400+", label: "Active mentors" },
  { value: "18,000+", label: "Sessions booked" },
  { value: "94%", label: "Would mentor again" },
];

const steps = [
  {
    n: "01",
    title: "Tell us where you're headed",
    body: "Share your goals, field, and the kind of guidance you're looking for.",
  },
  {
    n: "02",
    title: "Match with a mentor",
    body: "We surface mentors with relevant experience and open availability.",
  },
  {
    n: "03",
    title: "Book a session",
    body: "Pick a time, hop on a call, and walk away with a clear next step.",
  },
];

const features = [
  {
    icon: "person_search",
    title: "Vetted mentors",
    body: "Every mentor is reviewed for real, relevant industry experience.",
  },
  {
    icon: "calendar_month",
    title: "Flexible scheduling",
    body: "Book a session that fits your calendar, not the other way around.",
  },
  {
    icon: "forum",
    title: "Ongoing conversation",
    body: "Message your mentor between sessions to stay accountable.",
  },
  {
    icon: "trending_up",
    title: "Track your progress",
    body: "Set goals after each session and see how far you've come.",
  },
];

export default function Home() {
  return (
    <div className="bg-[var(--brand-surface)]">
      {/* Nav */}
      <header className="border-b border-black/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--brand-brown-light)] text-white dark:text-gray-900">
              <span className="material-symbols-outlined text-[20px] icon-fill">
                school
              </span>
            </div>
            <span className="text-lg font-bold text-[var(--brand-brown)]">
              MentorHub
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--brand-brown)] hover:bg-black/5 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-[var(--brand-brown-light)] px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 hover:bg-[var(--brand-brown)] transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full bg-[var(--brand-brown-light)]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--brand-brown-light)]">
              Mentorship, made simple
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-[var(--brand-brown)] sm:text-5xl">
              Learn faster with a mentor who's been there
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              MentorHub connects you with experienced professionals for
              one-on-one guidance, honest feedback, and a clear path
              forward.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="rounded-lg bg-[var(--brand-brown-light)] px-7 py-3 text-center text-sm font-semibold text-white dark:text-gray-900 hover:bg-[var(--brand-brown)] transition-colors"
              >
                Find a mentor
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-[var(--brand-brown-light)] dark:border-[var(--brand-teal)] px-7 py-3 text-center text-sm font-semibold text-[var(--brand-brown-light)] dark:text-[var(--brand-teal)] hover:bg-[var(--brand-brown-light)] dark:hover:bg-[var(--brand-teal)] hover:text-white transition-colors"
              >
                Sign in
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-black/5 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-bold text-[var(--brand-brown)]">
                    {s.value}
                  </dd>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          {/* Signature element: session card mockup */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-2xl border border-black/5 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-[var(--brand-brown-light)]/10 text-[var(--brand-brown-light)] font-semibold">
                  AK
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--brand-brown)]">
                    Amara Khan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Senior Product Designer · 8 yrs
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-2 border-t border-black/5 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next slot</span>
                  <span className="font-semibold text-[var(--brand-brown)]">
                    Thu, 4:00 PM
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Focus area</span>
                  <span className="font-semibold text-[var(--brand-brown)]">
                    Portfolio review
                  </span>
                </div>
              </div>
              <button className="mt-6 w-full rounded-lg bg-[var(--brand-brown-light)] py-2.5 text-sm font-semibold text-white dark:text-gray-900">
                Book this session
              </button>
            </div>
            <div className="absolute -bottom-5 -right-5 -z-10 size-full rounded-2xl bg-[var(--brand-brown-light)]/10 sm:-bottom-6 sm:-right-6" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-black/5 bg-card/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-bold text-[var(--brand-brown)] sm:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n}>
                <span className="text-sm font-bold text-[var(--brand-brown-light)]">
                  {step.n}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-[var(--brand-brown)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-bold text-[var(--brand-brown)] sm:text-3xl">
          Built for real progress
        </h2>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          Everything you need to find the right mentor and turn advice into
          action.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-black/5 bg-card p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--brand-brown-light)]/10 text-[var(--brand-brown-light)]">
                <span className="material-symbols-outlined text-[20px]">
                  {f.icon}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-[var(--brand-brown)]">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-y border-black/5 bg-card/60">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-xl font-medium leading-relaxed text-[var(--brand-brown)] sm:text-2xl">
            "My mentor helped me see my blind spots in three sessions. I
            switched careers six months later with a portfolio I was
            actually proud of."
          </p>
          <p className="mt-6 text-sm font-semibold text-[var(--brand-brown)]">
            Jordan Ellis
          </p>
          <p className="text-xs text-muted-foreground">
            Mentee, now Product Designer at a Series B startup
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-[var(--brand-brown)] px-8 py-14 text-center">
          <h2 className="max-w-md text-2xl font-bold text-white sm:text-3xl">
            Your next mentor is one conversation away
          </h2>
          <Link
            to="/register"
            className="rounded-lg bg-card px-8 py-3 text-sm font-semibold text-[var(--brand-brown)] hover:bg-card/90 transition-colors"
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} MentorHub. All rights reserved.</span>
          <div className="flex gap-5">
            <Link to="/login" className="hover:text-[var(--brand-brown)]">
              Sign in
            </Link>
            <Link to="/register" className="hover:text-[var(--brand-brown)]">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}