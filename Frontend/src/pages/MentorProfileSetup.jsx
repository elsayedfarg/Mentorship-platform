import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/apiClient";
import useAuthStore from "@/store/authStore";
import { getDashboardPath } from "@/lib/routes";
import {
  formatSlotTime,
  getMinEndTime,
  isEndTimeAfterStart,
  SESSION_DURATION_MINUTES,
  timeToMinutes,
} from "@/lib/format";
import { cn } from "@/lib/utils";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// ─── Step indicators ────────────────────────────────────────────────────────

function StepBar({ current }) {
  const steps = [
    { n: 1, label: "Basic Info" },
    { n: 2, label: "Expertise" },
    { n: 3, label: "Availability" },
  ];
  return (
    <div className="mb-8 grid w-full grid-cols-3 gap-4">
      {steps.map(({ n, label }) => {
        const done = current > n;
        const active = current === n;
        return (
          <div
            key={n}
            className={cn(
              "rounded-lg border p-4",
              done && "border-[var(--brand-brown)] bg-[var(--brand-brown)]/5",
              active && "border-b-4 border-[var(--brand-brown)] bg-white",
              !done &&
              !active &&
              "border-[var(--brand-outline)] bg-white/60 opacity-60",
            )}
          >
            <span
              className={cn(
                "text-xs font-semibold tracking-wider uppercase",
                done || active
                  ? "text-[var(--brand-brown)]"
                  : "text-muted-foreground",
              )}
            >
              {done ? "✓ " : ""}Step {n}
            </span>
            <p
              className={cn(
                "mt-1 text-sm font-semibold",
                !done && !active && "text-muted-foreground font-normal",
              )}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Field wrapper ───────────────────────────────────────────────────────────

function Field({ label, htmlFor, error, children }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-semibold text-[var(--brand-brown)]"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const inputCls = (err) =>
  cn(
    "w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)] focus:ring-1 focus:ring-[var(--brand-teal)]",
    err ? "border-destructive" : "border-[var(--brand-outline)]",
  );

// ─── Step 1: Basic Info ──────────────────────────────────────────────────────

function Step1({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.name.trim() || data.name.trim().length < 2)
      e.name = "Full name is required (at least 2 characters)";
    if (!data.title.trim() || data.title.trim().length < 3)
      e.title = "Professional title is required (at least 3 characters)";
    if (!data.bio.trim() || data.bio.trim().length < 10)
      e.bio = "Bio is required (at least 10 characters)";
    if (!data.hourly_rate || Number(data.hourly_rate) <= 0)
      e.hourly_rate = "Hourly rate is required and must be positive";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const set = (field) => (e) => {
    onChange(field, e.target.value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="space-y-6">
      <Field label="Full Name *" htmlFor="name" error={errors.name}>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={set("name")}
          placeholder="Jane Doe"
          className={inputCls(errors.name)}
        />
      </Field>

      <Field
        label="Professional Title *"
        htmlFor="title"
        error={errors.title}
      >
        <input
          id="title"
          type="text"
          value={data.title}
          onChange={set("title")}
          placeholder="e.g. Senior Product Designer at TechCorp"
          className={inputCls(errors.title)}
        />
      </Field>

      <Field label="Bio *" htmlFor="bio" error={errors.bio}>
        <textarea
          id="bio"
          value={data.bio}
          onChange={set("bio")}
          rows={4}
          placeholder="Share your background and mentoring approach..."
          className={cn("resize-none", inputCls(errors.bio))}
        />
      </Field>

      <Field
        label="Hourly Rate (USD) *"
        htmlFor="rate"
        error={errors.hourly_rate}
      >
        <div className="relative">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            $
          </span>
          <input
            id="rate"
            type="number"
            min="1"
            value={data.hourly_rate}
            onChange={set("hourly_rate")}
            placeholder="150"
            className={cn("pl-8 pr-4", inputCls(errors.hourly_rate))}
          />
        </div>
      </Field>

      <div className="flex justify-end border-t border-[var(--brand-outline)] pt-6">
        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)]"
        >
          Next: Expertise →
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Expertise / Stack ───────────────────────────────────────────────

function Step2({ stackId, onChange, onNext, onBack, stacks, loadingStacks }) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!stackId) {
      setError("Please select your primary tech stack");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Choose the primary technology stack you mentor in. Students will
          discover you through this.
        </p>
      </div>

      <Field label="Tech Stack *" htmlFor="stack" error={error}>
        {loadingStacks ? (
          <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
            <Spinner className="size-4" /> Loading stacks…
          </div>
        ) : (
          <select
            id="stack"
            value={stackId}
            onChange={(e) => {
              onChange(e.target.value);
              setError("");
            }}
            className={cn(inputCls(error), "cursor-pointer bg-white")}
          >
            <option value="">— Select a stack —</option>
            {stacks.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        )}
      </Field>

      <div className="flex justify-between border-t border-[var(--brand-outline)] pt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-[var(--brand-outline)] px-6 py-3 text-sm font-semibold text-[var(--brand-brown)] hover:bg-[var(--brand-surface)]"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)]"
        >
          Next: Availability →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Availability ────────────────────────────────────────────────────

function Step3({ blocks, onChange, onBack, onSubmit, submitting }) {
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
  });
  const [draftErrors, setDraftErrors] = useState({});

  const validateDraft = () => {
    const e = {};
    if (!draft.day_of_week) e.day_of_week = "Select a day";
    if (!draft.start_time) e.start_time = "Required";
    if (!draft.end_time) e.end_time = "Required";
    if (
      draft.start_time &&
      draft.end_time &&
      !isEndTimeAfterStart(draft.start_time, draft.end_time)
    )
      e.end_time = "End time must be after start time";
    if (
      draft.start_time &&
      draft.end_time &&
      timeToMinutes(draft.end_time) - timeToMinutes(draft.start_time) < SESSION_DURATION_MINUTES
    )
      e.end_time = `Block must be at least ${SESSION_DURATION_MINUTES} minutes long`;
    setDraftErrors(e);
    return Object.keys(e).length === 0;
  };

  const addBlock = () => {
    if (!validateDraft()) return;
    const duplicate = blocks.some(
      (b) =>
        b.day_of_week === draft.day_of_week &&
        b.start_time === draft.start_time &&
        b.end_time === draft.end_time,
    );
    if (duplicate) {
      setDraftErrors({ day_of_week: "This slot already exists" });
      return;
    }
    onChange([...blocks, { ...draft }]);
    setDraft({ day_of_week: "", start_time: "", end_time: "" });
    setError("");
  };

  const removeBlock = (i) => onChange(blocks.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    if (blocks.length === 0) {
      setError("Add at least one availability slot before finishing");
      return;
    }
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Set your weekly recurring availability. Students will only be able to
        book sessions during these windows.
      </p>

      {/* Add a slot */}
      <div className="rounded-lg border border-[var(--brand-outline)] bg-[var(--brand-surface)] p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--brand-brown)]">
          Add a time slot
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Day" htmlFor="day" error={draftErrors.day_of_week}>
            <select
              id="day"
              value={draft.day_of_week}
              onChange={(e) => {
                setDraft((p) => ({ ...p, day_of_week: e.target.value }));
                setDraftErrors((p) => ({ ...p, day_of_week: "" }));
              }}
              className={cn(
                inputCls(draftErrors.day_of_week),
                "bg-white cursor-pointer",
              )}
            >
              <option value="">— Day —</option>
              {DAYS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>

          <Field label="Start" htmlFor="start" error={draftErrors.start_time}>
            <input
              id="start"
              type="time"
              value={draft.start_time}
              onChange={(e) => {
                const start_time = e.target.value;
                setDraft((p) => {
                  const next = { ...p, start_time };
                  if (start_time && p.end_time && !isEndTimeAfterStart(start_time, p.end_time)) {
                    next.end_time = getMinEndTime(start_time);
                  }
                  return next;
                });
                setDraftErrors((p) => ({ ...p, start_time: "", end_time: "" }));
              }}
              className={inputCls(draftErrors.start_time)}
            />
          </Field>

          <Field label="End" htmlFor="end" error={draftErrors.end_time}>
            <input
              id="end"
              type="time"
              value={draft.end_time}
              min={draft.start_time ? getMinEndTime(draft.start_time) : undefined}
              onChange={(e) => {
                setDraft((p) => ({ ...p, end_time: e.target.value }));
                setDraftErrors((p) => ({ ...p, end_time: "" }));
              }}
              className={inputCls(draftErrors.end_time)}
            />
          </Field>
        </div>
        <button
          type="button"
          onClick={addBlock}
          className="mt-3 flex items-center gap-1.5 rounded-lg border border-[var(--brand-brown)] px-4 py-2 text-sm font-semibold text-[var(--brand-brown)] hover:bg-[var(--brand-brown)]/5"
        >
          <HugeiconsIcon icon={Add01Icon} className="size-4" />
          Add slot
        </button>
      </div>

      {/* Slot list */}
      {blocks.length > 0 && (
        <ul className="space-y-2">
          {blocks.map((b, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg border border-[var(--brand-outline)] bg-white px-4 py-3 text-sm"
            >
              <span className="font-medium text-[var(--brand-brown)]">
                {b.day_of_week}
              </span>
              <span className="text-muted-foreground">
                {formatSlotTime(b.start_time)} – {formatSlotTime(b.end_time)}
              </span>
              <button
                type="button"
                onClick={() => removeBlock(i)}
                className="ml-4 text-muted-foreground hover:text-destructive"
                aria-label="Remove slot"
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-between border-t border-[var(--brand-outline)] pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-lg border border-[var(--brand-outline)] px-6 py-3 text-sm font-semibold text-[var(--brand-brown)] hover:bg-[var(--brand-surface)] disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)] disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Spinner className="size-4 text-white" /> Creating profile…
            </>
          ) : (
            "Finish & Go Live"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────

export default function MentorProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Step 1 data
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    title: "",
    bio: "",
    hourly_rate: "",
  });

  // Step 2 data
  const [stackId, setStackId] = useState("");
  const [stacks, setStacks] = useState([]);
  const [loadingStacks, setLoadingStacks] = useState(false);

  // Step 3 data
  const [availabilityBlocks, setAvailabilityBlocks] = useState([]);

  // Load stacks when reaching step 2
  const goToStep2 = async () => {
    setStep(2);
    if (stacks.length > 0) return;
    setLoadingStacks(true);
    try {
      const res = await api.get("/api/stacks");
      setStacks(res.data?.data ?? []);
    } catch {
      toast.error("Failed to load stacks. Please refresh.");
    } finally {
      setLoadingStacks(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.put("/api/mentors/profile", {
        name: basicInfo.name.trim(),
        title: basicInfo.title.trim(),
        bio: basicInfo.bio.trim(),
        hourly_rate: Number(basicInfo.hourly_rate),
        stack_id: stackId,
      });

      await Promise.all(
        availabilityBlocks.map((block) =>
          api.post("/api/mentors/availability", block),
        ),
      );

      setDone(true);
      toast.success("Profile created! You're now live on MentorHub.");
    } catch (err) {
      const message =
        err.response?.data?.message ?? "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--brand-surface)] p-6">
        <div className="w-full max-w-lg rounded-xl border border-[var(--brand-outline)] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[var(--brand-brown)]/10 text-[var(--brand-brown)]">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-10" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--brand-brown)]">
            You're live!
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Your profile is published. Students can now find and book sessions
            with you.
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

  // ── Form shell ─────────────────────────────────────────────────────────────
  const titles = ["Basic Info", "Your Expertise", "Availability"];

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
            Complete all three steps to publish your profile and start accepting
            bookings.
          </p>
        </div>

        <StepBar current={step} />

        <div className="w-full rounded-xl border border-[var(--brand-outline)] bg-white p-8 shadow-[0_4px_12px_rgba(74,52,38,0.08)] md:p-12">
          <h2 className="mb-6 text-lg font-bold text-[var(--brand-brown)]">
            {titles[step - 1]}
          </h2>

          {step === 1 && (
            <Step1
              data={basicInfo}
              onChange={(field, val) =>
                setBasicInfo((p) => ({ ...p, [field]: val }))
              }
              onNext={goToStep2}
            />
          )}

          {step === 2 && (
            <Step2
              stackId={stackId}
              onChange={setStackId}
              stacks={stacks}
              loadingStacks={loadingStacks}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <Step3
              blocks={availabilityBlocks}
              onChange={setAvailabilityBlocks}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>
      </main>
    </div>
  );
}