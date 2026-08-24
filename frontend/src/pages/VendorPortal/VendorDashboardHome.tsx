import { useQuery } from "@tanstack/react-query";
import { Briefcase, ClipboardCheck, Star } from "lucide-react";
import { getVendors } from "../../services/vendorService";
import { getVendorAssignments } from "../../services/vendorAssignmentService";
import { getEvents } from "../../services/eventService";
import { useVendorContext } from "../../context/VendorContext";

const VendorDashboardHome = () => {
  const { vendorId } = useVendorContext();
  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });
  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });

  const me = vendors?.find((v) => v.id === vendorId);
  const myAssignments = assignments?.filter((a) => a.vendor_id === vendorId) ?? [];
  const confirmed = myAssignments.filter((a) => a.status === "Confirmed");
  const pending = myAssignments.filter((a) => a.status !== "Confirmed");

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;

  if (!vendorId) {
    return (
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">Select a vendor from the sidebar to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Welcome back, {me?.name}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Here's an overview of your event assignments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
          <Briefcase size={18} className="text-[var(--accent)] mb-2" />
          <p className="text-2xl font-semibold">{myAssignments.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Total Assignments</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
          <ClipboardCheck size={18} className="text-emerald-600 mb-2" />
          <p className="text-2xl font-semibold">{confirmed.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Confirmed Bookings</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5">
          <Star size={18} className="text-amber-500 mb-2" />
          <p className="text-2xl font-semibold">{me?.availability ?? "—"}</p>
          <p className="text-xs text-[var(--text-muted)]">Availability Status</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-base font-semibold mb-4">Pending Confirmations</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Nothing pending — you're all caught up.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((a) => (
              <div key={a.id} className="border border-slate-100 rounded-lg px-4 py-3" style={{ borderLeft: "3px solid #D97706" }}>
                <p className="text-sm font-semibold text-slate-800">{getEventName(a.event_id)}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{a.service} · Status: {a.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboardHome;