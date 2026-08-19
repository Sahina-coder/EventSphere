import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVenue } from "../../services/venueService";

const VenueForm = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");

  const mutation = useMutation({
    mutationFn: createVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      setName("");
      setLocation("");
      setCapacity("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name,
      location,
      capacity: parseInt(capacity),
      is_available: "Available",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 h-fit">
      <h2 className="font-display text-lg font-semibold mb-1">Add Venue</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Register a new venue for bookings.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Venue name</label>
          <input
            type="text"
            placeholder="Seminar Hall"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Location</label>
          <input
            type="text"
            placeholder="Block A, 2nd Floor"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Capacity</label>
          <input
            type="number"
            placeholder="150"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
        >
          {mutation.isPending ? "Adding…" : "Add venue"}
        </button>
      </form>
    </div>
  );
};

export default VenueForm;