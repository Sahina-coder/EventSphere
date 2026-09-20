import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvents } from "../../services/eventService";
import { getAttendees } from "../../services/attendeeService";
import { submitFeedback, getFeedbackSummary } from "../../services/feedbackService";
import { useAuth } from "../../context/AuthContext";

const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
  <div>
    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">{label}</label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="text-2xl leading-none"
          style={{ color: star <= value ? "#F59E0B" : "#E2E8F0" }}
        >
          ★
        </button>
      ))}
    </div>
  </div>
);

const Feedback = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [eventId, setEventId] = useState("");
  const [overall, setOverall] = useState(0);
  const [venue, setVenue] = useState(0);
  const [organization, setOrganization] = useState(0);
  const [speaker, setSpeaker] = useState(0);
  const [catering, setCatering] = useState(0);
  const [comments, setComments] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });
  const { data: summary } = useQuery({
    queryKey: ["feedbackSummary", eventId],
    queryFn: () => getFeedbackSummary(parseInt(eventId)),
    enabled: !!eventId,
  });

  const myAttendeeRecord = attendees?.find((a) => a.email === user?.email && a.event_id === parseInt(eventId));

  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbackSummary", eventId] });
      setOverall(0);
      setVenue(0);
      setOrganization(0);
      setSpeaker(0);
      setCatering(0);
      setComments("");
      setErrorMsg("");
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.detail || "Something went wrong.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!myAttendeeRecord) {
      setErrorMsg("You must be registered for this event to leave feedback.");
      return;
    }
    mutation.mutate({
      event_id: parseInt(eventId),
      attendee_id: myAttendeeRecord.id,
      overall_rating: overall,
      venue_rating: venue || undefined,
      organization_rating: organization || undefined,
      speaker_rating: speaker || undefined,
      catering_rating: catering || undefined,
      comments: comments || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)]">Feedback & Evaluation</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Select an event to submit or view feedback.</p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="w-full max-w-sm bg-white/5 border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
        >
          <option value="">Select event</option>
          {events?.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {eventId && summary && summary.total_submissions > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-display text-base font-semibold text-[var(--text)] mb-4">
            Overall Rating: {summary.avg_overall} / 5 ⭐ ({summary.total_submissions} submissions)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><p className="text-[var(--text-muted)]">Venue</p><p className="font-semibold text-[var(--text)]">{summary.avg_venue}</p></div>
            <div><p className="text-[var(--text-muted)]">Organization</p><p className="font-semibold text-[var(--text)]">{summary.avg_organization}</p></div>
            <div><p className="text-[var(--text-muted)]">Speaker</p><p className="font-semibold text-[var(--text)]">{summary.avg_speaker}</p></div>
            <div><p className="text-[var(--text-muted)]">Catering</p><p className="font-semibold text-[var(--text)]">{summary.avg_catering}</p></div>
          </div>
        </div>
      )}

      {eventId && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 max-w-xl">
          <h3 className="font-display text-base font-semibold text-[var(--text)] mb-4">Submit Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <StarRating value={overall} onChange={setOverall} label="Overall Experience" />
            <StarRating value={venue} onChange={setVenue} label="Venue" />
            <StarRating value={organization} onChange={setOrganization} label="Organization" />
            <StarRating value={speaker} onChange={setSpeaker} label="Speaker/Sessions" />
            <StarRating value={catering} onChange={setCatering} label="Catering" />

            <textarea
              placeholder="Suggestions or comments (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            />

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3.5 py-2.5">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending || overall === 0}
              className="w-full bg-[var(--accent)] text-[#0a0f0e] font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
            >
              {mutation.isPending ? "Submitting…" : "Submit feedback"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Feedback;