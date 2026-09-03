import { useQuery } from "@tanstack/react-query";
import { CalendarRange, Ticket, Sparkles, Compass } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getAttendees } from "../../services/attendeeService";
import { getTickets } from "../../services/ticketService";
import { useAttendeeContext } from "../../context/AttendeeContext";

const StatModule = ({
  label, value, icon: Icon, badgeColor,
}: { label: string; value: string; icon: React.ComponentType<{ size?: number }>; badgeColor: string }) => (
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-start justify-between">
    <div>
      <p className="text-xs text-[var(--text-muted)] mb-2">{label}</p>
      <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
    </div>
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: badgeColor }}>
      <Icon size={16} />
    </div>
  </div>
);

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
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">Select an attendee from the sidebar to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)]">Welcome back, {me?.name} 👋</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Here's what's happening with your events.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatModule label="Upcoming Events" value={String(upcoming.length)} icon={CalendarRange} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="My Tickets" value={String(myTickets.length)} icon={Ticket} badgeColor="rgba(52,211,153,0.15)" />
        <StatModule label="Recommended" value={String(recommended.length)} icon={Sparkles} badgeColor="rgba(245,158,11,0.15)" />
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Upcoming Events</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No upcoming events registered.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {upcoming.map((e) => (
              <div key={e.id} className="py-3 first:pt-0 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0">
                  <CalendarRange size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{e.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{e.event_type} · {new Date(e.date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Compass size={16} className="text-[var(--accent)]" />
          <h2 className="font-display text-base font-semibold text-[var(--text)]">Recommended Events</h2>
        </div>
        {recommended.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No new recommendations right now.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {recommended.map((e) => (
              <div key={e.id} className="py-3 first:pt-0">
                <p className="text-sm font-medium text-[var(--text)]">{e.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{e.event_type} · {new Date(e.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeDashboardHome;