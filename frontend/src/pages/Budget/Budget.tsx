import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { createExpense, deleteExpense, getBudgetSummary } from "../../services/expenseService";

const categories = ["Venue", "Catering", "Decoration", "Photography", "Transportation", "Equipment", "Marketing", "Staff", "Miscellaneous"];

const Budget = () => {
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: summary, isLoading } = useQuery({
    queryKey: ["budgetSummary", eventId],
    queryFn: () => getBudgetSummary(parseInt(eventId)),
    enabled: !!eventId,
  });

  const addMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetSummary", eventId] });
      setCategory("");
      setDescription("");
      setAmount("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgetSummary", eventId] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate({
      event_id: parseInt(eventId),
      category,
      description: description || undefined,
      amount: parseFloat(amount),
    });
  };

  const utilColor = !summary ? "#4F46E5" : summary.utilization_percent >= 100 ? "#DC2626" : summary.utilization_percent >= 80 ? "#D97706" : "#059669";

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-1">Budget & Expenses</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Select an event to view and manage its budget.</p>
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

      {eventId && isLoading && (
        <p className="text-sm text-[var(--text-muted)]">Loading budget summary…</p>
      )}

      {eventId && summary && (
        <>
          {summary.warning && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <AlertTriangle size={16} />
              {summary.warning}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
              <h3 className="font-display text-base font-semibold mb-4">Budget Overview</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Total Budget</span>
                  <span className="font-medium text-slate-800">₹{summary.total_budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Total Expenses</span>
                  <span className="font-medium text-slate-800">₹{summary.total_expenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                  <span className="text-[var(--text-muted)]">Remaining</span>
                  <span className="font-medium" style={{ color: summary.remaining_budget < 0 ? "#DC2626" : "#0F172A" }}>
                    ₹{summary.remaining_budget.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${Math.min(summary.utilization_percent, 100)}%`, backgroundColor: utilColor }}
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">{summary.utilization_percent}% utilized</p>
            </div>

            <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
              <h3 className="font-display text-base font-semibold mb-4">By Category</h3>
              {Object.keys(summary.expenses_by_category).length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">No expenses yet.</p>
              ) : (
                <div className="space-y-2 text-sm">
                  {Object.entries(summary.expenses_by_category).map(([cat, amt]) => (
                    <div key={cat} className="flex justify-between">
                      <span className="text-[var(--text-muted)]">{cat}</span>
                      <span className="font-medium text-slate-800">₹{amt.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 h-fit">
              <h3 className="font-display text-base font-semibold mb-4">Add Expense</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                  required
                />
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
                >
                  {addMutation.isPending ? "Adding…" : "Add expense"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
              <h3 className="font-display text-base font-semibold mb-4">Expense List</h3>
              {summary.expenses.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">No expenses recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {summary.expenses.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{exp.category}</p>
                        {exp.description && <p className="text-xs text-[var(--text-muted)]">{exp.description}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-800">₹{exp.amount.toLocaleString()}</span>
                        <button
                          onClick={() => deleteMutation.mutate(exp.id)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Budget;