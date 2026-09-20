import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarRange, Briefcase, ClipboardCheck, Wallet, Star, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createVendor, getVendorByEmail } from "../../services/vendorService";

const navItems = [
  { to: "", label: "Dashboard", icon: CalendarRange, end: true },
  { to: "opportunities", label: "Opportunities", icon: Briefcase },
  { to: "assignments", label: "My Assignments", icon: ClipboardCheck },
  { to: "payments", label: "Payments", icon: Wallet },
  { to: "reviews", label: "Reviews", icon: Star },
];

const VendorLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [setupDone, setSetupDone] = useState(false);

  const { data: vendor, isError, isLoading } = useQuery({
    queryKey: ["myVendorRecord", user?.email],
    queryFn: () => getVendorByEmail(user!.email),
    enabled: !!user?.email,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myVendorRecord", user?.email] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setSetupDone(true);
    },
  });

  useEffect(() => {
    if (!isLoading && isError && user && !setupDone && !createMutation.isPending) {
      createMutation.mutate({
        name: user.name,
        service_type: "General",
        phone: user.phone || "0000000000",
        email: user.email,
        availability: "Available",
      });
    }
  }, [isLoading, isError, user, setupDone]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <aside className="w-60 shrink-0 bg-[var(--card)] border-r border-[var(--border)] h-screen sticky top-0 overflow-y-auto flex flex-col">
        <div className="px-5 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <img src="/eventsphere-logo.svg" alt="EventSphere" className="w-8 h-8 rounded-lg" />
            <span className="font-logo text-xl font-bold text-[var(--text)]">EventSphere</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2">Vendor Portal</p>
        </div>

        <div className="px-4 py-4 border-b border-[var(--border)]">
          <p className="text-sm font-medium text-[var(--text)]">{user?.name}</p>
          <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
          {vendor && <p className="text-[10px] text-[var(--accent)] mt-1">{vendor.service_type} · {vendor.availability}</p>}
        </div>

        <nav className="px-3 py-4 space-y-0.5 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text)]"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[var(--border)]">
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-white/5 transition">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 px-8 py-8 max-w-5xl">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;