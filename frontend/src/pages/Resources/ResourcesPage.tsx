import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, CheckCircle2, AlertTriangle, Search, Boxes, Download } from "lucide-react";
import { getResources } from "../../services/resourceService";
import ResourceForm from "./ResourceForm";

interface ResourcesPageProps {
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

const ResourcesPage = ({ onNavigate }: ResourcesPageProps) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const { data: resources } = useQuery({ queryKey: ["resources"], queryFn: getResources });

  const total = resources?.length ?? 0;
  const totalQty = resources?.reduce((s, r) => s + r.quantity_total, 0) ?? 0;
  const availableQty = resources?.reduce((s, r) => s + r.quantity_available, 0) ?? 0;
  const lowStock = resources?.filter((r) => r.quantity_total > 0 && r.quantity_available / r.quantity_total <= 0.2 && r.quantity_available > 0).length ?? 0;
  const utilPct = totalQty > 0 ? Math.round(((totalQty - availableQty) / totalQty) * 100) : 0;

  const categories = ["All", ...Array.from(new Set(resources?.map((r) => r.category) ?? []))];

  const filtered = resources?.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Resources <Package size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Monitor inventory levels and utilization.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatModule label="Total Resources" value={String(total)} icon={Package} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Total Units" value={String(totalQty)} icon={Boxes} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Low Stock Items" value={String(lowStock)} icon={AlertTriangle} badgeColor="rgba(245,158,11,0.15)" />
        <StatModule label="Utilization" value={`${utilPct}%`} icon={CheckCircle2} badgeColor="rgba(52,211,153,0.15)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ResourceForm />

        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-base font-semibold text-[var(--text)]">Resources</h2>
            <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2 py-0.5 rounded-full">{total} total</span>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search resource…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/5 border border-[var(--border)] rounded-lg px-2.5 py-2 text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            {filtered && filtered.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] py-4">No resources match your search.</p>
            )}
            {filtered?.map((resource) => {
              const pct = resource.quantity_total > 0 ? (resource.quantity_available / resource.quantity_total) * 100 : 0;
              const barColor = pct === 0 ? "#fb7185" : pct <= 20 ? "#f59e0b" : "#34d399";
              return (
                <div key={resource.id} className="border border-[var(--border)] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{resource.name}</p>
                    <span className="text-[10px] text-[var(--text-muted)] shrink-0">{resource.quantity_available}/{resource.quantity_total}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-2">{resource.category}</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-display text-sm font-semibold text-[var(--text)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md">
          <button onClick={() => onNavigate("Allocations")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Boxes size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Allocate to Event</p>
              <p className="text-xs text-[var(--text-muted)]">Assign resources</p>
            </div>
          </button>
          <button onClick={() => onNavigate("Export")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Download size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Export Report</p>
              <p className="text-xs text-[var(--text-muted)]">Download resource summary</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;