import { useQuery } from "@tanstack/react-query";
import { Briefcase, ClipboardCheck, Star } from "lucide-react";
import { getVendors } from "../../services/vendorService";
import { getVendorAssignments } from "../../services/vendorAssignmentService";
import { getEvents } from "../../services/eventService";
import { useVendorContext } from "../../context/VendorContext";

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
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">Select a vendor from the sidebar to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)]">Welcome back, {me?.name}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Here's an overview of your event assignments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatModule label="Total Assignments" value={String(myAssignments.length)} icon={Briefcase} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Confirmed Bookings" value={String(confirmed.length)} icon={ClipboardCheck} badgeColor="rgba(52,211,153,0.15)" />
        <StatModule label="Availability" value={me?.availability ?? "—"} icon={Star} badgeColor="rgba(245,158,11,0.15)" />
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Pending Confirmations</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Nothing pending — you're all caught up.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {pending.map((a) => (
              <div key={a.id} className="py-3 first:pt-0">
                <p className="text-sm font-semibold text-[var(--text)]">{getEventName(a.event_id)}</p>
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