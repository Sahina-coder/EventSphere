import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getHealthScore } from "../../services/healthScoreService";

const statusColor: Record<string, string> = {
  Healthy: "#059669",
  "Needs Attention": "#D97706",
  "At Risk": "#EA580C",
  Critical: "#DC2626",
};

const statusEmoji: Record<string, string> = {
  Healthy: "🟢",
  "Needs Attention": "🟡",
  "At Risk": "🟠",
  Critical: "🔴",
};

const breakdownLabels: Record<string, string> = {
  registration: "Registration Readiness",
  venue: "Venue Readiness",
  resources: "Resource Readiness",
  vendors: "Vendor Confirmation",
  budget: "Budget Health",
  schedule: "Schedule Readiness",
  attendance: "Attendance/Engagement",
};

const breakdownMax: Record<string, number> = {
  registration: 20,
  venue: 15,
  resources: 15,
  vendors: 15,
  budget: 10,
  schedule: 10,
  attendance: 15,
};

const HealthScore = () => {
  const [eventId, setEventId] = useState("");
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: health, isLoading } = useQuery({
    queryKey: ["healthScore", eventId],
    queryFn: () => getHealthScore(parseInt(eventId)),
    enabled: !!eventId,
  });

  const color = health ? statusColor[health.status] : "#4F46E5";

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-1">Event Health Score</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Select an event to see its readiness score.</p>
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="w-full max-w-sm bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
        >
          <option value="">Select event</option>
          {events?.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {eventId && isLoading && <p className="text-sm text-[var(--text-muted)]">Calculating…</p>}

      {eventId && health && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center border-8"
              style={{ borderColor: color }}
            >
              <span className="text-3xl font-bold" style={{ color }}>{health.score}</span>
            </div>
            <p className="text-sm font-medium mt-4" style={{ color }}>
              {statusEmoji[health.status]} {health.status}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">out of 100</p>
          </div>

          <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
            <h3 className="font-display text-base font-semibold mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(health.breakdown).map(([key, value]) => {
                const max = breakdownMax[key] ?? 100;
                const pct = (value / max) * 100;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-muted)]">{breakdownLabels[key] ?? key}</span>
                      <span className="font-medium text-slate-700">{value}/{max}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent)] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {health.issues.length > 0 && (
            <div className="md:col-span-2 bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
              <h3 className="font-display text-base font-semibold mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-500" />
                Main Issues
              </h3>
              <ul className="space-y-1.5">
                {health.issues.map((issue, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthScore;