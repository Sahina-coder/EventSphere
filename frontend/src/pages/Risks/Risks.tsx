import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../services/eventService";
import { getEventRisks } from "../../services/riskService";

const severityStyle: Record<string, { color: string; emoji: string }> = {
  LOW: { color: "#059669", emoji: "🟢" },
  MEDIUM: { color: "#D97706", emoji: "🟡" },
  HIGH: { color: "#EA580C", emoji: "🟠" },
  CRITICAL: { color: "#DC2626", emoji: "🔴" },
};

const Risks = () => {
  const [eventId, setEventId] = useState("");
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: riskData, isLoading } = useQuery({
    queryKey: ["risks", eventId],
    queryFn: () => getEventRisks(parseInt(eventId)),
    enabled: !!eventId,
  });

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-1">Event Risk Detection</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Select an event to identify potential risks.</p>
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

      {eventId && isLoading && <p className="text-sm text-[var(--text-muted)]">Analyzing risks…</p>}

      {eventId && riskData && (
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-base font-semibold">Detected Risks</h3>
            <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
              {riskData.risks.length} found
            </span>
          </div>

          {riskData.risks.length === 0 ? (
            <p className="text-sm text-emerald-600">🟢 No risks detected — this event looks healthy.</p>
          ) : (
            <div className="space-y-3">
              {riskData.risks.map((risk, i) => {
                const style = severityStyle[risk.severity] ?? severityStyle.MEDIUM;
                return (
                  <div
                    key={i}
                    className="border border-slate-100 rounded-lg px-4 py-3.5"
                    style={{ borderLeft: `3px solid ${style.color}` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase" style={{ color: style.color }}>
                        {style.emoji} {risk.severity} — {risk.risk_type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mt-1.5">{risk.description}</p>
                    {risk.suggested_action && (
                      <p className="text-xs text-[var(--text-muted)] mt-1.5">
                        💡 Suggested Action: {risk.suggested_action}
                      </p>
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