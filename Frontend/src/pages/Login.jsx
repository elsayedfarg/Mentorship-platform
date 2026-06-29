import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import AuthLayout from "@/layouts/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }) => {
    const result = await login({
      email: email.trim(),
      password,
    });

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/profile-setup");
      return;
    }

    toast.error(result.error || "Invalid email or password.");
  };

  const onInvalid = () => {
    toast.error("Please fix the errors in the form.");
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-xl border border-[var(--brand-outline)] bg-white shadow-sm">
          <span className="text-2xl font-bold text-[var(--brand-brown)]">M</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--brand-brown)]">
          MentorHub
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="rounded-xl border border-[var(--brand-outline)] bg-white/95 p-8 shadow-[0_4px_24px_rgba(74,52,38,0.08)] backdrop-blur-sm">
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[var(--brand-brown)]"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  strokeWidth={2}
                  className="size-4 text-muted-foreground"
                />
              </div>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                className={cn(
                  "w-full rounded-lg border bg-white py-3 pr-4 pl-10 text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand-teal)] focus:ring-1 focus:ring-[var(--brand-teal)]",
                  errors.email
                    ? "border-destructive bg-destructive/5"
                    : "border-[var(--brand-outline)]",
                )}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <PasswordField
            id="password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-brown-light)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-brown)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Spinner className="size-4 text-white" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-[var(--brand-outline)] pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--brand-brown-light)] transition-colors hover:text-[var(--brand-brown)] hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
