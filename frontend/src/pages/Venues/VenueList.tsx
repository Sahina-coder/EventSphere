import { useQuery } from "@tanstack/react-query";
import { getVenues } from "../../services/venueService";

const VenueList = () => {
  const { data: venues, isLoading, error } = useQuery({
    queryKey: ["venues"],
    queryFn: getVenues,
  });

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold">Venues</h2>
        <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
          {venues ? venues.length : 0} total
        </span>
      </div>

      {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading venues…</p>}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {venues && venues.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No venues yet — add one to get started.</p>
      )}

      <div className="space-y-3">
        {venues?.map((venue) => (
          <div
            key={venue.id}
            className="border border-slate-100 rounded-lg pl-4 pr-4 py-3.5 flex items-start justify-between gap-4 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            style={{ borderLeft: "3px solid #4F46E5" }}
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-800">{venue.name}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{venue.location}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Capacity: {venue.capacity}</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap bg-indigo-50 text-[var(--accent)]">
              {venue.is_available}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueList;