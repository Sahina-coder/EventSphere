import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { getEvents } from "../../services/eventService";
import {
  getEventCsvUrl,
  getEventPdfUrl,
} from "../../services/reportExportService";

const ReportExport = () => {
  const [eventId, setEventId] = useState("");

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 max-w-xl">
        <h2 className="font-display text-lg font-semibold mb-1">
          Reports & Export
        </h2>

        <p className="text-sm text-[var(--text-muted)] mb-5">
          Download a full event summary — registrations, attendance, budget, and vendors.
        </p>

        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition mb-5"
        >
          <option value="">Select event</option>

          {events?.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        {eventId && (
          <div className="grid grid-cols-2 gap-3">

            {/* PDF Download */}
            <a
              href={getEventPdfUrl(parseInt(eventId))}
              className="flex items-center justify-center gap-2 bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-3 hover:brightness-110 transition"
            >
              <FileText size={16} />
              Download PDF
            </a>

            {/* CSV Download */}
            <a
              href={getEventCsvUrl(parseInt(eventId))}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-lg px-4 py-3 hover:bg-slate-50 transition"
            >
              <FileSpreadsheet size={16} />
              Download CSV
            </a>

          </div>
        )}

        {!eventId && (
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <Download size={12} />
            Select an event above to enable downloads.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportExport;
