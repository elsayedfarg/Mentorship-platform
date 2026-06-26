import { useState } from "react";
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
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Your Journey" },
  { id: 3, title: "Interests" },
];

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

export default function StudentProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [goals, setGoals] = useState("");
  const [interests, setInterests] = useState([]);
  const [nameError, setNameError] = useState("");

  const progress = step <= 3 ? (step / 3) * 100 : 100;

  const toggleInterest = (tag) => {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleComplete = async () => {
    if (!name.trim() || name.trim().length < 2) {
      setNameError("Full name is required (at least 2 characters)");
      setStep(1);
      toast.error("Please enter your full name.");
      return;
    }

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

  return (
    <div className="flex min-h-screen bg-[var(--brand-surface)]">
      <aside className="fixed top-0 left-0 z-20 hidden h-full w-[280px] flex-col border-r border-[var(--brand-outline)] bg-[var(--brand-surface-muted)] py-6 md:flex">
        <div className="mb-8 flex items-center gap-4 px-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-[var(--brand-brown-light)] text-sm font-bold text-white">
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
          <span className="mx-2 flex items-center gap-3 rounded-md border-l-4 border-[var(--brand-brown)] bg-white px-4 py-3 text-sm font-semibold text-[var(--brand-brown)]">
            Profile Setup
          </span>
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:ml-[280px]">
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-[var(--brand-outline)] bg-white px-6">
          <h2 className="text-lg font-bold text-[var(--brand-brown)]">
            Profile Setup
          </h2>
        </header>

        <main className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--brand-outline)] bg-white p-6 shadow-sm md:p-8">
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
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError("");
                    }}
                    placeholder="Jane Doe"
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)] focus:ring-1 focus:ring-[var(--brand-teal)]",
                      nameError
                        ? "border-destructive"
                        : "border-[var(--brand-outline)]",
                    )}
                  />
                  {nameError && (
                    <p className="text-xs text-destructive">{nameError}</p>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)]"
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
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full rounded-lg border border-[var(--brand-outline)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)]"
                    >
                      <option value="">Select your level...</option>
                      <option value="beginner">Beginner (0-1 years)</option>
                      <option value="intermediate">
                        Intermediate (1-3 years)
                      </option>
                      <option value="advanced">Advanced (3+ years)</option>
                      <option value="career-switcher">Career Switcher</option>
                    </select>
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
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      rows={4}
                      placeholder="What are you hoping to achieve with a mentor?"
                      className="w-full resize-none rounded-lg border border-[var(--brand-outline)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)]"
                    />
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
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)]"
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

                <div className="flex flex-wrap gap-3">
                  {INTEREST_TAGS.map((tag) => {
                    const selected = interests.includes(tag);

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          selected
                            ? "border-[var(--brand-brown)] bg-[var(--brand-brown)] text-white"
                            : "border-[var(--brand-outline)] text-muted-foreground hover:border-[var(--brand-brown-light)] hover:text-[var(--brand-brown)]",
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

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
                    onClick={handleComplete}
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)] disabled:opacity-70"
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
                  onClick={() => navigate("/")}
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-8 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)]"
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
