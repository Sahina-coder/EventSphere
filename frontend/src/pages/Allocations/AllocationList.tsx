import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllocations, deleteAllocation } from "../../services/allocationService";
import { getEvents } from "../../services/eventService";
import { getResources } from "../../services/resourceService";

const AllocationList = () => {
  const queryClient = useQueryClient();
  const { data: allocations, isLoading, error } = useQuery({
    queryKey: ["allocations"],
    queryFn: getAllocations,
  });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: resources } = useQuery({ queryKey: ["resources"], queryFn: getResources });

  const deleteMutation = useMutation({
    mutationFn: deleteAllocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const getResourceName = (id: number) => resources?.find((r) => r.id === id)?.name ?? `Resource #${id}`;

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold">Allocations</h2>
        <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
          {allocations ? allocations.length : 0} total
        </span>
      </div>

      {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading allocations…</p>}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {allocations && allocations.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No allocations yet — assign a resource to get started.</p>
      )}

      <div className="space-y-3">
        {allocations?.map((allocation) => (
          <div
            key={allocation.id}
            className="border border-slate-100 rounded-lg px-4 py-3.5 flex items-center justify-between gap-4 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            style={{ borderLeft: "3px solid #4F46E5" }}
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-800">{getEventName(allocation.event_id)}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {getResourceName(allocation.resource_id)} · Qty: {allocation.quantity}
              </p>
            </div>
            <button
              onClick={() => deleteMutation.mutate(allocation.id)}
              className="text-xs font-medium text-red-500 hover:text-red-600 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllocationList;