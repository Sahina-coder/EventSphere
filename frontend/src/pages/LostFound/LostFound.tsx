import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PackageSearch } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getLostFoundItems, reportItem, updateItemStatus } from "../../services/lostFoundService";

const statusColor: Record<string, string> = {
  Reported: "#D97706",
  Found: "#0EA5E9",
  Claimed: "#8B5CF6",
  Verified: "#4F46E5",
  Returned: "#059669",
  Closed: "#64748B",
};

const statuses = ["Reported", "Found", "Claimed", "Verified", "Returned", "Closed"];

const LostFound = () => {
  const queryClient = useQueryClient();
  const [reportType, setReportType] = useState("Lost");
  const [eventId, setEventId] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [filter, setFilter] = useState("All");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: items } = useQuery({ queryKey: ["lostFound"], queryFn: getLostFoundItems });

  const reportMutation = useMutation({
    mutationFn: reportItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lostFound"] });
      setItemName("");
      setDescription("");
      setLocation("");
      setContactInfo("");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateItemStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lostFound"] }),
  });

  const getEventName = (id?: number) => (id ? events?.find((e) => e.id === id)?.name : null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportMutation.mutate({
      event_id: eventId ? parseInt(eventId) : undefined,
      report_type: reportType,
      item_name: itemName,
      description: description || undefined,
      location: location || undefined,
      contact_info: contactInfo || undefined,
    });
  };

  const filteredItems = items?.filter((i) => filter === "All" || i.report_type === filter) ?? [];

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 max-w-xl">
        <h2 className="font-display text-lg font-semibold mb-1">Report an Item</h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">Report something you lost or found.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {["Lost", "Found"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setReportType(t)}
                className={`text-sm font-medium rounded-lg px-3 py-2 border transition ${
                  reportType === t
                    ? "bg-indigo-50 border-[var(--accent)] text-[var(--accent)]"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t} Item
              </button>
            ))}
          </div>

          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
          >
            <option value="">General (no specific event)</option>
            {events?.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Item name (e.g. Black backpack)"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            />
            <input
              type="text"
              placeholder="Contact info"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={reportMutation.isPending}
            className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
          >
            {reportMutation.isPending ? "Submitting…" : "Submit report"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <PackageSearch size={18} /> Reports
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          >
            <option value="All">All</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>

        {filteredItems.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No reports yet.</p>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const color = statusColor[item.status] ?? "#64748B";
              return (
                <div key={item.id} className="border border-slate-100 rounded-lg px-4 py-3.5" style={{ borderLeft: `3px solid ${color}` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold uppercase ${item.report_type === "Lost" ? "text-red-500" : "text-emerald-600"}`}>
                          {item.report_type}
                        </span>
                        <p className="text-sm font-semibold text-slate-800">{item.item_name}</p>
                      </div>
                      {item.description && <p className="text-xs text-[var(--text-muted)] mt-1">{item.description}</p>}
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {item.location && `📍 ${item.location}`} {getEventName(item.event_id) && `· ${getEventName(item.event_id)}`}
                      </p>
                    </div>
                    <select
                      value={item.status}
                      onChange={(e) => statusMutation.mutate({ id: item.id, status: e.target.value })}
                      className="text-xs font-medium px-2.5 py-1 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LostFound;