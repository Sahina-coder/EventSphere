import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, CalendarRange } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getAttendees, registerAttendee } from "../../services/attendeeService";
import { useAttendeeContext } from "../../context/AttendeeContext";

const DiscoverEvents = () => {
  const queryClient = useQueryClient();
  const { attendeeId } = useAttendeeContext();
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });
  const me = attendees?.find((a) => a.id === attendeeId);

  const mutation = useMutation({
    mutationFn: registerAttendee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendees"] }),
    onSettled: () => setRegisteringId(null),
  });

  const myEventIds = new Set(attendees?.filter((a) => a.id === attendeeId).map((a) => a.event_id));

  const filteredEvents = events?.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));

  const handleRegister = (eventId: number) => {
    if (!me) return;
    setRegisteringId(eventId);
    mutation.mutate({ event_id: eventId, name: me.name, email: me.email, phone: me.phone });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Discover Events <CalendarRange size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Browse and register for upcoming events.</p>
      </div>

      {!attendeeId && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm rounded-lg px-4 py-3">
          Select an attendee identity from the sidebar to register for events.
        </div>
      )}

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search events…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredEvents?.map((e) => {
          const alreadyRegistered = myEventIds.has(e.id);
          return (
            <div key={e.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
              <p className="text-sm font-semibold text-[var(--text)]">{e.name}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{e.event_type} · {new Date(e.date).toLocaleString()}</p>
              <button
                onClick={() => handleRegister(e.id)}
                disabled={!attendeeId || alreadyRegistered || registeringId === e.id}
                className="mt-4 w-full bg-[var(--accent)] text-[#0a0f0e] text-sm font-medium rounded-lg px-4 py-2 hover:brightness-110 transition disabled:opacity-50"
              >
                {alreadyRegistered ? "Registered" : registeringId === e.id ? "Registering…" : "Register"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoverEvents;