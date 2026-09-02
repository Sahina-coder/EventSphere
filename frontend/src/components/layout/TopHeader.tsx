import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { getNotifications } from "../../services/notificationService";

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  onNotificationsClick: () => void;
}

const TopHeader = ({ title, subtitle, onMenuClick, onNotificationsClick }: TopHeaderProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: notifications } = useQuery({ queryKey: ["notifications"], queryFn: getNotifications });
  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0;

  return (
    <header className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-20">
      <div className="px-5 md:px-8 py-3.5 flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-[var(--text-muted)]">
          <Menu size={20} />
        </button>

        <div className="hidden md:block flex-1 max-w-sm">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search events, venues, vendors…"
              className="w-full bg-white/5 border border-[var(--border)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            />
          </div>
        </div>

        <div className="flex-1 md:hidden">
          <h2 className="font-display text-base font-semibold text-[var(--text)]">{title}</h2>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button onClick={onNotificationsClick} className="relative text-[var(--text-muted)] hover:text-[var(--text)] transition">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--accent)] text-[#0a0f0e] text-[10px] font-semibold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center text-xs font-semibold">
                OR
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-[var(--text)] leading-tight">Organizer</p>
                <p className="text-[10px] text-[var(--text-muted)] leading-tight">Admin</p>
              </div>
              <ChevronDown size={14} className="text-[var(--text-muted)] hidden sm:block" />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block px-8 pb-4">
        <h2 className="font-display text-2xl font-bold text-[var(--text)]">{title}</h2>
        {subtitle && <p className="text-sm text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
      </div>
    </header>
  );
};

export default TopHeader;