import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../services/eventService";

const statusColor: Record<string, string> = {
  Planned: "#F5A623",
  Ongoing: "#3B9E6F",
  Completed: "#5A6B8C",
  Cancelled: "#C4534A",
};

const EventList = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  return (
    <div className="max-w-xl mx-auto px-6 pb-16">
      <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-1">
        {events ? `${events.length} total` : ""}
      </p>
      <h1 className="font-display text-3xl font-semibold mb-6">Events</h1>

      {isLoading && (
        <p className="text-[var(--text-muted)] text-sm">Loading events…</p>
      )}

      {error && (
        <p className="text-sm text-red-400">
          Couldn't reach the server. Is the backend running?
        </p>
      )}

      {events && events.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">
          No events yet — create one above to get started.
        </p>
      )}

      <div className="space-y-3">
        {events?.map((event) => {
          const color = statusColor[event.status] ?? "#5A6B8C";
          return (
            <div
              key={event.id}
              className="bg-[var(--card)] border border-[var(--border)] rounded-lg pl-4 pr-5 py-4 flex items-start justify-between gap-4"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <div>
                <h2 className="font-display text-base font-semibold">{event.name}</h2>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                  {event.event_type} · {new Date(event.date).toLocaleString()}
                </p>
                {event.budget != null && (
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Budget ₹{event.budget.toLocaleString()}
                  </p>
                )}
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{ backgroundColor: `${color}22`, color }}
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