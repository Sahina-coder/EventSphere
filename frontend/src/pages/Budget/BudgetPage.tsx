import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Wallet, AlertTriangle, TrendingDown, Search, Download } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { createExpense, deleteExpense, getBudgetSummary } from "../../services/expenseService";

interface BudgetPageProps {
  onNavigate: (tab: string) => void;
}

const categories = ["Venue", "Catering", "Decoration", "Photography", "Transportation", "Equipment", "Marketing", "Staff", "Miscellaneous"];
const donutColors = ["#2dd4bf", "#34d399", "#f59e0b", "#60a5fa", "#fb7185", "#a78bfa", "#94a3b8", "#f472b6", "#4ade80"];

const StatModule = ({
  label, value, icon: Icon, badgeColor,
}: { label: string; value: string; icon: React.ComponentType<{ size?: number }>; badgeColor: string }) => (
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-start justify-between">
    <div>
      <p className="text-xs text-[var(--text-muted)] mb-2">{label}</p>
      <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
    </div>
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: badgeColor }}>
      <Icon size={16} />
    </div>
  </div>
);

const BudgetPage = ({ onNavigate }: BudgetPageProps) => {
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");

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

  const utilColor = !summary ? "#2dd4bf" : summary.utilization_percent >= 100 ? "#fb7185" : summary.utilization_percent >= 80 ? "#f59e0b" : "#34d399";

  const donutData = summary
    ? Object.entries(summary.expenses_by_category).map(([name, value], i) => ({ name, value, color: donutColors[i % donutColors.length] }))
    : [];

  const filteredExpenses = summary?.expenses.filter((e) => e.category.toLowerCase().includes(search.toLowerCase()) || (e.description ?? "").toLowerCase().includes(search.toLowerCase()));

  const inputClass = "w-full bg-white/5 border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition";

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Budget & Expenses <Wallet size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Track spending and stay within budget.</p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Select event</label>
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={`${inputClass} max-w-sm`}>
          <option value="">Select event</option>
          {events?.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      {eventId && isLoading && <p className="text-sm text-[var(--text-muted)]">Loading budget summary…</p>}

      {eventId && summary && (
        <>
          {summary.warning && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <AlertTriangle size={16} />
              {summary.warning}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatModule label="Total Budget" value={`₹${summary.total_budget.toLocaleString()}`} icon={Wallet} badgeColor="rgba(45,212,191,0.15)" />
            <StatModule label="Total Expenses" value={`₹${summary.total_expenses.toLocaleString()}`} icon={TrendingDown} badgeColor="rgba(251,113,133,0.15)" />
            <StatModule
              label="Remaining"
              value={`₹${summary.remaining_budget.toLocaleString()}`}
              icon={Wallet}
              badgeColor={summary.remaining_budget < 0 ? "rgba(251,113,133,0.15)" : "rgba(52,211,153,0.15)"}
            />
            <StatModule label="Utilization" value={`${summary.utilization_percent}%`} icon={AlertTriangle} badgeColor={`${utilColor}26`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 h-fit">
              <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Add Expense</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} required>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} required />
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="w-full bg-[var(--accent)] text-[#0a0f0e] font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
                >
                  {addMutation.isPending ? "Adding…" : "Add expense"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-display text-base font-semibold text-[var(--text)]">Expenses</h2>
                <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full">{summary.expenses.length} total</span>
              </div>
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search expenses…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                />
              </div>
              <div className="divide-y divide-[var(--border)] max-h-[320px] overflow-y-auto">
                {filteredExpenses && filteredExpenses.length === 0 && <p className="text-sm text-[var(--text-muted)] py-4">No expenses recorded yet.</p>}
                {filteredExpenses?.map((exp) => (
                  <div key={exp.id} className="py-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{exp.category}</p>
                      {exp.description && <p className="text-xs text-[var(--text-muted)] truncate">{exp.description}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-medium text-[var(--text)]">₹{exp.amount.toLocaleString()}</span>
                      <button onClick={() => deleteMutation.mutate(exp.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">By Category</h2>
              {donutData.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">No expenses yet.</p>
              ) : (
                <>
                  <div className="relative h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={donutData} dataKey="value" innerRadius={50} outerRadius={72} paddingAngle={2}>
                          {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-lg font-bold text-[var(--text)]">₹{summary.total_expenses.toLocaleString()}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Total Spent</p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    {donutData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-[var(--text-muted)] truncate">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                          {d.name}
                        </span>
                        <span className="text-[var(--text)] font-medium shrink-0">₹{d.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="font-display text-sm font-semibold text-[var(--text)] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md">
              <button onClick={() => onNavigate("Sponsorship")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Wallet size={14} /></div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">Add Sponsorship</p>
                  <p className="text-xs text-[var(--text-muted)]">Track sponsor revenue</p>
                </div>
              </button>
              <button onClick={() => onNavigate("Export")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Download size={14} /></div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">Export Report</p>
                  <p className="text-xs text-[var(--text-muted)]">Download budget summary</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetPage;