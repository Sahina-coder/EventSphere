import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getEvents } from "../../services/eventService";
import { getVenues } from "../../services/venueService";
import { getResources } from "../../services/resourceService";
import { getAttendees } from "../../services/attendeeService";
import { getVendors } from "../../services/vendorService";
import { getVendorAssignments } from "../../services/vendorAssignmentService";
import { getExpenses } from "../../services/expenseService";
import { getBookings } from "../../services/bookingService";

const COLORS = ["#4F46E5", "#059669", "#D97706", "#DC2626", "#64748B", "#0EA5E9"];

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <p className="text-2xl font-semibold text-slate-900">{value}</p>
    <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
  </div>
);

const Analytics = () => {
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: venues } = useQuery({ queryKey: ["venues"], queryFn: getVenues });
  const { data: resources } = useQuery({ queryKey: ["resources"], queryFn: getResources });
  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });
  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });
  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });
  const { data: expenses } = useQuery({ queryKey: ["expenses"], queryFn: getExpenses });
  const { data: bookings } = useQuery({ queryKey: ["bookings"], queryFn: getBookings });

  const now = new Date();

  // Event stats
  const upcoming = events?.filter((e) => new Date(e.date) > now && e.status !== "Cancelled").length ?? 0;
  const completed = events?.filter((e) => e.status === "Completed").length ?? 0;
  const cancelled = events?.filter((e) => e.status === "Cancelled").length ?? 0;
  const planned = events?.filter((e) => e.status === "Planned").length ?? 0;

  // Attendance stats
  const totalRegistered = attendees?.length ?? 0;
  const checkedIn = attendees?.filter((a) => a.attendance_status === "Checked In").length ?? 0;
  const absent = attendees?.filter((a) => a.attendance_status === "Absent").length ?? 0;
  const attendancePct = totalRegistered > 0 ? Math.round((checkedIn / totalRegistered) * 100) : 0;

  // Venue stats
  const bookedVenueIds = new Set(bookings?.map((b) => b.venue_id));
  const occupiedVenues = bookedVenueIds.size;
  const venueUtilPct = venues && venues.length > 0 ? Math.round((occupiedVenues / venues.length) * 100) : 0;

  // Resource stats
  const totalResourceQty = resources?.reduce((s, r) => s + r.quantity_total, 0) ?? 0;
  const availResourceQty = resources?.reduce((s, r) => s + r.quantity_available, 0) ?? 0;
  const resourceUtilPct = totalResourceQty > 0 ? Math.round(((totalResourceQty - availResourceQty) / totalResourceQty) * 100) : 0;

  // Vendor stats
  const activeVendors = vendors?.filter((v) => v.availability === "Available").length ?? 0;
  const assignedVendorIds = new Set(assignments?.map((a) => a.vendor_id));

  // Financial stats
  const totalBudget = events?.reduce((s, e) => s + (e.budget ?? 0), 0) ?? 0;
  const totalExpenses = expenses?.reduce((s, e) => s + e.amount, 0) ?? 0;
  const remaining = totalBudget - totalExpenses;

  // Chart data
  const eventStatusData = [
    { name: "Planned", value: planned },
    { name: "Upcoming", value: upcoming },
    { name: "Completed", value: completed },
    { name: "Cancelled", value: cancelled },
  ].filter((d) => d.value > 0);

  const eventWiseRegistrations = events?.map((e) => ({
    name: e.name.length > 12 ? e.name.slice(0, 12) + "…" : e.name,
    registrations: attendees?.filter((a) => a.event_id === e.id).length ?? 0,
  })) ?? [];

  const expenseByCategory: Record<string, number> = {};
  expenses?.forEach((e) => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] ?? 0) + e.amount;
  });
  const expenseChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      {/* Event Stats */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Events</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Events" value={events?.length ?? 0} />
          <StatCard label="Upcoming" value={upcoming} />
          <StatCard label="Completed" value={completed} />
          <StatCard label="Cancelled" value={cancelled} />
        </div>
      </div>

      {/* Registration & Attendance */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Registration & Attendance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Registrations" value={totalRegistered} />
          <StatCard label="Checked In" value={checkedIn} />
          <StatCard label="Absent" value={absent} />
          <StatCard label="Attendance %" value={`${attendancePct}%`} />
        </div>
      </div>

      {/* Venue & Resource */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Venues & Resources</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Venues" value={venues?.length ?? 0} />
          <StatCard label="Venue Utilization" value={`${venueUtilPct}%`} />
          <StatCard label="Total Resources" value={resources?.length ?? 0} />
          <StatCard label="Resource Utilization" value={`${resourceUtilPct}%`} />
        </div>
      </div>

      {/* Vendor & Financial */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Vendors & Finance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Vendors" value={vendors?.length ?? 0} />
          <StatCard label="Active Vendors" value={activeVendors} />
          <StatCard label="Vendors Assigned" value={assignedVendorIds.size} />
          <StatCard label="Budget Remaining" value={`₹${remaining.toLocaleString()}`} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <h3 className="font-display text-base font-semibold mb-4">Event Status Breakdown</h3>
          {eventStatusData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No event data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={eventStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {eventStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <h3 className="font-display text-base font-semibold mb-4">Registrations by Event</h3>
          {eventWiseRegistrations.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No registration data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={eventWiseRegistrations}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="registrations" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h3 className="font-display text-base font-semibold mb-4">Expenses by Category</h3>
        {expenseChartData.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No expense data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={expenseChartData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#059669" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Analytics;