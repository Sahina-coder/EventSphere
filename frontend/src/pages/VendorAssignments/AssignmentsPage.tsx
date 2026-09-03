import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ClipboardList, CheckCircle2, Clock, Search, Download, Bell } from "lucide-react";
import { getVendorAssignments, deleteVendorAssignment } from "../../services/vendorAssignmentService";
import { getEvents } from "../../services/eventService";
import { getVendors } from "../../services/vendorService";
import VendorAssignmentForm from "./VendorAssignmentForm";

interface AssignmentsPageProps {
  onNavigate: (tab: string) => void;
}

const statusColor: Record<string, string> = {
  Assigned: "#2dd4bf",
  Confirmed: "#34d399",
  Pending: "#f59e0b",
  Rejected: "#fb7185",
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

const AssignmentsPage = ({ onNavigate }: AssignmentsPageProps) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });

  const deleteMutation = useMutation({
    mutationFn: deleteVendorAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendorAssignments"] }),
  });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const getVendorName = (id: number) => vendors?.find((v) => v.id === id)?.name ?? `Vendor #${id}`;

  const total = assignments?.length ?? 0;
  const confirmed = assignments?.filter((a) => a.status === "Confirmed").length ?? 0;
  const pending = assignments?.filter((a) => a.status !== "Confirmed").length ?? 0;

  const filtered = assignments?.filter((a) => {
    const eventName = getEventName(a.event_id).toLowerCase();
    const vendorName = getVendorName(a.vendor_id).toLowerCase();
    const matchesSearch = eventName.includes(search.toLowerCase()) || vendorName.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts: Record<string, number> = {};
  assignments?.forEach((a) => { statusCounts[a.status] = (statusCounts[a.status] ?? 0) + 1; });
  const donutData = Object.entries(statusCounts).map(([name, value]) => ({ name, value, color: statusColor[name] ?? "#94a3b8" }));

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Vendor Assignments <ClipboardList size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Track which vendors are linked to which events.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatModule label="Total Assignments" value={String(total)} icon={ClipboardList} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Confirmed" value={String(confirmed)} icon={CheckCircle2} badgeColor="rgba(52,211,153,0.15)" />
        <StatModule label="Pending" value={String(pending)} icon={Clock} badgeColor="rgba(245,158,11,0.15)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VendorAssignmentForm />

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-base font-semibold text-[var(--text)]">Assignments</h2>
            <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full">{total} total</span>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search event or vendor…"
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
              <option value="Assigned">Assigned</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="divide-y divide-[var(--border)] max-h-[360px] overflow-y-auto">
            {filtered && filtered.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] py-4">No assignments match your search.</p>
            )}
            {filtered?.map((assignment) => {
              const color = statusColor[assignment.status] ?? "#94a3b8";
              return (
                <div key={assignment.id} className="py-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{getEventName(assignment.event_id)}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{getVendorName(assignment.vendor_id)} · {assignment.service}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}18`, color }}>
                      {assignment.status}
                    </span>
                    <button onClick={() => deleteMutation.mutate(assignment.id)} className="text-[10px] font-medium text-red-400 hover:text-red-300">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">By Status</h2>
          {donutData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No assignments yet.</p>
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
                  <p className="text-[10px] text-[var(--text-muted)]">Total</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md">
          <button onClick={() => onNavigate("Notifications")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Bell size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Notify Vendors</p>
              <p className="text-xs text-[var(--text-muted)]">Send schedule updates</p>
            </div>
          </button>
          <button onClick={() => onNavigate("Export")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Download size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Export Report</p>
              <p className="text-xs text-[var(--text-muted)]">Download assignment summary</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;