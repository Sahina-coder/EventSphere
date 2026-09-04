import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardCheck, Clock, CheckCircle2, XCircle, Search, Check, X } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getApprovals, createApprovalRequest, decideApproval } from "../../services/approvalService";

const requestTypes = ["Vendor Payment", "Budget Increase", "Resource Purchase", "Venue Change", "Other"];
const statusColor: Record<string, string> = { Pending: "#f59e0b", Approved: "#34d399", Rejected: "#fb7185" };

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

const ApprovalsPage = () => {
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState("");
  const [requestType, setRequestType] = useState(requestTypes[0]);
  const [requestedBy, setRequestedBy] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [reviewerInput, setReviewerInput] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: approvals } = useQuery({ queryKey: ["approvals"], queryFn: getApprovals });

  const createMutation = useMutation({
    mutationFn: createApprovalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      setRequestedBy("");
      setDescription("");
      setAmount("");
    },
  });

  const decisionMutation = useMutation({
    mutationFn: ({ id, decision, reviewedBy }: { id: number; decision: string; reviewedBy: string }) => decideApproval(id, decision, reviewedBy),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["approvals"] }),
  });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;

  const total = approvals?.length ?? 0;
  const pending = approvals?.filter((a) => a.status === "Pending").length ?? 0;
  const approved = approvals?.filter((a) => a.status === "Approved").length ?? 0;
  const rejected = approvals?.filter((a) => a.status === "Rejected").length ?? 0;

  const filtered = approvals?.filter((a) => {
    const matchesSearch = a.description.toLowerCase().includes(search.toLowerCase()) || a.request_type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      event_id: parseInt(eventId),
      request_type: requestType,
      requested_by: requestedBy,
      description,
      amount: amount ? parseFloat(amount) : undefined,
    });
  };

  const handleDecision = (id: number, decision: string) => {
    const reviewer = reviewerInput[id]?.trim();
    if (!reviewer) return;
    decisionMutation.mutate({ id, decision, reviewedBy: reviewer });
  };

  const inputClass = "w-full bg-white/5 border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition";

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Approvals <ClipboardCheck size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Review requests that need organizer sign-off.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatModule label="Total Requests" value={String(total)} icon={ClipboardCheck} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Pending" value={String(pending)} icon={Clock} badgeColor="rgba(245,158,11,0.15)" />
        <StatModule label="Approved" value={String(approved)} icon={CheckCircle2} badgeColor="rgba(52,211,153,0.15)" />
        <StatModule label="Rejected" value={String(rejected)} icon={XCircle} badgeColor="rgba(251,113,133,0.15)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 h-fit">
          <h2 className="font-display text-base font-semibold text-[var(--text)] mb-1">Submit Request</h2>
          <p className="text-sm text-[var(--text-muted)] mb-5">For actions needing organizer sign-off.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={inputClass} required>
              <option value="">Select event</option>
              {events?.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <select value={requestType} onChange={(e) => setRequestType(e.target.value)} className={inputClass}>
              {requestTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="text" placeholder="Requested by" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} className={inputClass} required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass} required />
            <input type="number" placeholder="Amount (₹, optional)" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-[var(--accent)] text-[#0a0f0e] font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
            >
              {createMutation.isPending ? "Submitting…" : "Submit request"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-base font-semibold text-[var(--text)]">Requests</h2>
            <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full">{total} total</span>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search requests…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white/5 border border-[var(--border)] rounded-lg px-2.5 py-2 text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition">
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto">
            {filtered && filtered.length === 0 && <p className="text-sm text-[var(--text-muted)] py-4">No requests match your filters.</p>}
            {filtered?.map((req) => {
              const color = statusColor[req.status] ?? "#94a3b8";
              return (
                <div key={req.id} className="border border-[var(--border)] rounded-lg px-4 py-3.5" style={{ borderLeft: `3px solid ${color}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color }}>{req.request_type} · {req.status}</span>
                    {req.amount != null && <span className="text-xs font-medium text-[var(--text)]">₹{req.amount.toLocaleString()}</span>}
                  </div>
                  <p className="text-sm text-[var(--text)] mt-1.5">{req.description}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{getEventName(req.event_id)} · Requested by {req.requested_by}</p>

                  {req.status === "Pending" ? (
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Your name (reviewer)"
                        value={reviewerInput[req.id] ?? ""}
                        onChange={(e) => setReviewerInput({ ...reviewerInput, [req.id]: e.target.value })}
                        className="text-xs bg-white/5 border border-[var(--border)] rounded-lg px-2.5 py-1.5 flex-1 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      />
                      <button onClick={() => handleDecision(req.id, "Approved")} className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                        <Check size={14} /> Approve
                      </button>
                      <button onClick={() => handleDecision(req.id, "Rejected")} className="text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1">
                        <X size={14} /> Reject
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] mt-2">
                      Reviewed by {req.reviewed_by} on {req.reviewed_at && new Date(req.reviewed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalsPage;