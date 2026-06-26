import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import AuthLayout from "@/layouts/AuthLayout";
import RoleSelector from "@/components/auth/RoleSelector";
import PasswordField from "@/components/auth/PasswordField";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm({ email, password, confirmPassword }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm({ email, password, confirmPassword });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const result = await register({
      email: email.trim(),
      password,
      role,
    });

    if (result.success) {
      toast.success("Account created! Let's set up your profile.");
      navigate("/profile-setup");
      return;
    }

    const message = result.error || "Registration failed. Please try again.";
    toast.error(message);

    if (message.toLowerCase().includes("email")) {
      setFieldErrors((prev) => ({ ...prev, email: message }));
    }
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
          Create your account to get started
        </p>
      </div>

      <div className="rounded-xl border border-[var(--brand-outline)] bg-white/95 p-8 shadow-[0_4px_24px_rgba(74,52,38,0.08)] backdrop-blur-sm">
        <RoleSelector value={role} onChange={setRole} />

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                placeholder="you@example.com"
                aria-invalid={!!fieldErrors.email}
                className={cn(
                  "w-full rounded-lg border bg-white py-3 pr-4 pl-10 text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand-teal)] focus:ring-1 focus:ring-[var(--brand-teal)]",
                  fieldErrors.email
                    ? "border-destructive bg-destructive/5"
                    : "border-[var(--brand-outline)]",
                )}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs font-medium text-destructive">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <PasswordField
            id="password"
            label="Password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            error={fieldErrors.password}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword) {
                setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }
            }}
            error={fieldErrors.confirmPassword}
            showToggle={false}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-brown-light)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-brown)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Spinner className="size-4 text-white" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-[var(--brand-outline)] pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--brand-brown-light)] transition-colors hover:text-[var(--brand-brown)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
