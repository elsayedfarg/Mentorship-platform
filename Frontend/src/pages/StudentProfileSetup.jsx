import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/apiClient";
import useAuthStore from "@/store/authStore";
import { getDashboardPath } from "@/lib/routes";
import {
  studentProfileSchema,
  studentStepFields,
} from "@/lib/validations/profile";
import { cn } from "@/lib/utils";

const INTEREST_TAGS = [
  "Frontend Dev",
  "Backend Dev",
  "Fullstack",
  "UI/UX Design",
  "Data Science",
  "Mobile (iOS/Android)",
  "Cloud/DevOps",
  "Leadership",
];

function getStepForErrors(errors) {
  if (errors.name) return 1;
  if (errors.experience || errors.goals) return 2;
  if (errors.interests) return 3;
  return 1;
}

export default function StudentProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      name: "",
      experience: "",
      goals: "",
      interests: [],
    },
  });

  const progress = step <= 3 ? (step / 3) * 100 : 100;

  const handleContinue = async (currentStep) => {
    const valid = await trigger(studentStepFields[currentStep]);
    if (valid) {
      setStep(currentStep + 1);
      return;
    }

    toast.error("Please complete the required fields before continuing.");
  };

  const onSubmit = async ({ name }) => {
    setSubmitting(true);

    try {
      await api.put("/api/students/profile", { name: name.trim() });
      setStep(4);
      toast.success("Profile created successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to save profile.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onInvalid = (formErrors) => {
    setStep(getStepForErrors(formErrors));
    toast.error("Please complete all required fields before saving.");
  };

  const toggleInterest = (tag, currentInterests, onChange) => {
    const next = currentInterests.includes(tag)
      ? currentInterests.filter((item) => item !== tag)
      : [...currentInterests, tag];
    onChange(next);
  };

  return (
    <div className="flex min-h-screen bg-[var(--brand-surface)]">
      <aside className="fixed top-0 left-0 z-20 hidden h-full w-[280px] flex-col border-r border-[var(--brand-outline)] bg-[var(--brand-surface-muted)] py-6 md:flex">
        <div className="mb-8 flex items-center gap-4 px-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-[var(--brand-brown-light)] text-sm font-bold text-white dark:text-gray-900">
            M
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--brand-brown)]">
              MentorHub
            </h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2">
          <span className="mx-2 flex items-center gap-3 rounded-md border-l-4 border-[var(--brand-brown)] bg-card px-4 py-3 text-sm font-semibold text-[var(--brand-brown)]">
            Profile Setup
          </span>
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:ml-[280px]">
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-[var(--brand-outline)] bg-card px-6">
          <h2 className="text-lg font-bold text-[var(--brand-brown)]">
            Profile Setup
          </h2>
        </header>

        <main className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--brand-outline)] bg-card p-6 shadow-sm md:p-8">
            {step <= 3 && (
              <div className="absolute top-0 left-0 h-1 w-full bg-[var(--brand-outline)]/40">
                <div
                  className="h-full bg-[var(--brand-brown)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {step === 1 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[var(--brand-brown)]">
                    Welcome! Let&apos;s get to know you.
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Set up your profile to connect with the right mentors.
                  </p>
                </div>

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
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleContinue(1)}
                    className="flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white dark:text-gray-900 hover:bg-[var(--brand-brown)]"
                  >
                    Continue
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[var(--brand-brown)]">
                    Your Journey So Far
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Help us understand where you are and where you want to go.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="experience"
                      className="text-sm font-semibold text-[var(--brand-brown)]"
                    >
                      Current Experience Level
                    </label>
                    <select
                      id="experience"
                      className={cn(
                        "w-full rounded-lg border bg-card text-card-foreground px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)]",
                        errors.experience
                          ? "border-destructive"
                          : "border-[var(--brand-outline)]",
                      )}
                      {...register("experience")}
                    >
                      <option value="">Select your level...</option>
                      <option value="beginner">Beginner (0-1 years)</option>
                      <option value="intermediate">
                        Intermediate (1-3 years)
                      </option>
                      <option value="advanced">Advanced (3+ years)</option>
                      <option value="career-switcher">Career Switcher</option>
                    </select>
                    {errors.experience && (
                      <p className="text-xs text-destructive">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="goals"
                      className="text-sm font-semibold text-[var(--brand-brown)]"
                    >
                      Primary Learning Goals
                    </label>
                    <textarea
                      id="goals"
                      rows={4}
                      placeholder="What are you hoping to achieve with a mentor?"
                      className={cn(
                        "w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)]",
                        errors.goals
                          ? "border-destructive"
                          : "border-[var(--brand-outline)]",
                      )}
                      {...register("goals")}
                    />
                    {errors.goals && (
                      <p className="text-xs text-destructive">
                        {errors.goals.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[var(--brand-brown)]"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContinue(2)}
                    className="flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white dark:text-gray-900 hover:bg-[var(--brand-brown)]"
                  >
                    Continue
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[var(--brand-brown)]">
                    Technical Interests
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Select the stacks or areas you want to focus on.
                  </p>
                </div>

                <Controller
                  name="interests"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-3">
                      {INTEREST_TAGS.map((tag) => {
                        const selected = field.value.includes(tag);

                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              toggleInterest(tag, field.value, field.onChange)
                            }
                            className={cn(
                              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                              selected
                                ? "border-[var(--brand-brown)] bg-[var(--brand-brown)] text-white dark:text-gray-900"
                                : "border-[var(--brand-outline)] text-muted-foreground hover:border-[var(--brand-brown-light)] hover:text-[var(--brand-brown)]",
                            )}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.interests && (
                  <p className="mt-2 text-xs text-destructive">
                    {errors.interests.message}
                  </p>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[var(--brand-brown)]"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit, onInvalid)}
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white dark:text-gray-900 hover:bg-[var(--brand-brown)] disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Spinner className="size-4 text-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          className="size-4"
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[var(--brand-brown)]/10 text-[var(--brand-brown)]">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="size-10"
                  />
                </div>
                <h3 className="text-2xl font-bold text-[var(--brand-brown)]">
                  Profile Created!
                </h3>
                <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
                  Your journey begins now. We&apos;ll help you connect with
                  mentors based on your profile.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(getDashboardPath(user?.role))}
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-8 py-3 text-sm font-semibold text-white dark:text-gray-900 hover:bg-[var(--brand-brown)]"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
