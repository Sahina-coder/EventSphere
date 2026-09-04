import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Briefcase } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getVendorAssignments, assignVendor } from "../../services/vendorAssignmentService";
import { useVendorContext } from "../../context/VendorContext";

const Opportunities = () => {
  const queryClient = useQueryClient();
  const { vendorId } = useVendorContext();
  const [search, setSearch] = useState("");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });

  const myEventIds = new Set(assignments?.filter((a) => a.vendor_id === vendorId).map((a) => a.event_id));
  const openEvents = events?.filter((e) => !myEventIds.has(e.id) && e.name.toLowerCase().includes(search.toLowerCase())) ?? [];

  const mutation = useMutation({
    mutationFn: assignVendor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendorAssignments"] }),
  });

  const handleApply = (eventId: number) => {
    if (!vendorId) return;
    mutation.mutate({ event_id: eventId, vendor_id: vendorId, service: "General Service", status: "Pending" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Opportunities <Briefcase size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Events you could apply to provide services for.</p>
      </div>

      {!vendorId && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm rounded-lg px-4 py-3">
          Select a vendor identity from the sidebar to apply.
        </div>
      )}

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search opportunities…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {openEvents.map((e) => (
          <div key={e.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-sm font-semibold text-[var(--text)]">{e.name}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{e.event_type} · {new Date(e.date).toLocaleDateString()}</p>
            {e.budget != null && <p className="text-xs text-[var(--text-muted)] mt-1">Budget: ₹{e.budget.toLocaleString()}</p>}
            <button
              onClick={() => handleApply(e.id)}
              disabled={!vendorId || mutation.isPending}
              className="mt-4 w-full bg-[var(--accent)] text-[#0a0f0e] text-sm font-medium rounded-lg px-4 py-2 hover:brightness-110 transition disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        ))}
        {openEvents.length === 0 && <p className="text-sm text-[var(--text-muted)]">No new opportunities right now.</p>}
      </div>
    </div>
  );
};

export default Opportunities;