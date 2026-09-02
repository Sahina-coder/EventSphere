import {
  LayoutDashboard, CalendarRange, MapPin, Map, Package, Link2, Boxes,
  ClipboardCheck, Users, Building2, ClipboardList, Wallet, Handshake,
  BarChart3, HeartPulse, ShieldAlert, Compass, FlaskConical, TrendingUp,
  MessageSquareHeart, Award, FileText, Bell, PackageSearch, AlertOctagon,
} from "lucide-react";

interface SidebarProps {
  active: string;
  onChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  { title: "Command Center", items: [{ label: "Overview", icon: LayoutDashboard }] },
  { title: "Events", items: [{ label: "Events", icon: CalendarRange }] },
  {
    title: "Operations",
    items: [
      { label: "Venues", icon: MapPin },
      { label: "Venue Map", icon: Map },
      { label: "Resources", icon: Package },
      { label: "Bookings", icon: Link2 },
      { label: "Allocations", icon: Boxes },
      { label: "Approvals", icon: ClipboardCheck },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Attendees", icon: Users },
      { label: "Vendors", icon: Building2 },
      { label: "Assignments", icon: ClipboardList },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Budget", icon: Wallet },
      { label: "Sponsorship", icon: Handshake },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Analytics", icon: BarChart3 },
      { label: "Health Score", icon: HeartPulse },
      { label: "Risks", icon: ShieldAlert },
      { label: "Venue Match", icon: Compass },
      { label: "Simulator", icon: FlaskConical },
      { label: "Forecast", icon: TrendingUp },
    ],
  },
  {
    title: "Post-Event",
    items: [
      { label: "Feedback", icon: MessageSquareHeart },
      { label: "Certificates", icon: Award },
      { label: "Report", icon: BarChart3 },
      { label: "Export", icon: FileText },
    ],
  },
  {
    title: "Other",
    items: [
      { label: "Notifications", icon: Bell },
      { label: "Lost & Found", icon: PackageSearch },
      { label: "Incidents", icon: AlertOctagon },
    ],
  },
];

const Sidebar = ({ active, onChange, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`w-64 shrink-0 bg-[var(--card)] border-r border-[var(--border)] h-screen fixed md:sticky top-0 overflow-y-auto z-40 transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-5 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <img src="/eventsphere-logo.svg" alt="EventSphere" className="w-8 h-8 rounded-lg shrink-0" />
            <div>
              <h1 className="font-logo text-xl font-bold leading-none text-[var(--text)]">EventSphere</h1>
            </div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-5 pb-10">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = active === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        onChange(item.label);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition relative ${
                        isActive
                          ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text)]"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[var(--accent)] rounded-full" />
                      )}
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-[var(--border)] mx-3 mb-4 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            All systems operational
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;