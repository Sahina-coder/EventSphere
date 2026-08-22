import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVenueRecommendations } from "../../services/recommendationService";

const medal = ["🥇", "🥈", "🥉"];

const VenueRecommendations = () => {
  const [participants, setParticipants] = useState("");
  const [searched, setSearched] = useState(false);

  const { data: results, isLoading } = useQuery({
    queryKey: ["venueRecommendations", participants],
    queryFn: () => getVenueRecommendations(parseInt(participants)),
    enabled: searched && !!participants,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-1">Smart Venue Recommendation</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Enter expected participants to get ranked venue suggestions.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
          <input
            type="number"
            placeholder="e.g. 200"
            value={participants}
            onChange={(e) => { setParticipants(e.target.value); setSearched(false); }}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />
          <button
            type="submit"
            className="bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 transition"
          >
            Find venues
          </button>
        </form>
      </div>

      {isLoading && <p className="text-sm text-[var(--text-muted)]">Ranking venues…</p>}

      {results && (
        <div className="space-y-3">
          {results.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No venues available yet.</p>
          ) : (
            results.map((r, i) => (
              <div key={r.venue_id} className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-base font-semibold">
                      {i < 3 ? medal[i] + " " : ""}{r.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{r.location}</p>
                  </div>
                  <span className="text-lg font-bold text-[var(--accent)]">{r.score}/100</span>
                </div>
                <div className="flex gap-4 mt-3 text-xs text-[var(--text-muted)]">
                  <span>Capacity: {r.capacity}</span>
                  <span>Status: {r.is_available}</span>
                </div>
                <ul className="mt-2 space-y-0.5">
                  {r.reasons.map((reason, j) => (
                    <li key={j} className="text-xs text-slate-500">• {reason}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VenueRecommendations;