import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-slate-50 animate-pulse" />
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {events && events.length === 0 && (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📅</p>
          <p className="text-sm font-medium text-slate-700">No events yet</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Create your first event to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {events?.map((event, i) => {
          const color = statusColor[event.status] ?? "#64748B";
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              className="border border-slate-100 rounded-lg pl-4 pr-4 py-3.5 flex items-start justify-between gap-4 hover:shadow-sm transition-shadow duration-200"
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EventList;