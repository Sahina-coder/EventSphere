import { useQuery } from "@tanstack/react-query";
import { getVendors } from "../../services/vendorService";

const VendorList = () => {
  const { data: vendors, isLoading, error } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-base font-semibold text-[var(--text)]">Vendors</h2>
        <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2.5 py-1 rounded-full">
          {vendors ? vendors.length : 0} total
        </span>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />)}
        </div>
      )}
      {error && <p className="text-sm text-red-400">Couldn't reach the server. Is the backend running?</p>}
      {vendors && vendors.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No vendors yet — add one to get started.</p>
      )}

      <div className="divide-y divide-[var(--border)]">
        {vendors?.map((vendor) => (
          <div key={vendor.id} className="py-3.5 first:pt-0 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center text-xs font-semibold shrink-0">
              {vendor.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text)] truncate">{vendor.name}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{vendor.service_type} · {vendor.phone}</p>
            </div>
            <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] shrink-0">
              {vendor.availability}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorList;