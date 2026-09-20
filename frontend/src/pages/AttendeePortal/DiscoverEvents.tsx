import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, CalendarRange } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getAttendees, registerAttendee } from "../../services/attendeeService";
import { useAuth } from "../../context/AuthContext";

const DiscoverEvents = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });

  const mutation = useMutation({
    mutationFn: registerAttendee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendees"] });
      setErrorMsg("");
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.detail || "Registration failed. Please try again.");
    },
    onSettled: () => setRegisteringId(null),
  });

  const myEventIds = new Set(attendees?.filter((a) => a.email === user?.email).map((a) => a.event_id));
  const filteredEvents = events?.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));

  const handleRegister = (eventId: number) => {
    if (!user) return;
    if (!user.phone) {
      setErrorMsg("Your account doesn't have a phone number on file. Please contact support.");
      return;
    }
    setErrorMsg("");
    setRegisteringId(eventId);
    mutation.mutate({ event_id: eventId, name: user.name, email: user.email, phone: user.phone });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Discover Events <CalendarRange size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Browse and register for upcoming events.</p>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {errorMsg}
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
                disabled={alreadyRegistered || registeringId === e.id}
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