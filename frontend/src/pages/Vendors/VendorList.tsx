import { useQuery } from "@tanstack/react-query";
import { getVendors } from "../../services/vendorService";

const VendorList = () => {
  const { data: vendors, isLoading, error } = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
  });

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold">Vendors</h2>
        <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
          {vendors ? vendors.length : 0} total
        </span>
      </div>

      {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading vendors…</p>}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {vendors && vendors.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No vendors yet — add one to get started.</p>
      )}

      <div className="space-y-3">
        {vendors?.map((vendor) => (
          <div
            key={vendor.id}
            className="border border-slate-100 rounded-lg px-4 py-3.5 flex items-start justify-between gap-4 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            style={{ borderLeft: "3px solid #4F46E5" }}
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-800">{vendor.name}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{vendor.service_type}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{vendor.phone} · {vendor.email}</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap bg-indigo-50 text-[var(--accent)]">
              {vendor.availability}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorList;