import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardCheck, Check, X } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getApprovals, createApprovalRequest, decideApproval } from "../../services/approvalService";

const requestTypes = ["Vendor Payment", "Budget Increase", "Resource Purchase", "Venue Change", "Other"];

const statusColor: Record<string, string> = {
  Pending: "#D97706",
  Approved: "#059669",
  Rejected: "#DC2626",
};

const Approvals = () => {
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState("");
  const [requestType, setRequestType] = useState(requestTypes[0]);
  const [requestedBy, setRequestedBy] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [reviewerInput, setReviewerInput] = useState<Record<number, string>>({});

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
    mutationFn: ({ id, decision, reviewedBy }: { id: number; decision: string; reviewedBy: string }) =>
      decideApproval(id, decision, reviewedBy),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["approvals"] }),
  });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;

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

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 max-w-xl">
        <h2 className="font-display text-lg font-semibold mb-1 flex items-center gap-2">
          <ClipboardCheck size={18} /> Submit Approval Request
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">Some actions need organizer sign-off before proceeding.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          >
            <option value="">Select event</option>
            {events?.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
          >
            {requestTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Requested by"
            value={requestedBy}
            onChange={(e) => setRequestedBy(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />

          <input
            type="number"
            placeholder="Amount (₹, optional)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
          />

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
          >
            {createMutation.isPending ? "Submitting…" : "Submit request"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold">Approval Requests</h2>
          <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
            {approvals ? approvals.length : 0} total
          </span>
        </div>

        {!approvals || approvals.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No requests yet.</p>
        ) : (
          <div className="space-y-3">
            {approvals.map((req) => {
              const color = statusColor[req.status] ?? "#64748B";
              return (
                <div key={req.id} className="border border-slate-100 rounded-lg px-4 py-3.5" style={{ borderLeft: `3px solid ${color}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color }}>
                      {req.request_type} · {req.status}
                    </span>
                    {req.amount != null && (
                      <span className="text-xs font-medium text-slate-700">₹{req.amount.toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 mt-1.5">{req.description}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {getEventName(req.event_id)} · Requested by {req.requested_by}
                  </p>

                  {req.status === "Pending" ? (
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Your name (reviewer)"
                        value={reviewerInput[req.id] ?? ""}
                        onChange={(e) => setReviewerInput({ ...reviewerInput, [req.id]: e.target.value })}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      />
                      <button
                        onClick={() => handleDecision(req.id, "Approved")}
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleDecision(req.id, "Rejected")}
                        className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
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
        )}
      </div>
    </div>
  );
};

export default Approvals;