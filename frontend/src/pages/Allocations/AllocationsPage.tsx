import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Boxes, Package, CalendarRange, Search, Download } from "lucide-react";
import { getAllocations } from "../../services/allocationService";
import { getEvents } from "../../services/eventService";
import { getResources } from "../../services/resourceService";
import AllocationForm from "./AllocationForm";
import AllocationList from "./AllocationList";

interface AllocationsPageProps {
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

const AllocationsPage = ({ onNavigate }: AllocationsPageProps) => {
  const [search, setSearch] = useState("");

  const { data: allocations } = useQuery({ queryKey: ["allocations"], queryFn: getAllocations });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: resources } = useQuery({ queryKey: ["resources"], queryFn: getResources });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const getResourceName = (id: number) => resources?.find((r) => r.id === id)?.name ?? `Resource #${id}`;

  const total = allocations?.length ?? 0;
  const totalUnits = allocations?.reduce((s, a) => s + a.quantity, 0) ?? 0;
  const eventsWithAllocations = new Set(allocations?.map((a) => a.event_id)).size;

  // by resource (real data)
  const resourceCounts: Record<string, number> = {};
  allocations?.forEach((a) => {
    const name = getResourceName(a.resource_id);
    resourceCounts[name] = (resourceCounts[name] ?? 0) + a.quantity;
  });
  const donutData = Object.entries(resourceCounts).map(([name, value], i) => ({ name, value, color: donutColors[i % donutColors.length] }));

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          Allocations <Boxes size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Resources allocated to events, deducted from inventory in real time.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatModule label="Total Allocations" value={String(total)} icon={Boxes} badgeColor="rgba(45,212,191,0.15)" />
        <StatModule label="Total Units Allocated" value={String(totalUnits)} icon={Package} badgeColor="rgba(52,211,153,0.15)" />
        <StatModule label="Events with Allocations" value={String(eventsWithAllocations)} icon={CalendarRange} badgeColor="rgba(245,158,11,0.15)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AllocationForm />
        <div className="lg:col-span-1">
          <AllocationList />
        </div>

        <div className="lg:col-span-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">By Resource</h2>
          {donutData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No allocations yet.</p>
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
                  <p className="text-2xl font-bold text-[var(--text)]">{totalUnits}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Total Units</p>
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
          <button onClick={() => onNavigate("Resources")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Package size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">View Resources</p>
              <p className="text-xs text-[var(--text-muted)]">Check inventory levels</p>
            </div>
          </button>
          <button onClick={() => onNavigate("Export")} className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0"><Download size={14} /></div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Export Report</p>
              <p className="text-xs text-[var(--text-muted)]">Download allocation summary</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllocationsPage;