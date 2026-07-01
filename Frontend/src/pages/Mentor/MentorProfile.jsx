import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useMentorStore from "@/store/mentorStore";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const MentorProfile = () => {
  const { profile, loading, fetchProfile, updateProfile } = useMentorStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", title: "", bio: "", hourly_rate: "" },
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        hourly_rate: profile.hourly_rate ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (form) => {
    setSubmitting(true);
    const result = await updateProfile({
      name: form.name.trim(),
      title: form.title.trim(),
      bio: form.bio.trim(),
      hourly_rate: Number(form.hourly_rate),
    });
    setSubmitting(false);

    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(result.error || "Failed to update profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          My Profile
        </h2>
        <p className="text-base text-muted-foreground">
          Update your mentor profile information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm flex flex-col gap-4"
      >
        {loading && !profile ? (
          <div className="flex justify-center py-8">
            <Spinner className="size-8 text-[var(--brand-brown)]" />
          </div>
        ) : (
          <>
            {[
              { id: "name", label: "Full Name", type: "text" },
              { id: "title", label: "Professional Title", type: "text" },
            ].map(({ id, label, type }) => (
              <div key={id} className="space-y-2">
                <label htmlFor={id} className="text-sm font-semibold text-[var(--brand-brown)]">
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  className={cn(
                    "w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)]",
                    errors[id] ? "border-destructive" : "border-[var(--brand-outline)]",
                  )}
                  {...register(id, { required: `${label} is required` })}
                />
                {errors[id] && (
                  <p className="text-xs text-destructive">{errors[id].message}</p>
                )}
              </div>
            ))}

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-semibold text-[var(--brand-brown)]">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)] resize-none",
                  errors.bio ? "border-destructive" : "border-[var(--brand-outline)]",
                )}
                {...register("bio", { required: "Bio is required" })}
              />
              {errors.bio && (
                <p className="text-xs text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="hourly_rate" className="text-sm font-semibold text-[var(--brand-brown)]">
                Hourly Rate (USD)
              </label>
              <input
                id="hourly_rate"
                type="number"
                min="0"
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)]",
                  errors.hourly_rate ? "border-destructive" : "border-[var(--brand-outline)]",
                )}
                {...register("hourly_rate", { required: "Hourly rate is required" })}
              />
              {errors.hourly_rate && (
                <p className="text-xs text-destructive">{errors.hourly_rate.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="self-start flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white dark:text-gray-900 hover:bg-[var(--brand-brown)] disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Spinner className="size-4 text-white" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default MentorProfile;
