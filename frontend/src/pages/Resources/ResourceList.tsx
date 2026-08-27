import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-slate-50 animate-pulse" />
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {resources && resources.length === 0 && (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📦</p>
          <p className="text-sm font-medium text-slate-700">No resources yet</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Add one to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {resources?.map((resource, i) => {
          const pct = resource.quantity_total > 0
            ? (resource.quantity_available / resource.quantity_total) * 100
            : 0;
          const barColor = pct === 0 ? "#DC2626" : pct <= 20 ? "#D97706" : "#059669";
          const statusLabel = pct === 0 ? "Out of Stock" : pct <= 20 ? "Low Stock" : "Available";

          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              className="border border-slate-100 rounded-lg px-4 py-3.5 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{resource.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{resource.category}</p>
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{ backgroundColor: `${barColor}18`, color: barColor }}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
                <span>{resource.quantity_available} / {resource.quantity_total} available</span>
                <span>{Math.round(pct)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: barColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.04 + 0.1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceList;