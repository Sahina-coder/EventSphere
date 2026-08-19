import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/bookingService";
import { getEvents } from "../../services/eventService";
import { getVenues } from "../../services/venueService";

const BookingList = () => {
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: venues } = useQuery({ queryKey: ["venues"], queryFn: getVenues });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const getVenueName = (id: number) => venues?.find((v) => v.id === id)?.name ?? `Venue #${id}`;

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold">Bookings</h2>
        <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
          {bookings ? bookings.length : 0} total
        </span>
      </div>

      {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading bookings…</p>}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {bookings && bookings.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No bookings yet — create one to get started.</p>
      )}

      <div className="space-y-3">
        {bookings?.map((booking) => (
          <div
            key={booking.id}
            className="border border-slate-100 rounded-lg px-4 py-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            style={{ borderLeft: "3px solid #4F46E5" }}
          >
            <h3 className="text-sm font-semibold text-slate-800">{getEventName(booking.event_id)}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{getVenueName(booking.venue_id)}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {new Date(booking.start_time).toLocaleString()} → {new Date(booking.end_time).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;