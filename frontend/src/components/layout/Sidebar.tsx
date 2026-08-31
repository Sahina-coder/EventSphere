import {
  CalendarRange, MapPin, Package, Link2, Boxes, Users, Building2,
  ClipboardList, Wallet, BarChart3, HeartPulse, ShieldAlert,
  MessageSquareHeart, Award, Compass,
  Bell,
  PackageSearch,
  FlaskConical,
  AlertOctagon,Handshake,
  ClipboardCheck,TrendingUp,FileText,
} from "lucide-react";

interface SidebarProps {
  active: string;
  onChange: (tab: string) => void;
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
  {
    title: "Core",
    items: [
      { label: "Events", icon: CalendarRange },
      { label: "Venues", icon: MapPin },
      { label: "Venue Map", icon: MapPin },
      { label: "Resources", icon: Package },
      { label: "Bookings", icon: Link2 },
      { label: "Allocations", icon: Boxes },
      { label: "Approvals", icon: ClipboardCheck }
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
      { label: "Sponsorship", icon: Handshake }
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Analytics", icon: BarChart3 },
      { label: "Forecast", icon: TrendingUp },
      { label: "Health Score", icon: HeartPulse },
      { label: "Simulator" , icon: FlaskConical},
      { label: "Risks", icon: ShieldAlert },
      { label: "Venue Match", icon: Compass },
      { label: "Incidents", icon: AlertOctagon }
    ],
  },
  {
    title: "Post-Event",
    items: [
      { label: "Feedback", icon: MessageSquareHeart },
      { label: "Certificates", icon: Award },
      { label: "Lost & Found", icon: PackageSearch },
      { label: "Report", icon: BarChart3 },
      { label: "Export", icon: FileText },
      { label: "Notifications", icon: Bell },
    ],
  },
];

const Sidebar = ({ active, onChange }: SidebarProps) => {
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-[var(--border)] h-screen sticky top-0 overflow-y-auto">
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white shrink-0">
            <CalendarRange size={16} />
          </div>
          <div>
            <h1 className="font-logo text-xl font-bold leading-none">EventSphere</h1>
          </div>
        </div>
      </div>

      <nav className="px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = active === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => onChange(item.label)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-50 text-[var(--accent)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;