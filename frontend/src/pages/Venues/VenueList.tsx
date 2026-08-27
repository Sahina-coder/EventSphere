import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getVenues } from "../../services/venueService";
import { getBookings } from "../../services/bookingService";

const VenueList = () => {
  const { data: venues, isLoading, error } = useQuery({
    queryKey: ["venues"],
    queryFn: getVenues,
  });
  const { data: bookings } = useQuery({ queryKey: ["bookings"], queryFn: getBookings });

  const getVenueStatus = (venueId: number) => {
    const bookingCount = bookings?.filter((b) => b.venue_id === venueId).length ?? 0;
    if (bookingCount === 0) return { label: "Available", dot: "🟢", color: "#059669" };
    if (bookingCount === 1) return { label: "Partially Used", dot: "🟡", color: "#D97706" };
    return { label: "Fully Booked", dot: "🔴", color: "#DC2626" };
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold">Venues</h2>
        <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
          {venues ? venues.length : 0} total
        </span>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-slate-50 animate-pulse" />
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {venues && venues.length === 0 && (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">🏢</p>
          <p className="text-sm font-medium text-slate-700">No venues yet</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Add one to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {venues?.map((venue, i) => {
          const status = getVenueStatus(venue.id);
          return (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              className="border border-slate-100 rounded-lg pl-4 pr-4 py-3.5 flex items-start justify-between gap-4 hover:shadow-sm transition-shadow duration-200"
              style={{ borderLeft: "3px solid #4F46E5" }}
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-800">{venue.name}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{venue.location}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Capacity: {venue.capacity}</p>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1"
                style={{ backgroundColor: `${status.color}18`, color: status.color }}
              >
                {status.dot} {status.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VenueList;