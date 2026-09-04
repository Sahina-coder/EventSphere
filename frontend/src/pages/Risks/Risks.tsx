import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getEventRisks } from "../../services/riskService";

const severityStyle: Record<string, { color: string; emoji: string }> = {
  LOW: { color: "#34d399", emoji: "🟢" },
  MEDIUM: { color: "#f59e0b", emoji: "🟡" },
  HIGH: { color: "#fb923c", emoji: "🟠" },
  CRITICAL: { color: "#fb7185", emoji: "🔴" },
};

const Risks = () => {
  const [eventId, setEventId] = useState("");
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: riskData, isLoading } = useQuery({
    queryKey: ["risks", eventId],
    queryFn: () => getEventRisks(parseInt(eventId)),
    enabled: !!eventId,
  });

  const inputClass = "w-full bg-white/5 border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition";

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Risk Detection <ShieldAlert size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Automated scan across venue, resource, vendor, financial, registration, and attendance risk.</p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Select event</label>
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={`${inputClass} max-w-sm`}>
          <option value="">Select event</option>
          {events?.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      {eventId && isLoading && <p className="text-sm text-[var(--text-muted)]">Analyzing risks…</p>}

      {eventId && riskData && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base font-semibold text-[var(--text)]">Detected Risks</h3>
            <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2.5 py-1 rounded-full">{riskData.risks.length} found</span>
          </div>

          {riskData.risks.length === 0 ? (
            <p className="text-sm text-emerald-400">🟢 No risks detected — this event looks healthy.</p>
          ) : (
            <div className="space-y-3">
              {riskData.risks.map((risk, i) => {
                const style = severityStyle[risk.severity] ?? severityStyle.MEDIUM;
                return (
                  <div key={i} className="border border-[var(--border)] rounded-lg px-4 py-3.5" style={{ borderLeft: `3px solid ${style.color}` }}>
                    <span className="text-xs font-semibold uppercase" style={{ color: style.color }}>
                      {style.emoji} {risk.severity} — {risk.risk_type}
                    </span>
                    <p className="text-sm text-[var(--text)] mt-1.5">{risk.description}</p>
                    {risk.suggested_action && (
                      <p className="text-xs text-[var(--text-muted)] mt-1.5">💡 Suggested Action: {risk.suggested_action}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Risks;