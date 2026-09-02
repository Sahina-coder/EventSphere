import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CalendarRange, Users, Building2, Wallet } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getVenues } from "../../services/venueService";
import { getAttendees } from "../../services/attendeeService";
import { getVendors } from "../../services/vendorService";
import { getVendorAssignments } from "../../services/vendorAssignmentService";
import { getExpenses } from "../../services/expenseService";
import { getBookings } from "../../services/bookingService";
import { getApprovals } from "../../services/approvalService";
import { getNotifications } from "../../services/notificationService";
import { getHealthScore } from "../../services/healthScoreService";

interface OverviewProps {
  onNavigate: (tab: string) => void;
}

const CHART_COLORS = ["#2dd4bf", "#f59e0b", "#fb7185", "#60a5fa", "#94a3b8"];

const ReadinessRing = ({ score }: { score: number }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
      <circle
        cx="55" cy="55" r={radius} fill="none" stroke="#2dd4bf" strokeWidth="8"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 55 55)"
      />
      <text x="55" y="52" textAnchor="middle" className="fill-white" style={{ fontSize: 22, fontWeight: 700 }}>{score}%</text>
      <text x="55" y="70" textAnchor="middle" className="fill-[#8ba3a0]" style={{ fontSize: 10 }}>Ready</text>
    </svg>
  );
};

const StatModule = ({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: React.ComponentType<{ size?: number }> }) => (
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <Icon size={16} />
    </div>
    <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
    {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
  </div>
);

const Overview = ({ onNavigate }: OverviewProps) => {
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: venues } = useQuery({ queryKey: ["venues"], queryFn: getVenues });
  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });
  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });
  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });
  const { data: expenses } = useQuery({ queryKey: ["expenses"], queryFn: getExpenses });
  const { data: bookings } = useQuery({ queryKey: ["bookings"], queryFn: getBookings });
  const { data: approvals } = useQuery({ queryKey: ["approvals"], queryFn: getApprovals });
  const { data: notifications } = useQuery({ queryKey: ["notifications"], queryFn: getNotifications });

  const now = new Date();
  const upcoming = events?.filter((e) => new Date(e.date) > now) ?? [];
  const featuredEvent = upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? events?.[0];

  const { data: featuredHealth } = useQuery({
    queryKey: ["healthScore", featuredEvent?.id],
    queryFn: () => getHealthScore(featuredEvent!.id),
    enabled: !!featuredEvent,
  });

  const featuredAttendees = featuredEvent ? attendees?.filter((a) => a.event_id === featuredEvent.id).length ?? 0 : 0;
  const featuredVendors = featuredEvent ? assignments?.filter((a) => a.event_id === featuredEvent.id).length ?? 0 : 0;
  const featuredVenue = featuredEvent ? bookings?.find((b) => b.event_id === featuredEvent.id) : null;
  const featuredVenueName = featuredVenue ? venues?.find((v) => v.id === featuredVenue.venue_id)?.name : "Not booked";

  const statusCounts: Record<string, number> = {};
  events?.forEach((e) => { statusCounts[e.status] = (statusCounts[e.status] ?? 0) + 1; });

  const totalBudget = events?.reduce((s, e) => s + (e.budget ?? 0), 0) ?? 0;
  const totalExpenses = expenses?.reduce((s, e) => s + e.amount, 0) ?? 0;
  const budgetPct = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;

  const pendingVendorApprovals = assignments?.filter((a) => a.status !== "Confirmed").length ?? 0;

  const expenseByCategory: Record<string, number> = {};
  expenses?.forEach((e) => { expenseByCategory[e.category] = (expenseByCategory[e.category] ?? 0) + e.amount; });
  const budgetChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  const bookedVenueIds = new Set(bookings?.map((b) => b.venue_id));
  const venuesActive = bookedVenueIds.size;

  const recentActivity = [...(notifications ?? [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  const recentApprovals = [...(approvals ?? [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  const approvalStatusColor: Record<string, string> = { Pending: "#f59e0b", Approved: "#34d399", Rejected: "#fb7185" };
  const eventStatusColor: Record<string, string> = { Planned: "#2dd4bf", Ongoing: "#34d399", Completed: "#94a3b8", Cancelled: "#fb7185" };

  return (
    <div className="space-y-6">
      {/* Featured event + upcoming activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          {!featuredEvent ? (
            <div className="text-center py-10">
              <p className="text-sm text-[var(--text-muted)] mb-3">No events yet.</p>
              <button
                onClick={() => onNavigate("Events")}
                className="bg-[var(--accent)] text-[#0a0f0e] text-sm font-medium rounded-lg px-4 py-2 hover:brightness-110 transition"
              >
                Create your first event
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)]/10 px-2.5 py-1 rounded-full">
                  Featured Event
                </span>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${eventStatusColor[featuredEvent.status] ?? "#94a3b8"}18`, color: eventStatusColor[featuredEvent.status] ?? "#94a3b8" }}
                >
                  {featuredEvent.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--text)]">{featuredEvent.name}</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1.5">
                    {new Date(featuredEvent.date).toLocaleString()} · {featuredVenueName}
                  </p>
                  <div className="flex flex-wrap gap-6 mt-5">
                    <div>
                      <p className="text-lg font-bold text-[var(--text)]">{featuredVendors}</p>
                      <p className="text-xs text-[var(--text-muted)]">Vendors</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[var(--text)]">{featuredAttendees}</p>
                      <p className="text-xs text-[var(--text-muted)]">Attendees</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[var(--text)]">₹{(featuredEvent.budget ?? 0).toLocaleString()}</p>
                      <p className="text-xs text-[var(--text-muted)]">Budget</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate("Events")}
                    className="mt-6 bg-[var(--accent)] text-[#0a0f0e] text-sm font-medium rounded-lg px-4 py-2.5 hover:brightness-110 transition"
                  >
                    Open Event
                  </button>
                </div>
                {featuredHealth && <ReadinessRing score={featuredHealth.score} />}
              </div>
            </>
          )}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Recent Activity</p>
            <button onClick={() => onNavigate("Notifications")} className="text-xs text-[var(--accent)] hover:underline">View All</button>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No recent activity.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((n) => (
                <div key={n.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">{new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="text-sm font-medium text-[var(--text)] mt-0.5">{n.notification_type}</p>
                    <p className="text-xs text-[var(--text-muted)]">{n.message.slice(0, 50)}{n.message.length > 50 ? "…" : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stat modules */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatModule
          label="Total Events"
          value={String(events?.length ?? 0)}
          sub={Object.entries(statusCounts).map(([s, c]) => `${c} ${s}`).join(" · ")}
          icon={CalendarRange}
        />
        <StatModule
          label="Total Attendees"
          value={(attendees?.length ?? 0).toLocaleString()}
          sub={`Across ${events?.length ?? 0} events`}
          icon={Users}
        />
        <StatModule
          label="Vendors"
          value={String(vendors?.length ?? 0)}
          sub={`${pendingVendorApprovals} pending confirmation`}
          icon={Building2}
        />
        <StatModule
          label="Budget Utilization"
          value={`₹${(totalExpenses / 100000).toFixed(1)}L / ₹${(totalBudget / 100000).toFixed(1)}L`}
          sub={`${budgetPct}% allocated`}
          icon={Wallet}
        />
      </div>

      {/* Events overview + Venue pulse + Budget breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Events Overview</p>
            <button onClick={() => onNavigate("Events")} className="text-xs text-[var(--accent)] hover:underline">View All</button>
          </div>
          {!events || events.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No events yet.</p>
          ) : (
            <div className="space-y-4">
              {events.slice(0, 4).map((e) => {
                const eventExpenses = expenses?.filter((x) => x.event_id === e.id).reduce((s, x) => s + x.amount, 0) ?? 0;
                const pct = e.budget ? Math.min(100, Math.round((eventExpenses / e.budget) * 100)) : 0;
                return (
                  <div key={e.id}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-[var(--text)] truncate max-w-[140px]">{e.name}</p>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${eventStatusColor[e.status] ?? "#94a3b8"}18`, color: eventStatusColor[e.status] ?? "#94a3b8" }}
                      >
                        {e.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mb-1.5">{new Date(e.date).toLocaleDateString()}</p>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Venue Pulse</p>
            <button onClick={() => onNavigate("Venue Map")} className="text-xs text-[var(--accent)] hover:underline">View Map</button>
          </div>
          {!venues || venues.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No venues yet.</p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {venues.slice(0, 4).map((v) => {
                  const count = bookings?.filter((b) => b.venue_id === v.id).length ?? 0;
                  const status = count === 0 ? { label: "Available", color: "#34d399" } : count === 1 ? { label: "Partially Used", color: "#f59e0b" } : { label: "Fully Booked", color: "#fb7185" };
                  return (
                    <div key={v.id} className="flex items-center justify-between">
                      <p className="text-sm text-[var(--text)] truncate max-w-[130px]">{v.name}</p>
                      <span className="text-[10px] font-medium flex items-center gap-1.5" style={{ color: status.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-3">
                {venuesActive} / {venues.length} venues active
              </p>
            </>
          )}
        </div>

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">Budget Breakdown</p>
          {budgetChartData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No expenses recorded yet.</p>
          ) : (
            <>
              <div className="relative h-40 mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={budgetChartData} dataKey="value" innerRadius={45} outerRadius={65} paddingAngle={2}>
                      {budgetChartData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-lg font-bold text-[var(--text)]">₹{(totalExpenses / 100000).toFixed(1)}L</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Total Used</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {budgetChartData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      {d.name}
                    </span>
                    <span className="text-[var(--text)] font-medium">₹{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent approvals */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Recent Approvals</p>
          <button onClick={() => onNavigate("Approvals")} className="text-xs text-[var(--accent)] hover:underline">View All</button>
        </div>
        {recentApprovals.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No approval requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentApprovals.map((a) => {
              const color = approvalStatusColor[a.status] ?? "#94a3b8";
              return (
                <div key={a.id} className="border border-[var(--border)] rounded-lg p-3">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{a.request_type}</p>
                  {a.amount != null && <p className="text-xs text-[var(--text-muted)] mt-0.5">₹{a.amount.toLocaleString()}</p>}
                  <span className="text-[10px] font-medium inline-block mt-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}18`, color }}>
                    {a.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;