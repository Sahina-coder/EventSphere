import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Handshake, Trash2 } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { addSponsor, deleteSponsor, getFinancialSummary } from "../../services/sponsorService";

const sponsorshipTypes = ["Cash", "In-Kind", "Media", "Venue", "Equipment"];

const Sponsorship = () => {
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState("");
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [sponsorshipType, setSponsorshipType] = useState("Cash");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: summary, isLoading } = useQuery({
    queryKey: ["financialSummary", eventId],
    queryFn: () => getFinancialSummary(parseInt(eventId)),
    enabled: !!eventId,
  });

  const addMutation = useMutation({
    mutationFn: addSponsor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financialSummary", eventId] });
      setName("");
      setContactEmail("");
      setAmount("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSponsor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financialSummary", eventId] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate({
      event_id: parseInt(eventId),
      name,
      contact_email: contactEmail || undefined,
      amount: parseFloat(amount),
      sponsorship_type: sponsorshipType,
    });
  };

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-1 flex items-center gap-2">
          <Handshake size={18} /> Sponsorship Management
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Track sponsorship revenue alongside expenses.</p>
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

      {eventId && isLoading && <p className="text-sm text-[var(--text-muted)]">Loading…</p>}

      {eventId && summary && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
              <p className="text-xl font-semibold text-slate-900">₹{summary.total_budget.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Budget</p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
              <p className="text-xl font-semibold text-emerald-600">+₹{summary.total_sponsorship.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Sponsorship</p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
              <p className="text-xl font-semibold text-red-500">-₹{summary.total_expenses.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Expenses</p>
            </div>
            <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
              <p className={`text-xl font-semibold ${summary.net_balance >= 0 ? "text-slate-900" : "text-red-500"}`}>
                ₹{summary.net_balance.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Net Balance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 h-fit">
              <h3 className="font-display text-base font-semibold mb-4">Add Sponsor</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Sponsor name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                  required
                />
                <input
                  type="email"
                  placeholder="Contact email (optional)"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                    required
                  />
                  <select
                    value={sponsorshipType}
                    onChange={(e) => setSponsorshipType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
                  >
                    {sponsorshipTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
                >
                  {addMutation.isPending ? "Adding…" : "Add sponsor"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
              <h3 className="font-display text-base font-semibold mb-4">Sponsors</h3>
              {summary.sponsors.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">No sponsors yet.</p>
              ) : (
                <div className="space-y-2">
                  {summary.sponsors.map((s) => (
                    <div key={s.id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{s.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{s.sponsorship_type}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-emerald-600">+₹{s.amount.toLocaleString()}</span>
                        <button onClick={() => deleteMutation.mutate(s.id)} className="text-red-400 hover:text-red-500">
                          <Trash2 size={14} />
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

export default Sponsorship;