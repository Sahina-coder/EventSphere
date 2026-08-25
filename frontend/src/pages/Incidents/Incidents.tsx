import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertOctagon } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getIncidents, reportIncident, updateIncidentStatus, assignStaff } from "../../services/incidentService";

const incidentTypes = ["Medical Emergency", "Equipment Failure", "Security Issue", "Vendor Issue", "Crowd Management Issue", "Lost Item", "Other"];
const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const statuses = ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const priorityColor: Record<string, string> = {
  LOW: "#059669", MEDIUM: "#D97706", HIGH: "#EA580C", CRITICAL: "#DC2626",
};

const Incidents = () => {
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState("");
  const [incidentType, setIncidentType] = useState(incidentTypes[0]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [assignInput, setAssignInput] = useState<Record<number, string>>({});

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: incidents } = useQuery({ queryKey: ["incidents"], queryFn: getIncidents });

  const reportMutation = useMutation({
    mutationFn: reportIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      setDescription("");
      setLocation("");
      setReportedBy("");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateIncidentStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["incidents"] }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, staffName }: { id: number; staffName: string }) => assignStaff(id, staffName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["incidents"] }),
  });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportMutation.mutate({
      event_id: parseInt(eventId),
      incident_type: incidentType,
      description,
      location: location || undefined,
      reported_by: reportedBy,
      priority,
    });
  };

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 max-w-xl">
        <h2 className="font-display text-lg font-semibold mb-1 flex items-center gap-2">
          <AlertOctagon size={18} /> Report an Incident
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">For issues occurring during an event.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            >
              {incidentTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            />
            <input
              type="text"
              placeholder="Reported by"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={reportMutation.isPending}
            className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
          >
            {reportMutation.isPending ? "Reporting…" : "Report incident"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold">Active Incidents</h2>
          <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
            {incidents ? incidents.length : 0} total
          </span>
        </div>

        {!incidents || incidents.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No incidents reported.</p>
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => {
              const color = priorityColor[inc.priority] ?? "#64748B";
              return (
                <div key={inc.id} className="border border-slate-100 rounded-lg px-4 py-3.5" style={{ borderLeft: `3px solid ${color}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color }}>
                      🚨 #{inc.id} · {inc.priority} · {inc.incident_type}
                    </span>
                    <select
                      value={inc.status}
                      onChange={(e) => statusMutation.mutate({ id: inc.id, status: e.target.value })}
                      className="text-xs font-medium px-2 py-1 rounded-full border-0 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-slate-700 mt-1.5">{inc.description}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {getEventName(inc.event_id)} {inc.location && `· 📍 ${inc.location}`} · Reported by {inc.reported_by}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {inc.assigned_staff ? (
                      <span className="text-xs text-[var(--text-muted)]">Assigned to: <span className="font-medium text-slate-700">{inc.assigned_staff}</span></span>
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="Assign staff…"
                          value={assignInput[inc.id] ?? ""}
                          onChange={(e) => setAssignInput({ ...assignInput, [inc.id]: e.target.value })}
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        />
                        <button
                          onClick={() => {
                            const name = assignInput[inc.id];
                            if (name?.trim()) assignMutation.mutate({ id: inc.id, staffName: name.trim() });
                          }}
                          className="text-xs font-medium text-[var(--accent)] hover:underline"
                        >
                          Assign
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Incidents;