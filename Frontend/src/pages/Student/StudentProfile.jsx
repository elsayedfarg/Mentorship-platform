import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useStudentStore from "@/store/studentStore";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const StudentProfile = () => {
  const { profile, loading, fetchProfile, updateProfile } = useStudentStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "" } });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile?.name) {
      reset({ name: profile.name });
    }
  }, [profile, reset]);

  const onSubmit = async ({ name }) => {
    setSubmitting(true);
    const result = await updateProfile({ name: name.trim() });
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
          Update your student profile information.
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
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-[var(--brand-brown)]"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[var(--brand-teal)]",
                  errors.name ? "border-destructive" : "border-[var(--brand-outline)]",
                )}
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
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

export default StudentProfile;
