import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVendorAssignments, deleteVendorAssignment } from "../../services/vendorAssignmentService";
import { getEvents } from "../../services/eventService";
import { getVendors } from "../../services/vendorService";

const statusColor: Record<string, string> = {
  Assigned: "#2dd4bf",
  Confirmed: "#34d399",
  Pending: "#f59e0b",
  Rejected: "#fb7185",
};

const VendorAssignmentList = () => {
  const queryClient = useQueryClient();
  const { data: assignments, isLoading, error } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });

  const deleteMutation = useMutation({
    mutationFn: deleteVendorAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendorAssignments"] }),
  });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const getVendorName = (id: number) => vendors?.find((v) => v.id === id)?.name ?? `Vendor #${id}`;

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-base font-semibold text-[var(--text)]">Vendor Assignments</h2>
        <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2.5 py-1 rounded-full">
          {assignments ? assignments.length : 0} total
        </span>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />)}
        </div>
      )}
      {error && <p className="text-sm text-red-400">Couldn't reach the server. Is the backend running?</p>}
      {assignments && assignments.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No assignments yet — assign a vendor to get started.</p>
      )}

      <div className="divide-y divide-[var(--border)]">
        {assignments?.map((assignment) => {
          const color = statusColor[assignment.status] ?? "#94a3b8";
          return (
            <div key={assignment.id} className="py-3.5 first:pt-0 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text)] truncate">{getEventName(assignment.event_id)}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {getVendorName(assignment.vendor_id)} · {assignment.service}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-medium px-2 py-1 rounded-full" style={{ backgroundColor: `${color}18`, color }}>
                  {assignment.status}
                </span>
                <button onClick={() => deleteMutation.mutate(assignment.id)} className="text-[11px] font-medium text-red-400 hover:text-red-300">
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VendorAssignmentList;