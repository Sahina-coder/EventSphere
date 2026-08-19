import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, MapPin, Package, Link2, TrendingUp } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getVenues } from "../../services/venueService";
import { getResources } from "../../services/resourceService";
import { getBookings } from "../../services/bookingService";

const Report = () => {
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: venues } = useQuery({ queryKey: ["venues"], queryFn: getVenues });
  const { data: resources } = useQuery({ queryKey: ["resources"], queryFn: getResources });
  const { data: bookings } = useQuery({ queryKey: ["bookings"], queryFn: getBookings });

  const now = new Date();
  const upcoming = events?.filter((e) => new Date(e.date) > now).length ?? 0;
  const completed = events?.filter((e) => e.status === "Completed").length ?? 0;
  const totalBudget = events?.reduce((sum, e) => sum + (e.budget ?? 0), 0) ?? 0;

  const totalResourceQty = resources?.reduce((sum, r) => sum + r.quantity_total, 0) ?? 0;
  const availableResourceQty = resources?.reduce((sum, r) => sum + r.quantity_available, 0) ?? 0;
  const resourceUsagePct = totalResourceQty > 0
    ? Math.round(((totalResourceQty - availableResourceQty) / totalResourceQty) * 100)
    : 0;

  const cards = [
    { label: "Total Events", value: events?.length ?? 0, icon: CalendarCheck },
    { label: "Upcoming Events", value: upcoming, icon: TrendingUp },
    { label: "Total Venues", value: venues?.length ?? 0, icon: MapPin },
    { label: "Total Resources", value: resources?.length ?? 0, icon: Package },
    { label: "Total Bookings", value: bookings?.length ?? 0, icon: Link2 },
  ];

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[var(--accent)] flex items-center justify-center">
              <c.icon size={18} />
            </div>
            <p className="text-2xl font-semibold text-slate-900 mt-3">{c.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Event Status Breakdown</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Upcoming</span>
              <span className="font-medium text-slate-800">{upcoming}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Completed</span>
              <span className="font-medium text-slate-800">{completed}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
              <span className="text-[var(--text-muted)]">Total Budget Planned</span>
              <span className="font-medium text-slate-800">₹{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Resource Utilization</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--text-muted)]">In use</span>
            <span className="font-medium text-slate-800">{resourceUsagePct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${resourceUsagePct}%` }}
            />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3">
            {availableResourceQty} of {totalResourceQty} total units currently available
          </p>
        </div>
      </div>
    </div>
  );
};

export default Report;