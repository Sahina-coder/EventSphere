import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Building2, CheckCircle2, Clock, Briefcase, Search, Send, Download, Handshake } from "lucide-react";
import { getVendors } from "../../services/vendorService";
import { getVendorAssignments } from "../../services/vendorAssignmentService";
import VendorForm from "./VendorForm";

interface VendorsPageProps {
  onNavigate: (tab: string) => void;
}

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

const VendorsPage = ({ onNavigate }: VendorsPageProps) => {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");

  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });
  const { data: assignments } = useQuery({ queryKey: ["vendorAssignments"], queryFn: getVendorAssignments });

  const total = vendors?.length ?? 0;
  const active = vendors?.filter((v) => v.availability === "Available").length ?? 0;
  const pending = assignments?.filter((a) => a.status !== "Confirmed").length ?? 0;
  const assignedIds = new Set(assignments?.map((a) => a.vendor_id));

  const serviceTypes = ["All", ...Array.from(new Set(vendors?.map((v) => v.service_type) ?? []))];

  const filtered = vendors?.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
    const matchesService = serviceFilter === "All" || v.service_type === serviceFilter;
    return matchesSearch && matchesService;
  });

  // Breakdown by service type (real data)
  const serviceCounts: Record<string, number> = {};
  vendors?.forEach((v) => { serviceCounts[v.service_type] = (serviceCounts[v.service_type] ?? 0) + 1; });
  const donutColors = ["#2dd4bf", "#34d399", "#f59e0b", "#60a5fa", "#fb7185", "#94a3b8"];
  const donutData = Object.entries(serviceCounts).map(([name, value], i) => ({ name, value, color: donutColors[i % donutColors.length] }));

  // Vendors with pending confirmation (real data)
  const pendingVendors = assignments
    ?.filter((a) => a.status !== "Confirmed")
    .map((a) => vendors?.find((v) => v.id === a.vendor_id))
    .filter((v): v is NonNullable<typeof v> => !!v)
    .slice(0, 3);

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Vendors <Building2 size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Manage service providers and track availability.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatModule label="Total Vendors" value={String(total)} icon={Building2} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Active" value={String(active)} sub={total > 0 ? `${Math.round((active / total) * 100)}%` : undefined} icon={CheckCircle2} badgeColor="rgba(52,211,153,0.15)" />
        <StatModule label="Pending Confirmation" value={String(pending)} icon={Clock} badgeColor="rgba(245,158,11,0.15)" />
        <StatModule label="Currently Assigned" value={String(assignedIds.size)} icon={Briefcase} badgeColor="rgba(45,212,191,0.15)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VendorForm />

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-base font-semibold text-[var(--text)]">Vendors</h2>
            <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full">{total} total</span>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search vendor…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-white/5 border border-[var(--border)] rounded-lg px-2.5 py-2 text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            >
              {serviceTypes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="divide-y divide-[var(--border)] max-h-[360px] overflow-y-auto">
            {filtered && filtered.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] py-4">No vendors match your search.</p>
            )}
            {filtered?.map((vendor) => (
              <div key={vendor.id} className="py-3 first:pt-0 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center text-xs font-semibold shrink-0">
                  {vendor.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{vendor.name}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{vendor.service_type} · {vendor.phone}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] shrink-0">
                  {vendor.availability}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">By Service Type</h2>
          {donutData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No vendors yet.</p>
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
                  <p className="text-[10px] text-[var(--text-muted)]">Total Vendors</p>
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
                      {d.value} ({Math.round((d.value / total) * 100)}%)
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
            <button onClick={() => onNavigate("Assignments")} className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Handshake size={14} /></div>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Assign to Event</p>
                <p className="text-xs text-[var(--text-muted)]">Link a vendor to an event</p>
              </div>
            </button>
            <button onClick={() => onNavigate("Notifications")} className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Send size={14} /></div>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Send Notification</p>
                <p className="text-xs text-[var(--text-muted)]">Vendor instructions/updates</p>
              </div>
            </button>
            <button onClick={() => onNavigate("Export")} className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Download size={14} /></div>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Export Report</p>
                <p className="text-xs text-[var(--text-muted)]">Download vendor summary</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-sm font-semibold text-[var(--text)] mb-4">Pending Confirmations</h2>
          {!pendingVendors || pendingVendors.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">All vendors confirmed.</p>
          ) : (
            <div className="space-y-3">
              {pendingVendors.map((v) => (
                <div key={v.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-[10px] font-semibold shrink-0">
                    {v.name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{v.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{v.service_type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-sm font-semibold text-[var(--text)] mb-4">Availability Snapshot</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Available</span>
              <span className="text-[var(--text)] font-medium">{active}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Unavailable</span>
              <span className="text-[var(--text)] font-medium">{total - active}</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[var(--accent)]" style={{ width: total > 0 ? `${(active / total) * 100}%` : "0%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsPage;