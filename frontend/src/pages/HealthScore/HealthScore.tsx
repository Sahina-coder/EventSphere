import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, HeartPulse } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getHealthScore } from "../../services/healthScoreService";

const statusColor: Record<string, string> = {
  Healthy: "#34d399",
  "Needs Attention": "#f59e0b",
  "At Risk": "#fb923c",
  Critical: "#fb7185",
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
  registration: 20, venue: 15, resources: 15, vendors: 15, budget: 10, schedule: 10, attendance: 15,
};

const HealthScore = () => {
  const [eventId, setEventId] = useState("");
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: health, isLoading } = useQuery({
    queryKey: ["healthScore", eventId],
    queryFn: () => getHealthScore(parseInt(eventId)),
    enabled: !!eventId,
  });

  const color = health ? statusColor[health.status] : "#2dd4bf";
  const inputClass = "w-full bg-white/5 border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition";

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Event Health Score <HeartPulse size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Weighted readiness score across every operational dimension.</p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Select event</label>
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={`${inputClass} max-w-sm`}>
          <option value="">Select event</option>
          {events?.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      {eventId && isLoading && <p className="text-sm text-[var(--text-muted)]">Calculating…</p>}

      {eventId && health && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 rounded-full flex items-center justify-center border-8" style={{ borderColor: color }}>
              <span className="text-3xl font-bold" style={{ color }}>{health.score}</span>
            </div>
            <p className="text-sm font-medium mt-4" style={{ color }}>{statusEmoji[health.status]} {health.status}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">out of 100</p>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="font-display text-base font-semibold text-[var(--text)] mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(health.breakdown).map(([key, value]) => {
                const max = breakdownMax[key] ?? 100;
                const pct = (value / max) * 100;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-muted)]">{breakdownLabels[key] ?? key}</span>
                      <span className="font-medium text-[var(--text)]">{value}/{max}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {health.issues.length > 0 && (
            <div className="md:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="font-display text-base font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-400" /> Main Issues
              </h3>
              <ul className="space-y-1.5">
                {health.issues.map((issue, i) => (
                  <li key={i} className="text-sm text-[var(--text-muted)] flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
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