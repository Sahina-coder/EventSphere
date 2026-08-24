import { useQuery } from "@tanstack/react-query";
import { getVendorAssignments } from "../../services/vendorAssignmentService";
import { getEvents } from "../../services/eventService";
import { useVendorContext } from "../../context/VendorContext";

const statusColor: Record<string, string> = {
  Assigned: "#4F46E5",
  Confirmed: "#059669",
  Pending: "#D97706",
  Rejected: "#DC2626",
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
        <h1 className="font-display text-2xl font-bold">My Assignments</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Track the status of your event bookings.</p>
      </div>

      {!vendorId ? (
        <p className="text-sm text-[var(--text-muted)]">Select a vendor identity from the sidebar.</p>
      ) : myAssignments.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No assignments yet.</p>
      ) : (
        <div className="space-y-3">
          {myAssignments.map((a) => {
            const color = statusColor[a.status] ?? "#64748B";
            return (
              <div key={a.id} className="bg-white rounded-xl border border-[var(--border)] shadow-sm px-5 py-4 flex items-center justify-between" style={{ borderLeft: `3px solid ${color}` }}>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{getEventName(a.event_id)}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{a.service}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${color}18`, color }}>
                  {a.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAssignments;