import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Send } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { getNotifications, sendNotification, markNotificationRead } from "../../services/notificationService";

const recipientTypes = ["All Participants", "Vendors", "Staff", "Resource Managers"];
const notificationTypes = [
  "Event Reminder", "Venue Change", "Schedule Change", "Registration Closing",
  "Event Cancellation", "Vendor Instruction", "Emergency Alert", "Resource Issue",
];

const Notifications = () => {
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState("");
  const [recipientType, setRecipientType] = useState("All Participants");
  const [notificationType, setNotificationType] = useState("Event Reminder");
  const [message, setMessage] = useState("");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: notifications } = useQuery({ queryKey: ["notifications"], queryFn: getNotifications });

  const sendMutation = useMutation({
    mutationFn: sendNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setMessage("");
    },
  });

  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const getEventName = (id?: number) => (id ? events?.find((e) => e.id === id)?.name : null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      event_id: eventId ? parseInt(eventId) : undefined,
      recipient_type: recipientType,
      notification_type: notificationType,
      message,
      sender: "Organizer",
    });
  };

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 max-w-xl">
        <h2 className="font-display text-lg font-semibold mb-1">Send Announcement</h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">Notify participants, vendors, or staff.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            >
              {recipientTypes.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            >
              {notificationTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Write your announcement…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />

          <button
            type="submit"
            disabled={sendMutation.isPending}
            className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Send size={14} /> {sendMutation.isPending ? "Sending…" : "Send announcement"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Bell size={18} /> Notification History
          </h2>
          <span className="text-xs font-medium text-[var(--text-muted)] bg-slate-100 px-2.5 py-1 rounded-full">
            {notifications ? notifications.length : 0} total
          </span>
        </div>

        {!notifications || notifications.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No notifications sent yet.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`border border-slate-100 rounded-lg px-4 py-3.5 ${n.is_read ? "opacity-60" : ""}`}
                style={{ borderLeft: "3px solid #4F46E5" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--accent)] uppercase">{n.notification_type}</span>
                  <span className="text-xs text-[var(--text-muted)]">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-700 mt-1.5">{n.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-[var(--text-muted)]">
                    To: {n.recipient_type}{getEventName(n.event_id) ? ` · ${getEventName(n.event_id)}` : ""}
                  </p>
                  {!n.is_read && (
                    <button
                      onClick={() => readMutation.mutate(n.id)}
                      className="text-xs font-medium text-[var(--accent)] hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;