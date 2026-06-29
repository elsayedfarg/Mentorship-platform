import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/apiClient";
import useAuthStore from "@/store/authStore";
import { getDashboardPath } from "@/lib/routes";
import { mentorProfileSchema } from "@/lib/validations/profile";
import { cn } from "@/lib/utils";

export default function MentorProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mentorProfileSchema),
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      hourly_rate: "",
    },
  });

  const onSubmit = async (form) => {
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      bio: form.bio.trim(),
      hourly_rate: Number(form.hourly_rate),
    };

    try {
      await api.put("/api/mentors/profile", payload);
      setCompleted(true);
      toast.success("Mentor profile saved successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to save profile.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onInvalid = () => {
    toast.error("Please fix the errors in the form.");
  };

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--brand-surface)] p-6">
        <div className="w-full max-w-lg rounded-xl border border-[var(--brand-outline)] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[var(--brand-brown)]/10 text-[var(--brand-brown)]">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-10" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--brand-brown)]">
            Profile Created!
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Your mentor profile is ready. Students can now discover your
            expertise.
          </p>
          <button
            type="button"
            onClick={() => navigate(getDashboardPath(user?.role))}
            className="mt-8 rounded-lg bg-[var(--brand-brown-light)] px-8 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <nav className="fixed top-0 z-50 flex h-[72px] w-full items-center border-b border-[var(--brand-outline)] bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6">
          <span className="text-lg font-bold text-[var(--brand-brown)]">
            MentorHub
          </span>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-[104px] pb-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--brand-brown)]">
            Mentor Profile Setup
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about your expertise to connect with the right mentees.
          </p>
        </div>

        <div className="mb-8 grid w-full grid-cols-3 gap-4">
          <div className="rounded-lg border border-b-4 border-[var(--brand-brown)] bg-white p-4">
            <span className="text-xs font-semibold tracking-wider text-[var(--brand-brown)] uppercase">
              Step 1
            </span>
            <p className="mt-1 text-sm font-semibold">Basic Info</p>
          </div>
          <div className="rounded-lg border border-[var(--brand-outline)] bg-white/60 p-4 opacity-60">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Step 2
            </span>
            <p className="mt-1 text-sm text-muted-foreground">Expertise</p>
          </div>
          <div className="rounded-lg border border-[var(--brand-outline)] bg-white/60 p-4 opacity-60">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Step 3
            </span>
            <p className="mt-1 text-sm text-muted-foreground">Availability</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="w-full rounded-xl border border-[var(--brand-outline)] bg-white p-8 shadow-[0_4px_12px_rgba(74,52,38,0.08)] md:p-12"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-semibold text-[var(--brand-brown)]"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)] focus:ring-1 focus:ring-[var(--brand-teal)]",
                  errors.name
                    ? "border-destructive"
                    : "border-[var(--brand-outline)]",
                )}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-semibold text-[var(--brand-brown)]"
              >
                Professional Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Senior Product Designer at TechCorp"
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)]",
                  errors.title
                    ? "border-destructive"
                    : "border-[var(--brand-outline)]",
                )}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="bio"
                className="text-sm font-semibold text-[var(--brand-brown)]"
              >
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                placeholder="Share your background and mentoring approach..."
                className={cn(
                  "w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)]",
                  errors.bio
                    ? "border-destructive"
                    : "border-[var(--brand-outline)]",
                )}
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-xs text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="rate"
                className="text-sm font-semibold text-[var(--brand-brown)]"
              >
                Hourly Rate (USD)
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <input
                  id="rate"
                  type="number"
                  min="0"
                  placeholder="150"
                  className={cn(
                    "w-full rounded-lg border py-3 pr-4 pl-8 text-sm outline-none focus:border-[var(--brand-teal)]",
                    errors.hourly_rate
                      ? "border-destructive"
                      : "border-[var(--brand-outline)]",
                  )}
                  {...register("hourly_rate")}
                />
              </div>
              {errors.hourly_rate && (
                <p className="text-xs text-destructive">
                  {errors.hourly_rate.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-[var(--brand-outline)] pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)] disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Spinner className="size-4 text-white" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
