import { useState } from "react";
import { Link } from "react-router";
import useStudentStore from "@/store/studentStore";
import { getId } from "@/lib/format";

const BrowseMentors = () => {
  const { mentors, loading, fetchMentors } = useStudentStore();
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("average_rating");

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMentors({ keyword, sort_by: sortBy });
  };

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1440px] flex-col gap-4 pb-10 sm:gap-6 sm:pb-12 md:gap-8">
      <div className="mt-1 flex flex-col gap-1 sm:mt-2">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--brand-brown)] sm:text-3xl">
          Browse Mentors
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Find the right mentor for your learning goals.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-3 rounded-xl border border-[var(--brand-outline)] bg-white p-3 shadow-sm sm:p-4 md:grid-cols-[minmax(0,1fr)_160px_auto]"
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name, title, or skill..."
          className="min-w-0 w-full rounded-lg border border-[var(--brand-outline)] px-4 py-2.5 text-sm outline-none focus:border-[var(--brand-teal)] md:col-span-1"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="min-w-0 w-full rounded-lg border border-[var(--brand-outline)] px-4 py-2.5 text-sm outline-none focus:border-[var(--brand-teal)]"
        >
          <option value="average_rating">Top Rated</option>
          <option value="hourly_rate">Lowest Rate</option>
          <option value="newest">Newest</option>
        </select>
        <button
          type="submit"
          className="w-full rounded-lg bg-[var(--brand-brown-light)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-brown)] md:w-auto"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Loading mentors...
        </p>
      ) : mentors.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--brand-outline)] py-12 text-center text-sm text-muted-foreground">
          No mentors found. Try adjusting your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-w-0 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {mentors.map((mentor) => (
            <article
              key={getId(mentor)}
              className="flex min-w-0 flex-col gap-3 rounded-xl border border-[var(--brand-outline)] bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
            >
              <div className="flex items-start justify-between gap-3 min-w-0">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-surface-muted)] text-base font-bold uppercase text-[var(--brand-brown)] sm:h-14 sm:w-14">
                    {mentor.name?.[0] || "M"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                      {mentor.name}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground sm:text-sm">
                      {mentor.title}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-[var(--brand-brown)] sm:text-base">
                    ${mentor.hourly_rate}/hr
                  </p>
                  {mentor.average_rating != null && (
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      {Number(mentor.average_rating).toFixed(1)}
                    </p>
                  )}
                </div>
              </div>

              {mentor.bio && (
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {mentor.bio}
                </p>
              )}

              {mentor.stack_id?.name && (
                <span className="w-fit max-w-full truncate rounded border border-[var(--brand-outline)] bg-[var(--brand-surface-muted)] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {mentor.stack_id.name}
                </span>
              )}

              <Link
                to={`/dashboard/student/mentors/${getId(mentor)}`}
                className="mt-auto w-full rounded-lg border border-[var(--brand-brown-light)] py-2.5 text-center text-sm font-bold text-[var(--brand-brown-light)] transition-colors hover:bg-[var(--brand-brown-light)] hover:text-white"
              >
                View Profile
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseMentors;
