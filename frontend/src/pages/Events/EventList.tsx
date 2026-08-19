import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../services/eventService";

const statusColor: Record<string, string> = {
  Planned: "#4F46E5",
  Ongoing: "#059669",
  Completed: "#64748B",
  Cancelled: "#DC2626",
};

const EventList = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold">Events</h2>
        <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
          {events ? events.length : 0} total
        </span>
      </div>

      {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading events…</p>}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {events && events.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No events yet — create one to get started.</p>
      )}

      <div className="space-y-3">
        {events?.map((event) => {
          const color = statusColor[event.status] ?? "#64748B";
          return (
            <div
              key={event.id}
              className="border border-slate-100 rounded-lg pl-4 pr-4 py-3.5 flex items-start justify-between gap-4 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-800">{event.name}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {event.event_type} · {new Date(event.date).toLocaleString()}
                </p>
                {event.budget != null && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">Budget ₹{event.budget.toLocaleString()}</p>
                )}
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{ backgroundColor: `${color}18`, color }}
              >
                {event.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventList;