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
    <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
          Browse Mentors
        </h2>
        <p className="text-base text-muted-foreground">
          Find the right mentor for your learning goals.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 bg-white border border-[var(--brand-outline)] rounded-xl p-4 shadow-sm"
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name, title, or skill..."
          className="flex-1 rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm outline-none focus:border-[var(--brand-teal)]"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-[var(--brand-outline)] px-4 py-2 text-sm outline-none focus:border-[var(--brand-teal)]"
        >
          <option value="average_rating">Top Rated</option>
          <option value="hourly_rate">Lowest Rate</option>
          <option value="newest">Newest</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-[var(--brand-brown-light)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-brown)]"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading mentors...</p>
      ) : mentors.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12 border border-dashed border-[var(--brand-outline)] rounded-xl">
          No mentors found. Try adjusting your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <div
              key={getId(mentor)}
              className="bg-white rounded-xl border border-[var(--brand-outline)] p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-surface-muted)] flex items-center justify-center text-[var(--brand-brown)] font-bold uppercase">
                  {mentor.name?.[0] || "M"}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {mentor.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{mentor.title}</p>
                </div>
              </div>
              {mentor.bio && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {mentor.bio}
                </p>
              )}
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-sm font-semibold text-[var(--brand-brown)]">
                  ${mentor.hourly_rate}/hr
                </span>
                {mentor.average_rating != null && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    {Number(mentor.average_rating).toFixed(1)}
                  </span>
                )}
              </div>
              <Link
                to={`/dashboard/student/mentors/${getId(mentor)}`}
                className="w-full py-2 text-center bg-transparent border border-[var(--brand-brown-light)] text-[var(--brand-brown-light)] text-sm font-bold rounded hover:bg-[var(--brand-brown-light)] hover:text-white transition-colors"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseMentors;
