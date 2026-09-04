import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { getVendorAssignments } from "../../services/vendorAssignmentService";
import { getEvents } from "../../services/eventService";
import { useVendorContext } from "../../context/VendorContext";

const statusColor: Record<string, string> = {
  Assigned: "#2dd4bf",
  Confirmed: "#34d399",
  Pending: "#f59e0b",
  Rejected: "#fb7185",
};

const MyAssignments = () => {
  const { vendorId } = useVendorContext();
  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });

  const myAssignments = assignments?.filter((a) => a.vendor_id === vendorId) ?? [];
  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          My Assignments <ClipboardList size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Track the status of your event bookings.</p>
      </div>

      {!vendorId ? (
        <p className="text-sm text-[var(--text-muted)]">Select a vendor identity from the sidebar.</p>
      ) : myAssignments.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No assignments yet.</p>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="divide-y divide-[var(--border)]">
            {myAssignments.map((a) => {
              const color = statusColor[a.status] ?? "#94a3b8";
              return (
                <div key={a.id} className="py-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)] truncate">{getEventName(a.event_id)}</p>
                    <p className="text-xs text-[var(--text-muted)]">{a.service}</p>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0" style={{ backgroundColor: `${color}18`, color }}>
                    {a.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssignments;