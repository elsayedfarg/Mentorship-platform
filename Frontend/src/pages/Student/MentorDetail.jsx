import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import useStudentStore from "@/store/studentStore";
import { Spinner } from "@/components/ui/spinner";
import { getId } from "@/lib/format";

const MentorDetail = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { selectedMentor, loading, bookSession } = useStudentStore();
  const [booking, setBooking] = useState(false);
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const mentor = selectedMentor;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      toast.error("Please select start and end times.");
      return;
    }

    setBooking(true);
    const result = await bookSession({
      mentor_id: mentorId,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
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

      <form
        onSubmit={handleBook}
        className="bg-white border border-[var(--brand-outline)] rounded-xl p-6 shadow-sm flex flex-col gap-4"
      >
        <h3 className="text-lg font-bold text-gray-900">Book a Session</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[var(--brand-brown)]">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm outline-none focus:border-[var(--brand-teal)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[var(--brand-brown)]">
              End Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm outline-none focus:border-[var(--brand-teal)]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[var(--brand-brown)]">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What would you like to discuss?"
            className="w-full rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm outline-none focus:border-[var(--brand-teal)] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={booking}
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
