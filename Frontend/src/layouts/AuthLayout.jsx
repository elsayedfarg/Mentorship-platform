export default function AuthLayout({ children, maxWidth = "max-w-md" }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--brand-surface)] p-4 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4c3ba_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute top-0 right-0 size-96 -translate-y-1/2 translate-x-1/4 rounded-full bg-[var(--brand-purple)]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-80 translate-y-1/3 -translate-x-1/4 rounded-full bg-[var(--brand-teal)]/10 blur-[100px]" />

      <div className={`relative z-10 w-full ${maxWidth}`}>{children}</div>
    </div>
  );
}
