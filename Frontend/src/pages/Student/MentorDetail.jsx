import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import useStudentStore from "@/store/studentStore";
import { Spinner } from "@/components/ui/spinner";
import {
  datetimeLocalToISO,
  formatDate,
  formatSlotTime,
  getId,
  SESSION_DURATION_MINUTES,
} from "@/lib/format";

const todayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MentorDetail = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const {
    selectedMentor,
    mentorAvailability,
    loading,
    fetchMentorAvailability,
    bookSession,
  } = useStudentStore();
  const [booking, setBooking] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [weeklyBlocks, setWeeklyBlocks] = useState([]);

  const mentor = selectedMentor;

  useEffect(() => {
    const loadWeeklyAvailability = async () => {
      const result = await fetchMentorAvailability(mentorId);
      if (result.success) {
        setWeeklyBlocks(result.availability?.availability_blocks || []);
      }
    };

    loadWeeklyAvailability();
  }, [mentorId, fetchMentorAvailability]);

  useEffect(() => {
    if (!selectedDate) {
      setSelectedSlot(null);
      return;
    }

    const loadSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);
      const result = await fetchMentorAvailability(mentorId, selectedDate);
      setLoadingSlots(false);

      if (!result.success) {
        toast.error(result.error || "Failed to load available times.");
      }
    };

    loadSlots();
  }, [selectedDate, mentorId, fetchMentorAvailability]);

  const slots = selectedDate ? mentorAvailability?.slots || [] : [];
  const availableSlots = slots.filter((slot) => slot.available);

  const handleBook = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlot) {
      toast.error("Please select a date and an available time slot.");
      return;
    }

    if (description.trim().length < 10) {
      toast.error("Description must be at least 10 characters.");
      return;
    }

    setBooking(true);
    const result = await bookSession({
      mentor_id: mentorId,
      start_time: datetimeLocalToISO(`${selectedDate}T${selectedSlot.start_time}`),
      end_time: datetimeLocalToISO(`${selectedDate}T${selectedSlot.end_time}`),
      description: description.trim(),
    });
    setBooking(false);

    if (result.success) {
      toast.success("Session booked successfully!");
      navigate("/dashboard/student/sessions");
    } else {
      toast.error(result.error || "Failed to book session.");
    }
  };

  if (loading && !mentor) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="size-8 text-[var(--brand-brown)]" />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <p className="text-muted-foreground mb-4">Mentor not found.</p>
        <Link
          to="/dashboard/student/mentors"
          className="text-sm font-semibold text-[var(--brand-brown-light)] hover:underline"
        >
          Back to Browse Mentors
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 pb-12">
      <Link
        to="/dashboard/student/mentors"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[var(--brand-brown)] mt-2"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to mentors
      </Link>

      <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--brand-surface-muted)] flex items-center justify-center text-[var(--brand-brown)] text-2xl font-bold uppercase">
            {mentor.name?.[0] || "M"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--brand-brown)]">
              {mentor.name}
            </h2>
            <p className="text-muted-foreground">{mentor.title}</p>
            <p className="text-sm font-semibold text-[var(--brand-brown)] mt-1">
              ${mentor.hourly_rate}/hr
            </p>
          </div>
        </div>
        {mentor.bio && (
          <p className="mt-4 text-sm text-gray-700 leading-relaxed">{mentor.bio}</p>
        )}
      </div>

      {weeklyBlocks.length > 0 && (
        <div className="bg-white border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Weekly Availability</h3>
          <div className="flex flex-col gap-2">
            {weeklyBlocks.map((block) => (
              <div
                key={getId(block) || `${block.day_of_week}-${block.start_time}`}
                className="flex items-center justify-between rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm"
              >
                <span className="font-semibold text-[var(--brand-brown)]">
                  {block.day_of_week}
                </span>
                <span className="text-muted-foreground">
                  {formatSlotTime(block.start_time)} – {formatSlotTime(block.end_time)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleBook}
        className="bg-white border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm flex flex-col gap-5"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900">Book a Session</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a date, then pick a {SESSION_DURATION_MINUTES}-minute code evaluation slot
            from the mentor&apos;s open schedule.
          </p>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="session-date"
            className="text-sm font-semibold text-[var(--brand-brown)]"
          >
            Date
          </label>
          <input
            id="session-date"
            type="date"
            value={selectedDate}
            min={todayDateString()}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
            className="w-full rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm outline-none focus:border-[var(--brand-teal)]"
          />
        </div>

        {selectedDate && (
          <div className="space-y-2">
            <div>
              <p className="text-sm font-semibold text-[var(--brand-brown)]">
                Available Times
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(`${selectedDate}T12:00:00.000Z`)}
                {mentorAvailability?.day_of_week
                  ? ` • ${mentorAvailability.day_of_week}`
                  : ""}
              </p>
            </div>

            {loadingSlots ? (
              <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                <Spinner className="size-4 text-[var(--brand-brown)]" />
                Loading available times...
              </div>
            ) : slots.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--brand-outline)] px-4 py-6 text-sm text-muted-foreground text-center">
                No availability on this day. Please choose another date.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {slots.map((slot) => {
                  const isSelected =
                    selectedSlot?.start_time === slot.start_time &&
                    selectedSlot?.end_time === slot.end_time;

                  return (
                    <button
                      key={`${slot.start_time}-${slot.end_time}`}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                        !slot.available
                          ? "cursor-not-allowed border-[var(--brand-outline)] bg-gray-50 text-muted-foreground opacity-60"
                          : isSelected
                            ? "border-2 border-[var(--brand-brown-light)] bg-[var(--brand-surface-muted)] text-[var(--brand-brown)] font-semibold shadow-sm"
                            : "border-[var(--brand-outline)] hover:border-[var(--brand-brown-light)] hover:text-[var(--brand-brown)]"
                      }`}
                    >
                      <span>{formatSlotTime(slot.start_time)}</span>
                      <span className="text-muted-foreground"> – </span>
                      <span>{formatSlotTime(slot.end_time)}</span>
                      {!slot.available && (
                        <span className="float-right text-xs uppercase tracking-wide">
                          Unavailable
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {selectedSlot && (
              <p className="text-sm text-[var(--brand-brown)]">
                Selected: {formatSlotTime(selectedSlot.start_time)} –{" "}
                {formatSlotTime(selectedSlot.end_time)} on{" "}
                {formatDate(`${selectedDate}T12:00:00.000Z`)}
              </p>
            )}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[var(--brand-brown)]">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you'd like to review in this 45-minute code evaluation session"
            required
            minLength={10}
            className="w-full rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm outline-none focus:border-[var(--brand-teal)] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={booking || !selectedSlot || availableSlots.length === 0}
          className="self-start flex items-center gap-2 rounded-lg bg-[var(--brand-brown-light)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-brown)] disabled:opacity-70"
        >
          {booking ? (
            <>
              <Spinner className="size-4 text-white" />
              Booking...
            </>
          ) : (
            "Book Session"
          )}
        </button>
      </form>
    </div>
  );
};

export default MentorDetail;
