import { useState } from "react";
import { toast } from "sonner";
import useMentorStore from "@/store/mentorStore";
import { getId } from "@/lib/format";
import { Spinner } from "@/components/ui/spinner";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MentorAvailability = () => {
  const { availability, addAvailability, removeAvailability } = useMentorStore();
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await addAvailability({
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
    });
    setSubmitting(false);

    if (result.success) {
      toast.success("Availability block added.");
    } else {
      toast.error(result.error || "Failed to add availability.");
    }
  };

  const handleRemove = async (availabilityId) => {
    setRemovingId(availabilityId);
    const result = await removeAvailability(availabilityId);
    setRemovingId(null);

    if (result.success) {
      toast.success("Availability block removed.");
    } else {
      toast.error(result.error || "Failed to remove availability.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          Availability
        </h2>
        <p className="text-base text-muted-foreground">
          Set your weekly availability for mentorship sessions.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-white border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm flex flex-col gap-4"
      >
        <h3 className="text-lg font-bold text-gray-900">Add Availability Block</h3>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[var(--brand-brown)]">
            Day of Week
          </label>
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm outline-none focus:border-[var(--brand-teal)]"
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[var(--brand-brown)]">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm outline-none focus:border-[var(--brand-teal)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[var(--brand-brown)]">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm outline-none focus:border-[var(--brand-teal)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="self-start flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)] disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Spinner className="size-4 text-white" />
              Adding...
            </>
          ) : (
            "Add Block"
          )}
        </button>
      </form>

      <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Schedule</h3>
        {availability.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No availability blocks yet. Add one above.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {availability.map((block) => {
              const blockId = getId(block);
              return (
                <div
                  key={blockId}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--brand-outline)] bg-[var(--brand-surface-muted)]"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {block.day_of_week}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {block.start_time} – {block.end_time}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(blockId)}
                    disabled={removingId === blockId}
                    className="text-xs font-semibold text-destructive hover:underline disabled:opacity-50"
                  >
                    {removingId === blockId ? "Removing..." : "Remove"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorAvailability;
