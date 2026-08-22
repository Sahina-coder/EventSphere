import { useQuery } from "@tanstack/react-query";
import { CalendarRange, Ticket, Sparkles } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getAttendees } from "../../services/attendeeService";
import { getTickets } from "../../services/ticketService";
import { useAttendeeContext } from "../../context/AttendeeContext";

const AttendeeDashboardHome = () => {
  const { attendeeId } = useAttendeeContext();
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });
  const { data: tickets } = useQuery({ queryKey: ["tickets"], queryFn: getTickets });

  const me = attendees?.find((a) => a.id === attendeeId);
  const myRegistrations = attendees?.filter((a) => a.id === attendeeId) ?? [];
  const myEventIds = new Set(myRegistrations.map((r) => r.event_id));
  const myEvents = events?.filter((e) => myEventIds.has(e.id)) ?? [];
  const upcoming = myEvents.filter((e) => new Date(e.date) > new Date());
  const myTickets = tickets?.filter((t) => t.attendee_id === attendeeId) ?? [];
  const recommended = events?.filter((e) => !myEventIds.has(e.id)).slice(0, 3) ?? [];

  if (!attendeeId) {
    return (
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">Select an attendee from the sidebar to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Welcome back, {me?.name} 👋</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Here's what's happening with your events.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
          <CalendarRange size={18} className="text-[var(--accent)] mb-2" />
          <p className="text-2xl font-semibold">{upcoming.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Upcoming Events</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
          <Ticket size={18} className="text-emerald-600 mb-2" />
          <p className="text-2xl font-semibold">{myTickets.length}</p>
          <p className="text-xs text-[var(--text-muted)]">My Tickets</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
          <Sparkles size={18} className="text-amber-500 mb-2" />
          <p className="text-2xl font-semibold">{recommended.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Recommended for You</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-base font-semibold mb-4">Upcoming Events</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No upcoming events registered.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((e) => (
              <div key={e.id} className="border border-slate-100 rounded-lg px-4 py-3" style={{ borderLeft: "3px solid #4F46E5" }}>
                <p className="text-sm font-semibold text-slate-800">{e.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {e.event_type} · {new Date(e.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-base font-semibold mb-4">Recommended Events</h2>
        {recommended.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No new recommendations right now.</p>
        ) : (
          <div className="space-y-3">
            {recommended.map((e) => (
              <div key={e.id} className="border border-slate-100 rounded-lg px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">{e.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {e.event_type} · {new Date(e.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeDashboardHome;