import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Link2, CalendarRange, MapPin, Search, Download } from "lucide-react";
import { getBookings } from "../../services/bookingService";
import { getEvents } from "../../services/eventService";
import { getVenues } from "../../services/venueService";
import BookingForm from "./BookingForm";

interface BookingsPageProps {
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

const donutColors = ["#2dd4bf", "#34d399", "#f59e0b", "#60a5fa", "#fb7185", "#94a3b8"];

const BookingsPage = ({ onNavigate }: BookingsPageProps) => {
  const [search, setSearch] = useState("");

  const { data: bookings } = useQuery({ queryKey: ["bookings"], queryFn: getBookings });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: venues } = useQuery({ queryKey: ["venues"], queryFn: getVenues });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const getVenueName = (id: number) => venues?.find((v) => v.id === id)?.name ?? `Venue #${id}`;

  const total = bookings?.length ?? 0;
  const uniqueVenues = new Set(bookings?.map((b) => b.venue_id)).size;
  const now = new Date();
  const upcoming = bookings?.filter((b) => new Date(b.start_time) > now).length ?? 0;

  const filtered = bookings?.filter((b) =>
    getEventName(b.event_id).toLowerCase().includes(search.toLowerCase()) ||
    getVenueName(b.venue_id).toLowerCase().includes(search.toLowerCase())
  );

  // bookings per venue (real data)
  const venueCounts: Record<string, number> = {};
  bookings?.forEach((b) => {
    const name = getVenueName(b.venue_id);
    venueCounts[name] = (venueCounts[name] ?? 0) + 1;
  });
  const donutData = Object.entries(venueCounts).map(([name, value], i) => ({ name, value, color: donutColors[i % donutColors.length] }));

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Bookings <Link2 size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Venue reservations with automatic conflict detection.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatModule label="Total Bookings" value={String(total)} icon={Link2} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Upcoming" value={String(upcoming)} icon={CalendarRange} badgeColor="rgba(52,211,153,0.15)" />
        <StatModule label="Venues in Use" value={String(uniqueVenues)} icon={MapPin} badgeColor="rgba(245,158,11,0.15)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BookingForm />

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-base font-semibold text-[var(--text)]">Bookings</h2>
            <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full">{total} total</span>
          </div>

          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search event or venue…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            />
          </div>

          <div className="divide-y divide-[var(--border)] max-h-[360px] overflow-y-auto">
            {filtered && filtered.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] py-4">No bookings match your search.</p>
            )}
            {filtered?.map((booking) => (
              <div key={booking.id} className="py-3 first:pt-0">
                <p className="text-sm font-medium text-[var(--text)] truncate">{getEventName(booking.event_id)}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{getVenueName(booking.venue_id)}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {new Date(booking.start_time).toLocaleString()} → {new Date(booking.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">By Venue</h2>
          {donutData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No bookings yet.</p>
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
                  <p className="text-[10px] text-[var(--text-muted)]">Total Bookings</p>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                {donutData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-[var(--text-muted)] truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="text-[var(--text)] font-medium shrink-0">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-display text-sm font-semibold text-[var(--text)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md">
          <button onClick={() => onNavigate("Venue Map")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><MapPin size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">View Venue Map</p>
              <p className="text-xs text-[var(--text-muted)]">See layout markers</p>
            </div>
          </button>
          <button onClick={() => onNavigate("Export")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Download size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Export Report</p>
              <p className="text-xs text-[var(--text-muted)]">Download booking summary</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;