import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CalendarRange, TrendingUp, CheckCircle2, XCircle, Search, Link2, Boxes, Download } from "lucide-react";
import { getEvents } from "../../services/eventService";
import EventForm from "./EventForm";

interface EventsPageProps {
  onNavigate: (tab: string) => void;
}

const statusColor: Record<string, string> = {
  Planned: "#2dd4bf",
  Ongoing: "#34d399",
  Completed: "#94a3b8",
  Cancelled: "#fb7185",
};

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

const EventsPage = ({ onNavigate }: EventsPageProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });

  const now = new Date();
  const total = events?.length ?? 0;
  const upcoming = events?.filter((e) => new Date(e.date) > now && e.status !== "Cancelled").length ?? 0;
  const completed = events?.filter((e) => e.status === "Completed").length ?? 0;
  const cancelled = events?.filter((e) => e.status === "Cancelled").length ?? 0;

  const filtered = events?.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.event_type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts: Record<string, number> = {};
  events?.forEach((e) => { statusCounts[e.status] = (statusCounts[e.status] ?? 0) + 1; });
  const donutData = Object.entries(statusCounts).map(([name, value]) => ({ name, value, color: statusColor[name] ?? "#94a3b8" }));

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Events <CalendarRange size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Create, track, and manage your events.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatModule label="Total Events" value={String(total)} icon={CalendarRange} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Upcoming" value={String(upcoming)} icon={TrendingUp} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Completed" value={String(completed)} icon={CheckCircle2} badgeColor="rgba(148,163,184,0.15)" />
        <StatModule label="Cancelled" value={String(cancelled)} icon={XCircle} badgeColor="rgba(251,113,133,0.15)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EventForm />

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-base font-semibold text-[var(--text)]">Events</h2>
            <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full">{total} total</span>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search event…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-[var(--border)] rounded-lg px-2.5 py-2 text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            >
              <option value="All">All Status</option>
              <option value="Planned">Planned</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="divide-y divide-[var(--border)] max-h-[360px] overflow-y-auto">
            {filtered && filtered.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] py-4">No events match your search.</p>
            )}
            {filtered?.map((event) => {
              const color = statusColor[event.status] ?? "#94a3b8";
              return (
                <div key={event.id} className="py-3 first:pt-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{event.name}</p>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${color}18`, color }}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {event.event_type} · {new Date(event.date).toLocaleDateString()}
                  </p>
                  {event.budget != null && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Budget ₹{event.budget.toLocaleString()}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">By Status</h2>
          {donutData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No events yet.</p>
          ) : (
            <>
              <div className="relative h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} dataKey="value" innerRadius={50} outerRadius={72} paddingAngle={2}>
                      {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-[var(--text)]">{total}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Total Events</p>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                {donutData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="text-[var(--text)] font-medium">{d.value} ({Math.round((d.value / total) * 100)}%)</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-display text-sm font-semibold text-[var(--text)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-2xl">
          <button onClick={() => onNavigate("Bookings")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Link2 size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Book Venue</p>
              <p className="text-xs text-[var(--text-muted)]">Assign a venue slot</p>
            </div>
          </button>
          <button onClick={() => onNavigate("Allocations")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Boxes size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Allocate Resources</p>
              <p className="text-xs text-[var(--text-muted)]">Assign inventory</p>
            </div>
          </button>
          <button onClick={() => onNavigate("Export")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Download size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Export Report</p>
              <p className="text-xs text-[var(--text-muted)]">Download event summary</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;