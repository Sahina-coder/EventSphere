import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "../../services/eventService";

const EventForm = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setName("");
      setEventType("");
      setDate("");
      setBudget("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name,
      event_type: eventType,
      date: new Date(date).toISOString(),
      budget: budget ? parseFloat(budget) : undefined,
      status: "Planned",
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 mb-6 px-6">
      <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-1">
        New entry
      </p>
      <h1 className="font-display text-3xl font-semibold mb-6">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Event name</label>
          <input
            type="text"
            placeholder="Tech Fest 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Event type</label>
          <input
            type="text"
            placeholder="Workshop, Seminar, Fest..."
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Date & time</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Budget (₹)</label>
            <input
              type="number"
              placeholder="90000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[var(--accent)] text-[#0F1729] font-semibold rounded-lg px-4 py-2.5 hover:brightness-110 active:brightness-95 transition disabled:opacity-60"
        >
          {mutation.isPending ? "Creating…" : "Create event"}
        </button>

        {mutation.isSuccess && (
          <p className="text-sm text-[var(--accent)]">Event created.</p>
        )}
      </form>
    </div>
  );
};

export default EventForm;