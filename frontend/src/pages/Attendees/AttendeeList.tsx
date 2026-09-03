import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAttendees, updateAttendanceStatus } from "../../services/attendeeService";
import { getEvents } from "../../services/eventService";
import { generateTicket, getTicketQrUrl, getTickets } from "../../services/ticketService";

const statusColor: Record<string, string> = {
  Registered: "#2dd4bf",
  "Checked In": "#34d399",
  Absent: "#fb7185",
  Cancelled: "#94a3b8",
};

const AttendeeList = () => {
  const queryClient = useQueryClient();
  const [qrTicketId, setQrTicketId] = useState<number | null>(null);

  const { data: attendees, isLoading, error } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });
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
  const getTicketForAttendee = (attendeeId: number) => tickets?.find((t) => t.attendee_id === attendeeId);

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-base font-semibold text-[var(--text)]">Attendees</h2>
        <span className="text-[10px] font-medium text-[var(--text-muted)] bg-white/5 px-2.5 py-1 rounded-full">
          {attendees ? attendees.length : 0} total
        </span>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />)}
        </div>
      )}
      {error && <p className="text-sm text-red-400">Couldn't reach the server. Is the backend running?</p>}
      {attendees && attendees.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No attendees yet — register one to get started.</p>
      )}

      <div className="divide-y divide-[var(--border)]">
        {attendees?.map((attendee) => {
          const color = statusColor[attendee.attendance_status] ?? "#94a3b8";
          const ticket = getTicketForAttendee(attendee.id);

          return (
            <div key={attendee.id} className="py-3.5 first:pt-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center text-xs font-semibold shrink-0">
                  {attendee.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{attendee.name}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {getEventName(attendee.event_id)} · {attendee.email}
                  </p>
                </div>
                <select
                  value={attendee.attendance_status}
                  onChange={(e) => statusMutation.mutate({ id: attendee.id, status: e.target.value })}
                  className="text-[11px] font-medium px-2 py-1 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] shrink-0"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  <option value="Registered">Registered</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Absent">Absent</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-3 mt-2 pl-11">
                {ticket ? (
                  <>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Ticket: <span className="font-medium text-[var(--text)]">{ticket.ticket_code}</span>
                    </span>
                    <button onClick={() => setQrTicketId(ticket.id)} className="text-[11px] font-medium text-[var(--accent)] hover:underline">
                      View QR
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => ticketMutation.mutate(attendee.id)}
                    disabled={ticketMutation.isPending}
                    className="text-[11px] font-medium text-[var(--accent)] hover:underline disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setQrTicketId(null)}>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
            <img src={getTicketQrUrl(qrTicketId)} alt="Ticket QR code" className="w-56 h-56" />
            <button
              onClick={() => setQrTicketId(null)}
              className="mt-4 w-full text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition"
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