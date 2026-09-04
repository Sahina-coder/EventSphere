import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Handshake, TrendingUp, Wallet, Trash2 } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { addSponsor, deleteSponsor, getFinancialSummary } from "../../services/sponsorService";

const sponsorshipTypes = ["Cash", "In-Kind", "Media", "Venue", "Equipment"];

const StatModule = ({
  label, value, icon: Icon, badgeColor, valueColor,
}: { label: string; value: string; icon: React.ComponentType<{ size?: number }>; badgeColor: string; valueColor?: string }) => (
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-start justify-between">
    <div>
      <p className="text-xs text-[var(--text-muted)] mb-2">{label}</p>
      <p className="text-2xl font-bold" style={{ color: valueColor ?? "var(--text)" }}>{value}</p>
    </div>
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: badgeColor }}>
      <Icon size={16} />
    </div>
  </div>
);

const SponsorshipPage = () => {
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

  const inputClass = "w-full bg-white/5 border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition";

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Sponsorship <Handshake size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Track sponsorship revenue alongside expenses.</p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Select event</label>
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={`${inputClass} max-w-sm`}>
          <option value="">Select event</option>
          {events?.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      {eventId && isLoading && <p className="text-sm text-[var(--text-muted)]">Loading…</p>}

      {eventId && summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatModule label="Budget" value={`₹${summary.total_budget.toLocaleString()}`} icon={Wallet} badgeColor="rgba(45,212,191,0.15)" />
            <StatModule label="Sponsorship" value={`+₹${summary.total_sponsorship.toLocaleString()}`} icon={TrendingUp} badgeColor="rgba(52,211,153,0.15)" valueColor="#34d399" />
            <StatModule label="Expenses" value={`-₹${summary.total_expenses.toLocaleString()}`} icon={Wallet} badgeColor="rgba(251,113,133,0.15)" valueColor="#fb7185" />
            <StatModule
              label="Net Balance"
              value={`₹${summary.net_balance.toLocaleString()}`}
              icon={Wallet}
              badgeColor={summary.net_balance >= 0 ? "rgba(52,211,153,0.15)" : "rgba(251,113,133,0.15)"}
              valueColor={summary.net_balance >= 0 ? undefined : "#fb7185"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 h-fit">
              <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Add Sponsor</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Sponsor name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
                <input type="email" placeholder="Contact email (optional)" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputClass} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} required />
                  <select value={sponsorshipType} onChange={(e) => setSponsorshipType(e.target.value)} className={inputClass}>
                    {sponsorshipTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="w-full bg-[var(--accent)] text-[#0a0f0e] font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
                >
                  {addMutation.isPending ? "Adding…" : "Add sponsor"}
                </button>
              </form>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Sponsors</h2>
              {summary.sponsors.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">No sponsors yet.</p>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {summary.sponsors.map((s) => (
                    <div key={s.id} className="py-3 first:pt-0 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--text)]">{s.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{s.sponsorship_type}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-emerald-400">+₹{s.amount.toLocaleString()}</span>
                        <button onClick={() => deleteMutation.mutate(s.id)} className="text-red-400 hover:text-red-300">
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

export default SponsorshipPage;