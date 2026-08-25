import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { getVenues } from "../../services/venueService";
import { getVenueMap, addMapPoint, deleteMapPoint } from "../../services/venueMapService";

const pointTypes = [
  { type: "Main Entrance", color: "#4F46E5" },
  { type: "Registration Desk", color: "#059669" },
  { type: "Event Hall", color: "#D97706" },
  { type: "Food Area", color: "#EA580C" },
  { type: "Parking", color: "#64748B" },
  { type: "Restroom", color: "#0EA5E9" },
  { type: "Help Desk", color: "#8B5CF6" },
  { type: "Emergency Exit", color: "#DC2626" },
];

const getColor = (type: string) => pointTypes.find((p) => p.type === type)?.color ?? "#4F46E5";

const VenueMap = () => {
  const queryClient = useQueryClient();
  const [venueId, setVenueId] = useState("");
  const [selectedType, setSelectedType] = useState(pointTypes[0].type);
  const [label, setLabel] = useState("");
  const [placing, setPlacing] = useState(false);

  const { data: venues } = useQuery({ queryKey: ["venues"], queryFn: getVenues });
  const { data: points } = useQuery({
    queryKey: ["venueMap", venueId],
    queryFn: () => getVenueMap(parseInt(venueId)),
    enabled: !!venueId,
  });

  const addMutation = useMutation({
    mutationFn: addMapPoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venueMap", venueId] });
      setLabel("");
      setPlacing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMapPoint,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venueMap", venueId] }),
  });

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placing || !venueId || !label.trim()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    addMutation.mutate({
      venue_id: parseInt(venueId),
      label: label.trim(),
      point_type: selectedType,
      x,
      y,
    });
  };

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-1">Interactive Venue Map</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Select a venue and place markers on its layout.</p>
        <select
          value={venueId}
          onChange={(e) => setVenueId(e.target.value)}
          className="w-full max-w-sm bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
        >
          <option value="">Select venue</option>
          {venues?.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      {venueId && (
        <>
          <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
            <h3 className="font-display text-base font-semibold mb-4">Add a Marker</h3>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                >
                  {pointTypes.map((p) => (
                    <option key={p.type} value={p.type}>{p.type}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Label</label>
                <input
                  type="text"
                  placeholder="e.g. Hall A"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                />
              </div>
              <button
                onClick={() => setPlacing(!placing)}
                disabled={!label.trim()}
                className={`text-sm font-medium rounded-lg px-4 py-2.5 transition disabled:opacity-50 ${
                  placing ? "bg-amber-500 text-white" : "bg-[var(--accent)] text-white hover:brightness-110"
                }`}
              >
                {placing ? "Click on map to place…" : "Place marker"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
            <h3 className="font-display text-base font-semibold mb-4">Layout</h3>
            <div
              onClick={handleCanvasClick}
              className={`relative w-full aspect-video bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 ${
                placing ? "cursor-crosshair" : ""
              }`}
            >
              {points?.map((p) => (
                <div
                  key={p.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: getColor(p.point_type) }}
                  />
                  <span className="text-[10px] font-medium bg-white px-1.5 py-0.5 rounded shadow-sm mt-1 whitespace-nowrap">
                    {p.label}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(p.id); }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 mt-0.5 transition"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
              {(!points || points.length === 0) && (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                  No markers yet — add one above, then click here to place it.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {pointTypes.map((p) => (
                <div key={p.type} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.type}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VenueMap;