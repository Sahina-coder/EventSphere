import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../services/eventService";
import { getAttendees } from "../../services/attendeeService";
import { useAttendeeContext } from "../../context/AttendeeContext";

const Schedule = () => {
  const { attendeeId } = useAttendeeContext();
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });

  const myEventIds = new Set(attendees?.filter((a) => a.id === attendeeId).map((a) => a.event_id));
  const myEvents = (events?.filter((e) => myEventIds.has(e.id)) ?? []).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Schedule</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Timeline of your registered events.</p>
      </div>

      {!attendeeId ? (
        <p className="text-sm text-[var(--text-muted)]">Select an attendee identity from the sidebar.</p>
      ) : myEvents.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No events on your schedule yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <div className="space-y-5">
            {myEvents.map((e) => (
              <div key={e.id} className="flex gap-4">
                <div className="w-20 shrink-0 text-xs text-[var(--text-muted)] pt-0.5">
                  {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </div>
                <div className="flex-1 border-l-2 border-indigo-100 pl-4 pb-1">
                  <p className="text-sm font-semibold text-slate-800">{e.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {e.event_type} · {new Date(e.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;