import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--brand-surface)] p-6 text-center">
      <span className="text-6xl font-bold text-[var(--brand-teal)]">404</span>
      <h1 className="text-2xl font-bold text-[var(--brand-brown)]">
        Page Not Found
      </h1>
      <p className="text-sm text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-4 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)]"
      >
        Back to Home
      </Link>
    </div>
  );
}
