import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export default function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  showToggle = true,
  className,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[var(--brand-brown)]"
      >
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <HugeiconsIcon
            icon={LockIcon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
        </div>
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={cn(
            "w-full rounded-lg border bg-white py-3 pr-10 pl-10 text-sm text-foreground shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand-teal)] focus:ring-1 focus:ring-[var(--brand-teal)]",
            error
              ? "border-destructive bg-destructive/5"
              : "border-[var(--brand-outline)]",
          )}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-[var(--brand-teal)]"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            <HugeiconsIcon
              icon={visible ? ViewOffSlashIcon : ViewIcon}
              strokeWidth={2}
              className="size-4"
            />
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
