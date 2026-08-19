interface TabsProps {
  active: string;
  onChange: (tab: string) => void;
}

const tabs = ["Events", "Venues", "Resources", "Bookings", "Allocations", "Report"];
const Tabs = ({ active, onChange }: TabsProps) => {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-6">
      <div className="inline-flex bg-slate-100 rounded-lg p-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
              active === tab
                ? "bg-white text-[var(--accent)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;