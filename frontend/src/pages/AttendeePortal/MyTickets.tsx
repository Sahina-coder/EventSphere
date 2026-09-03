import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Ticket as TicketIcon } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getTickets, getTicketQrUrl } from "../../services/ticketService";
import { useAttendeeContext } from "../../context/AttendeeContext";

const MyTickets = () => {
  const { attendeeId } = useAttendeeContext();
  const [qrTicketId, setQrTicketId] = useState<number | null>(null);
  const { data: tickets } = useQuery({ queryKey: ["tickets"], queryFn: getTickets });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });

  const myTickets = tickets?.filter((t) => t.attendee_id === attendeeId) ?? [];
  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)] flex items-center gap-2">
          My Tickets <TicketIcon size={20} className="text-[var(--text-muted)]" />
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Your digital tickets and QR codes.</p>
      </div>

      {!attendeeId ? (
        <p className="text-sm text-[var(--text-muted)]">Select an attendee identity from the sidebar.</p>
      ) : myTickets.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No tickets yet — register for an event to get one.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myTickets.map((t) => (
            <div key={t.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[var(--accent)] mb-1">
                  <TicketIcon size={16} />
                  <span className="text-sm font-semibold">{t.ticket_code}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{getEventName(t.event_id)}</p>
              </div>
              <button onClick={() => setQrTicketId(t.id)} className="text-xs font-medium text-[var(--accent)] hover:underline">
                View QR
              </button>
            </div>
          ))}
        </div>
      )}

      {qrTicketId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setQrTicketId(null)}>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
            <img src={getTicketQrUrl(qrTicketId)} alt="Ticket QR" className="w-56 h-56" />
            <button onClick={() => setQrTicketId(null)} className="mt-4 w-full text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;