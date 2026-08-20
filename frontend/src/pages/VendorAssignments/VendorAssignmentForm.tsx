import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignVendor } from "../../services/vendorAssignmentService";
import { getEvents } from "../../services/eventService";
import { getVendors } from "../../services/vendorService";

const VendorAssignmentForm = () => {
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [service, setService] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: vendors } = useQuery({ queryKey: ["vendors"], queryFn: getVendors });

  const mutation = useMutation({
    mutationFn: assignVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorAssignments"] });
      setEventId("");
      setVendorId("");
      setService("");
      setErrorMsg("");
    },
    onError: (error: any) => {
      const detail = error?.response?.data?.detail;
      setErrorMsg(detail || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    mutation.mutate({
      event_id: parseInt(eventId),
      vendor_id: parseInt(vendorId),
      service,
      status: "Assigned",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 h-fit">
      <h2 className="font-display text-lg font-semibold mb-1">Assign Vendor</h2>
      <p className="text-sm text-[var(--text-muted)] mb-5">Link a vendor to an event.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Event</label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          >
            <option value="">Select event</option>
            {events?.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Vendor</label>
          <select
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          >
            <option value="">Select vendor</option>
            {vendors?.map((v) => (
              <option key={v.id} value={v.id}>{v.name} · {v.service_type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Service for this event</label>
          <input
            type="text"
            placeholder="Catering"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3.5 py-2.5">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
        >
          {mutation.isPending ? "Assigning…" : "Assign vendor"}
        </button>
      </form>
    </div>
  );
};

export default VendorAssignmentForm;