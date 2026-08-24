import { NavLink, Outlet } from "react-router-dom";
import { CalendarRange, Briefcase, ClipboardCheck, Wallet, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getVendors } from "../../services/vendorService";
import { useVendorContext } from "../../context/VendorContext";

const navItems = [
  { to: "", label: "Dashboard", icon: CalendarRange, end: true },
  { to: "opportunities", label: "Opportunities", icon: Briefcase },
  { to: "assignments", label: "My Assignments", icon: ClipboardCheck },
  { to: "payments", label: "Payments", icon: Wallet },
  { to: "reviews", label: "Reviews", icon: Star },
];

const VendorLayout = () => {
  const { vendorId, setVendorId } = useVendorContext();
  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <aside className="w-60 shrink-0 bg-white border-r border-[var(--border)] h-screen sticky top-0 overflow-y-auto">
        <div className="px-5 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white">
              <CalendarRange size={16} />
            </div>
            <span className="font-logo text-xl font-bold">EventSphere</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2">Vendor Portal</p>
        </div>

        <div className="px-4 py-4 border-b border-[var(--border)]">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Viewing as</label>
          <select
            value={vendorId ?? ""}
            onChange={(e) => setVendorId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          >
            <option value="">Select vendor</option>
            {vendors?.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <nav className="px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? "bg-indigo-50 text-[var(--accent)]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 px-8 py-8 max-w-5xl">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;