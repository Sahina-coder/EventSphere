import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MapPin, CheckCircle2, Clock, XCircle, Search, Link2, Map, Compass } from "lucide-react";
import { getVenues } from "../../services/venueService";
import { getBookings } from "../../services/bookingService";
import VenueForm from "./VenueForm";

interface VenuesPageProps {
  onNavigate: (tab: string) => void;
}

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

const VenuesPage = ({ onNavigate }: VenuesPageProps) => {
  const [search, setSearch] = useState("");

  const { data: venues } = useQuery({ queryKey: ["venues"], queryFn: getVenues });
  const { data: bookings } = useQuery({ queryKey: ["bookings"], queryFn: getBookings });

  const getVenueStatus = (venueId: number) => {
    const count = bookings?.filter((b) => b.venue_id === venueId).length ?? 0;
    if (count === 0) return { label: "Available", color: "#34d399" };
    if (count === 1) return { label: "Partially Used", color: "#f59e0b" };
    return { label: "Fully Booked", color: "#fb7185" };
  };

  const total = venues?.length ?? 0;
  const statusList = venues?.map((v) => getVenueStatus(v.id)) ?? [];
  const available = statusList.filter((s) => s.label === "Available").length;
  const partial = statusList.filter((s) => s.label === "Partially Used").length;
  const full = statusList.filter((s) => s.label === "Fully Booked").length;

  const filtered = venues?.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase()));

  const donutData = [
    { name: "Available", value: available, color: "#34d399" },
    { name: "Partially Used", value: partial, color: "#f59e0b" },
    { name: "Fully Booked", value: full, color: "#fb7185" },
  ].filter((d) => d.value > 0);

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Venues <MapPin size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Track venue capacity and booking status.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatModule label="Total Venues" value={String(total)} icon={MapPin} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Available" value={String(available)} icon={CheckCircle2} badgeColor="rgba(52,211,153,0.15)" />
        <StatModule label="Partially Used" value={String(partial)} icon={Clock} badgeColor="rgba(245,158,11,0.15)" />
        <StatModule label="Fully Booked" value={String(full)} icon={XCircle} badgeColor="rgba(251,113,133,0.15)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VenueForm />

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-base font-semibold text-[var(--text)]">Venues</h2>
            <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full">{total} total</span>
          </div>

          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search venue…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            />
          </div>

          <div className="divide-y divide-[var(--border)] max-h-[360px] overflow-y-auto">
            {filtered && filtered.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] py-4">No venues match your search.</p>
            )}
            {filtered?.map((venue) => {
              const status = getVenueStatus(venue.id);
              return (
                <div key={venue.id} className="py-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{venue.name}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{venue.location} · Cap. {venue.capacity}</p>
                  </div>
                  <span className="text-[10px] font-medium flex items-center gap-1.5 shrink-0" style={{ color: status.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">By Availability</h2>
          {donutData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No venues yet.</p>
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
                  <p className="text-[10px] text-[var(--text-muted)]">Total Venues</p>
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
              <p className="text-sm font-medium text-[var(--text)]">Book a Venue</p>
              <p className="text-xs text-[var(--text-muted)]">Reserve a time slot</p>
            </div>
          </button>
          <button onClick={() => onNavigate("Venue Map")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Map size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">View Venue Map</p>
              <p className="text-xs text-[var(--text-muted)]">See layout markers</p>
            </div>
          </button>
          <button onClick={() => onNavigate("Venue Match")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Compass size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Smart Match</p>
              <p className="text-xs text-[var(--text-muted)]">Get venue recommendations</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenuesPage;