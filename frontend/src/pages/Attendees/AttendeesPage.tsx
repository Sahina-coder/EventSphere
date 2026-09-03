import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Users, UserCheck, UserX, TrendingUp, Search, Upload, Send, Download, MoreVertical } from "lucide-react";
import { getAttendees, updateAttendanceStatus } from "../../services/attendeeService";
import { getEvents } from "../../services/eventService";
import { generateTicket, getTicketQrUrl, getTickets } from "../../services/ticketService";
import AttendeeForm from "./AttendeeForm";

interface AttendeesPageProps {
  onNavigate: (tab: string) => void;
}

const statusColor: Record<string, string> = {
  Registered: "#2dd4bf",
  "Checked In": "#34d399",
  Absent: "#fb7185",
  Cancelled: "#94a3b8",
};

const StatModule = ({
  label, value, sub, icon: Icon, badgeColor,
}: { label: string; value: string; sub?: string; icon: React.ComponentType<{ size?: number }>; badgeColor: string }) => (
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-start justify-between">
    <div>
      <p className="text-xs text-[var(--text-muted)] mb-2">{label}</p>
      <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
      {sub && <p className="text-xs text-[var(--accent)] mt-1">{sub}</p>}
    </div>
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: badgeColor }}>
      <Icon size={16} />
    </div>
  </div>
);

const AttendeesPage = ({ onNavigate }: AttendeesPageProps) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [qrTicketId, setQrTicketId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: tickets } = useQuery({ queryKey: ["tickets"], queryFn: getTickets });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateAttendanceStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendees"] }),
  });

  const ticketMutation = useMutation({
    mutationFn: generateTicket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets"] }),
  });

  const total = attendees?.length ?? 0;
  const checkedIn = attendees?.filter((a) => a.attendance_status === "Checked In").length ?? 0;
  const absent = attendees?.filter((a) => a.attendance_status === "Absent").length ?? 0;
  const registered = attendees?.filter((a) => a.attendance_status === "Registered").length ?? 0;
  const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const getTicketForAttendee = (attendeeId: number) => tickets?.find((t) => t.attendee_id === attendeeId);

  const filtered = attendees?.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.attendance_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const donutData = [
    { name: "Checked In", value: checkedIn, color: "#34d399" },
    { name: "Absent", value: absent, color: "#fb7185" },
    { name: "Registered", value: registered, color: "#2dd4bf" },
  ].filter((d) => d.value > 0);

  // Top event by registration count (real data)
  const eventCounts: Record<number, number> = {};
  attendees?.forEach((a) => { eventCounts[a.event_id] = (eventCounts[a.event_id] ?? 0) + 1; });
  const topEventId = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topEvent = topEventId ? events?.find((e) => e.id === parseInt(topEventId)) : null;
  const topEventCheckedIn = topEvent ? attendees?.filter((a) => a.event_id === topEvent.id && a.attendance_status === "Checked In").length ?? 0 : 0;
  const topEventTotal = topEvent ? eventCounts[topEvent.id] : 0;
  const topEventPct = topEventTotal > 0 ? Math.round((topEventCheckedIn / topEventTotal) * 100) : 0;

  // Recently registered (real data, sorted by registered_at)
  const recentlyRegistered = [...(attendees ?? [])]
    .sort((a, b) => new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime())
    .slice(0, 3);

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Attendees <Users size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Manage and track event attendees in real-time.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatModule label="Total Registered" value={String(total)} icon={Users} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Checked In" value={String(checkedIn)} sub={total > 0 ? `${Math.round((checkedIn / total) * 100)}%` : undefined} icon={UserCheck} badgeColor="rgba(52,211,153,0.15)" />
        <StatModule label="Absent" value={String(absent)} sub={total > 0 ? `${Math.round((absent / total) * 100)}%` : undefined} icon={UserX} badgeColor="rgba(251,113,133,0.15)" />
        <StatModule label="Attendance Rate" value={`${rate}%`} icon={TrendingUp} badgeColor="rgba(45,212,191,0.15)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AttendeeForm />

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-base font-semibold text-[var(--text)]">Attendees</h2>
            <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full">{total} total</span>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search attendee…"
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
              <option value="Registered">Registered</option>
              <option value="Checked In">Checked In</option>
              <option value="Absent">Absent</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="divide-y divide-[var(--border)] max-h-[360px] overflow-y-auto">
            {filtered && filtered.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] py-4">No attendees match your search.</p>
            )}
            {filtered?.map((attendee) => {
              const color = statusColor[attendee.attendance_status] ?? "#94a3b8";
              const ticket = getTicketForAttendee(attendee.id);
              return (
                <div key={attendee.id} className="py-3 first:pt-0 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center text-xs font-semibold shrink-0">
                    {attendee.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{attendee.name}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{getEventName(attendee.event_id)}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${color}18`, color }}>
                    {attendee.attendance_status}
                  </span>
                  <div className="relative shrink-0">
                    <button onClick={() => setOpenMenuId(openMenuId === attendee.id ? null : attendee.id)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                      <MoreVertical size={14} />
                    </button>
                    {openMenuId === attendee.id && (
                      <div className="absolute right-0 top-6 z-10 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg py-1 w-40">
                        {["Registered", "Checked In", "Absent", "Cancelled"].map((s) => (
                          <button
                            key={s}
                            onClick={() => { statusMutation.mutate({ id: attendee.id, status: s }); setOpenMenuId(null); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[var(--text)] hover:bg-white/5"
                          >
                            Mark as {s}
                          </button>
                        ))}
                        {ticket ? (
                          <button
                            onClick={() => { setQrTicketId(ticket.id); setOpenMenuId(null); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[var(--accent)] hover:bg-white/5 border-t border-[var(--border)]"
                          >
                            View QR
                          </button>
                        ) : (
                          <button
                            onClick={() => { ticketMutation.mutate(attendee.id); setOpenMenuId(null); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[var(--accent)] hover:bg-white/5 border-t border-[var(--border)]"
                          >
                            Generate ticket
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Attendance Overview</h2>
          {donutData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No attendee data yet.</p>
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
                  <p className="text-2xl font-bold text-[var(--text)]">{rate}%</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Attendance Rate</p>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                {donutData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="text-[var(--text)] font-medium">
                      {d.value} ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-sm font-semibold text-[var(--text)] mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 opacity-60 cursor-not-allowed">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Upload size={14} /></div>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Import Attendees</p>
                <p className="text-xs text-[var(--text-muted)]">Coming soon</p>
              </div>
            </button>
            <button onClick={() => onNavigate("Notifications")} className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Send size={14} /></div>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Send Notification</p>
                <p className="text-xs text-[var(--text-muted)]">Reach registered attendees</p>
              </div>
            </button>
            <button onClick={() => onNavigate("Export")} className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Download size={14} /></div>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Export Report</p>
                <p className="text-xs text-[var(--text-muted)]">Download attendance PDF/CSV</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-sm font-semibold text-[var(--text)] mb-4">Recently Registered</h2>
          {recentlyRegistered.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No attendees yet.</p>
          ) : (
            <div className="space-y-3">
              {recentlyRegistered.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center text-[10px] font-semibold shrink-0">
                    {a.name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--text)] truncate"><span className="font-medium">{a.name}</span> registered for {getEventName(a.event_id)}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{new Date(a.registered_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-sm font-semibold text-[var(--text)] mb-4">Top Event</h2>
          {!topEvent ? (
            <p className="text-sm text-[var(--text-muted)]">No registrations yet.</p>
          ) : (
            <>
              <p className="text-sm font-medium text-[var(--text)]">{topEvent.name}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{topEventCheckedIn} / {topEventTotal} checked in</p>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-[var(--accent)]" style={{ width: `${topEventPct}%` }} />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1.5">{topEventPct}% attendance</p>
            </>
          )}
        </div>
      </div>

      {qrTicketId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setQrTicketId(null)}>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
            <img src={getTicketQrUrl(qrTicketId)} alt="Ticket QR code" className="w-56 h-56" />
            <button onClick={() => setQrTicketId(null)} className="mt-4 w-full text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeesPage;