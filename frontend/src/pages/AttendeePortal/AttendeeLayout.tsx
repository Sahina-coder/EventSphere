import { NavLink, Outlet } from "react-router-dom";
import { CalendarRange, Compass, Ticket, CalendarDays, MessageSquareHeart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAttendees } from "../../services/attendeeService";
import { useAttendeeContext } from "../../context/AttendeeContext";

const navItems = [
  { to: "", label: "Dashboard", icon: CalendarRange, end: true },
  { to: "discover", label: "Discover Events", icon: Compass },
  { to: "tickets", label: "My Tickets", icon: Ticket },
  { to: "schedule", label: "Schedule", icon: CalendarDays },
  { to: "feedback", label: "Feedback", icon: MessageSquareHeart },
];

const AttendeeLayout = () => {
  const { attendeeId, setAttendeeId } = useAttendeeContext();
  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });

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
          <p className="text-xs text-[var(--text-muted)] mt-2">Attendee Portal</p>
        </div>

        <div className="px-4 py-4 border-b border-[var(--border)]">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Viewing as</label>
          <select
            value={attendeeId ?? ""}
            onChange={(e) => setAttendeeId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          >
            <option value="">Select attendee</option>
            {attendees?.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
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

export default AttendeeLayout;