import { useQuery } from "@tanstack/react-query";
import { getResources } from "../../services/resourceService";

const ResourceList = () => {
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
  });

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold">Resources</h2>
        <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
          {resources ? resources.length : 0} total
        </span>
      </div>

      {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading resources…</p>}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {resources && resources.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No resources yet — add one to get started.</p>
      )}

      <div className="space-y-3">
        {resources?.map((resource) => {
          const pct = resource.quantity_total > 0
            ? (resource.quantity_available / resource.quantity_total) * 100
            : 0;
          const barColor = pct === 0 ? "bg-red-500" : pct <= 20 ? "bg-amber-500" : "bg-emerald-500";

          return (
            <div
              key={resource.id}
              className="border border-slate-100 rounded-lg px-4 py-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{resource.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{resource.category}</p>
                </div>
                <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                  {resource.quantity_available} / {resource.quantity_total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceList;