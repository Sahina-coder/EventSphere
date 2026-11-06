import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, AlertCircle } from "lucide-react";
import { createEvent } from "../../services/eventService";

const EventForm = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setName("");
      setEventType("");
      setDate("");
      setBudget("");
      setErrorMessage(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || "Failed to create event. Make sure you are logged in as Organizer.";
      setErrorMessage(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    mutation.mutate({
      name,
      event_type: eventType,
      date: new Date(date).toISOString(),
      budget: budget ? parseFloat(budget) : undefined,
      status: "Planned",
    });
  };

  const inputClass =
    "w-full bg-white/5 border border-[var(--border)] rounded-lg px-3.5 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition";

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 h-fit">
      <h2 className="font-display text-base font-semibold text-[var(--text)] mb-1 flex items-center gap-2">
        <PlusCircle size={16} className="text-[var(--accent)]" /> Create Event
      </h2>
      <p className="text-xs text-[var(--text-muted)] mb-5">Add a new event to the system.</p>

      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-xs text-rose-400">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Event name</label>
          <input
            type="text"
            placeholder="Tech Fest 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Event type</label>
          <input
            type="text"
            placeholder="Workshop, Seminar, Hackathon..."
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Date & time</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Budget (₹)</label>
            <input
              type="number"
              placeholder="90000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[var(--accent)] text-slate-900 font-semibold text-xs rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
        >
          {mutation.isPending ? "Creating…" : "Create event"}
        </button>
      </form>
    </div>
  );
};

export default EventForm;