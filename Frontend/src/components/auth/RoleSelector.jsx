import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mortarboard01Icon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    value: "student",
    label: "Student",
    description: "Learn from mentors",
    icon: Mortarboard01Icon,
  },
  {
    value: "mentor",
    label: "Mentor",
    description: "Help students grow",
    icon: FavouriteIcon,
  },
];

export default function RoleSelector({ value, onChange }) {
  return (
    <div className="mb-8">
      <p className="mb-3 text-sm font-semibold text-[var(--brand-brown)]">
        I am joining as a:
      </p>
      <div className="grid grid-cols-2 gap-4">
        {ROLES.map((role) => {
          const isActive = value === role.value;

          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onChange(role.value)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
                isActive
                  ? "border-[var(--brand-brown)] bg-[var(--brand-brown)] text-white dark:text-gray-900 shadow-md"
                  : "border-[var(--brand-outline)] bg-card text-muted-foreground hover:border-[var(--brand-brown-light)] hover:text-[var(--brand-brown)]",
              )}
            >
              <HugeiconsIcon
                icon={role.icon}
                strokeWidth={2}
                className={cn("size-8", isActive ? "text-white dark:text-gray-900" : "text-[var(--brand-brown-light)]")}
              />
              <span
                className={cn(
                  "text-sm font-semibold",
                  isActive ? "text-white dark:text-gray-900" : "text-[var(--brand-brown)]",
                )}
              >
                {role.label}
              </span>
              <span
                className={cn(
                  "text-xs",
                  isActive ? "text-white/80" : "text-muted-foreground",
                )}
              >
                {role.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
