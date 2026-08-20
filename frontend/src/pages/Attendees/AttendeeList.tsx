import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAttendees, updateAttendanceStatus } from "../../services/attendeeService";
import { getEvents } from "../../services/eventService";
import { generateTicket, getTicketQrUrl, getTickets } from "../../services/ticketService";

const statusColor: Record<string, string> = {
  Registered: "#4F46E5",
  "Checked In": "#059669",
  Absent: "#DC2626",
  Cancelled: "#64748B",
};

const AttendeeList = () => {
  const queryClient = useQueryClient();
  const [qrTicketId, setQrTicketId] = useState<number | null>(null);

  const { data: attendees, isLoading, error } = useQuery({
    queryKey: ["attendees"],
    queryFn: getAttendees,
  });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: tickets } = useQuery({ queryKey: ["tickets"], queryFn: getTickets });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateAttendanceStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendees"] }),
  });

  const ticketMutation = useMutation({
    mutationFn: generateTicket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets"] }),
  });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const getTicketForAttendee = (attendeeId: number) =>
    tickets?.find((t) => t.attendee_id === attendeeId);

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold">Attendees</h2>
        <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
          {attendees ? attendees.length : 0} total
        </span>
      </div>

      {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading attendees…</p>}
      {error && <p className="text-sm text-red-500">Couldn't reach the server. Is the backend running?</p>}
      {attendees && attendees.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No attendees yet — register one to get started.</p>
      )}

      <div className="space-y-3">
        {attendees?.map((attendee) => {
          const color = statusColor[attendee.attendance_status] ?? "#64748B";
          const ticket = getTicketForAttendee(attendee.id);

          return (
            <div
              key={attendee.id}
              className="border border-slate-100 rounded-lg px-4 py-3.5"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{attendee.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {getEventName(attendee.event_id)} · {attendee.email}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{attendee.phone}</p>
                </div>
                <select
                  value={attendee.attendance_status}
                  onChange={(e) => statusMutation.mutate({ id: attendee.id, status: e.target.value })}
                  className="text-xs font-medium px-2.5 py-1 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  <option value="Registered">Registered</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Absent">Absent</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-3 mt-3">
                {ticket ? (
                  <>
                    <span className="text-xs text-[var(--text-muted)]">
                      Ticket: <span className="font-medium text-slate-700">{ticket.ticket_code}</span>
                    </span>
                    <button
                      onClick={() => setQrTicketId(ticket.id)}
                      className="text-xs font-medium text-[var(--accent)] hover:underline"
                    >
                      View QR
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => ticketMutation.mutate(attendee.id)}
                    disabled={ticketMutation.isPending}
                    className="text-xs font-medium text-[var(--accent)] hover:underline disabled:opacity-50"
                  >
                    Generate ticket
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {qrTicketId && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setQrTicketId(null)}
        >
          <div
            className="bg-white rounded-xl p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={getTicketQrUrl(qrTicketId)} alt="Ticket QR code" className="w-56 h-56" />
            <button
              onClick={() => setQrTicketId(null)}
              className="mt-4 w-full text-sm font-medium text-[var(--text-muted)] hover:text-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeeList;