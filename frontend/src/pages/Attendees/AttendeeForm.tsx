import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { registerAttendee } from "../../services/attendeeService";
import { getEvents } from "../../services/eventService";

const AttendeeForm = () => {
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });

  const mutation = useMutation({
    mutationFn: registerAttendee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendees"] });
      setEventId("");
      setName("");
      setEmail("");
      setPhone("");
      setCollege("");
      setDepartment("");
      setErrorMsg("");
    },
    onError: (error: any) => {
      const detail = error?.response?.data?.detail;
      if (Array.isArray(detail)) {
        setErrorMsg(detail[0]?.msg || "Invalid input");
      } else {
        setErrorMsg(detail || "Something went wrong. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    mutation.mutate({
      event_id: parseInt(eventId),
      name,
      email,
      phone,
      college: college || undefined,
      department: department || undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 h-fit">
      <h2 className="font-display text-lg font-semibold mb-1">Register Attendee</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Add a participant to an event.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Event</label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          >
            <option value="">Select event</option>
            {events?.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Full name</label>
          <input
            type="text"
            placeholder="Sahina"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone</label>
            <input
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">College</label>
            <input
              type="text"
              placeholder="Optional"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Department</label>
            <input
              type="text"
              placeholder="Optional"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3.5 py-2.5">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
        >
          {mutation.isPending ? "Registering…" : "Register attendee"}
        </button>
      </form>
    </div>
  );
};

export default AttendeeForm;