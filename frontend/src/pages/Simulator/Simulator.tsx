import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlaskConical, Users, Wallet } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { simulateParticipants, simulateBudget } from "../../services/simulatorService";

const Simulator = () => {
  const [eventId, setEventId] = useState("");
  const [participants, setParticipants] = useState("");
  const [participantsSearched, setParticipantsSearched] = useState(false);
  const [budgetChange, setBudgetChange] = useState("");
  const [budgetSearched, setBudgetSearched] = useState(false);

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });

  const { data: participantResult, isLoading: pLoading } = useQuery({
    queryKey: ["simParticipants", eventId, participants],
    queryFn: () => simulateParticipants(parseInt(eventId), parseInt(participants)),
    enabled: participantsSearched && !!eventId && !!participants,
  });

  const { data: budgetResult, isLoading: bLoading } = useQuery({
    queryKey: ["simBudget", eventId, budgetChange],
    queryFn: () => simulateBudget(parseInt(eventId), parseFloat(budgetChange)),
    enabled: budgetSearched && !!eventId && !!budgetChange,
  });

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-1 flex items-center gap-2">
          <FlaskConical size={18} /> What-If Simulator
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Test hypothetical changes without affecting real event data.
        </p>
        <select
          value={eventId}
          onChange={(e) => { setEventId(e.target.value); setParticipantsSearched(false); setBudgetSearched(false); }}
          className="w-full max-w-sm bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
        >
          <option value="">Select event</option>
          {events?.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {eventId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
            <h3 className="font-display text-base font-semibold mb-4 flex items-center gap-2">
              <Users size={16} /> What if participants change?
            </h3>
            <form
              onSubmit={(e) => { e.preventDefault(); setParticipantsSearched(true); }}
              className="flex gap-2 mb-4"
            >
              <input
                type="number"
                placeholder="e.g. 500"
                value={participants}
                onChange={(e) => { setParticipants(e.target.value); setParticipantsSearched(false); }}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                required
              />
              <button type="submit" className="bg-[var(--accent)] text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:brightness-110 transition">
                Simulate
              </button>
            </form>

            {pLoading && <p className="text-sm text-[var(--text-muted)]">Analyzing…</p>}

            {participantResult && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Current participants</span>
                  <span className="font-medium">{participantResult.current_participants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Simulated participants</span>
                  <span className="font-medium">{participantResult.simulated_participants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Venue capacity</span>
                  <span className="font-medium">{participantResult.current_venue_capacity ?? "No venue booked"}</span>
                </div>
                {participantResult.capacity_sufficient !== null && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Capacity sufficient?</span>
                    <span className={`font-medium ${participantResult.capacity_sufficient ? "text-emerald-600" : "text-red-500"}`}>
                      {participantResult.capacity_sufficient ? "✅ Yes" : "❌ No"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Est. additional cost</span>
                  <span className="font-medium">₹{participantResult.estimated_additional_cost.toLocaleString()}</span>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 mt-3">
                  <p className="text-xs text-slate-700">💡 {participantResult.recommendation}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
            <h3 className="font-display text-base font-semibold mb-4 flex items-center gap-2">
              <Wallet size={16} /> What if budget changes?
            </h3>
            <form
              onSubmit={(e) => { e.preventDefault(); setBudgetSearched(true); }}
              className="flex gap-2 mb-4"
            >
              <input
                type="number"
                placeholder="e.g. -10000 or 5000"
                value={budgetChange}
                onChange={(e) => { setBudgetChange(e.target.value); setBudgetSearched(false); }}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                required
              />
              <button type="submit" className="bg-[var(--accent)] text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:brightness-110 transition">
                Simulate
              </button>
            </form>

            {bLoading && <p className="text-sm text-[var(--text-muted)]">Analyzing…</p>}

            {budgetResult && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Current budget</span>
                  <span className="font-medium">₹{budgetResult.current_budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Simulated budget</span>
                  <span className="font-medium">₹{budgetResult.simulated_budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Current expenses</span>
                  <span className="font-medium">₹{budgetResult.current_expenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Fits new budget?</span>
                  <span className={`font-medium ${budgetResult.fits_new_budget ? "text-emerald-600" : "text-red-500"}`}>
                    {budgetResult.fits_new_budget ? "✅ Yes" : `❌ No — deficit ₹${budgetResult.deficit.toLocaleString()}`}
                  </span>
                </div>
                {budgetResult.top_expense_categories.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <p className="text-xs text-[var(--text-muted)] mb-1.5">Top expense categories</p>
                    {budgetResult.top_expense_categories.map((c) => (
                      <div key={c.category} className="flex justify-between text-xs">
                        <span>{c.category}</span>
                        <span>₹{c.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-indigo-50 rounded-lg p-3 mt-3">
                  <p className="text-xs text-slate-700">💡 {budgetResult.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulator;