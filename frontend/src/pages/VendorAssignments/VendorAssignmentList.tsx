import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVendorAssignments, deleteVendorAssignment } from "../../services/vendorAssignmentService";
import { getEvents } from "../../services/eventService";
import { getVendors } from "../../services/vendorService";

const VendorAssignmentList = () => {
  const queryClient = useQueryClient();
  const { data: assignments, isLoading, error } = useQuery({
    queryKey: ["vendorAssignments"],
    queryFn: getVendorAssignments,
  });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });

  const deleteMutation = useMutation({
    mutationFn: deleteVendorAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendorAssignments"] }),
  });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const getVendorName = (id: number) => vendors?.find((v) => v.id === id)?.name ?? `Vendor #${id}`;

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold">Vendor Assignments</h2>
        <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
          {assignments ? assignments.length : 0} total
        </span>
      </div>

      {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading assignments…</p>}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {assignments && assignments.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No assignments yet — assign a vendor to get started.</p>
      )}

      <div className="space-y-3">
        {assignments?.map((assignment) => (
          <div
            key={assignment.id}
            className="border border-slate-100 rounded-lg px-4 py-3.5 flex items-center justify-between gap-4 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            style={{ borderLeft: "3px solid #4F46E5" }}
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-800">{getEventName(assignment.event_id)}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {getVendorName(assignment.vendor_id)} · {assignment.service}
              </p>
              <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-[var(--accent)]">
                {assignment.status}
              </span>
            </div>
            <button
              onClick={() => deleteMutation.mutate(assignment.id)}
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

export default VendorAssignmentList;