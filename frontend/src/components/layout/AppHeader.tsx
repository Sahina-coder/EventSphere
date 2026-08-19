import { CalendarRange } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="bg-white border-b border-[var(--border)] px-6 py-4 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white">
          <CalendarRange size={18} />
        </div>
        <div>
          <h1 className="font-logo text-2xl font-bold leading-tight">EventSphere</h1>
          <p className="text-xs text-[var(--text-muted)]">Event planning & resource management</p>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;