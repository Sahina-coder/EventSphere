import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvents } from "../../services/eventService";
import { getVendorAssignments, assignVendor } from "../../services/vendorAssignmentService";
import { useVendorContext } from "../../context/VendorContext";

const Opportunities = () => {
  const queryClient = useQueryClient();
  const { vendorId } = useVendorContext();
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });

  const myEventIds = new Set(assignments?.filter((a) => a.vendor_id === vendorId).map((a) => a.event_id));
  const openEvents = events?.filter((e) => !myEventIds.has(e.id)) ?? [];

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
        <h1 className="font-display text-2xl font-bold">Opportunities</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Events you could apply to provide services for.</p>
      </div>

      {!vendorId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3">
          Select a vendor identity from the sidebar to apply.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {openEvents.map((e) => (
          <div key={e.id} className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
            <p className="text-sm font-semibold text-slate-800">{e.name}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {e.event_type} · {new Date(e.date).toLocaleDateString()}
            </p>
            {e.budget != null && (
              <p className="text-xs text-[var(--text-muted)] mt-1">Budget: ₹{e.budget.toLocaleString()}</p>
            )}
            <button
              onClick={() => handleApply(e.id)}
              disabled={!vendorId || mutation.isPending}
              className="mt-4 w-full bg-[var(--accent)] text-white text-sm font-medium rounded-lg px-4 py-2 hover:brightness-110 transition disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        ))}
        {openEvents.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">No new opportunities right now.</p>
        )}
      </div>
    </div>
  );
};

export default Opportunities;