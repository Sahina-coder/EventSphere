import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvents } from "../../services/eventService";
import { getAttendees } from "../../services/attendeeService";
import { submitFeedback, getFeedbackSummary } from "../../services/feedbackService";

const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
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
  const [eventId, setEventId] = useState("");
  const [attendeeId, setAttendeeId] = useState("");
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

  const eventAttendees = attendees?.filter((a) => a.event_id === parseInt(eventId)) ?? [];

  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbackSummary", eventId] });
      setAttendeeId("");
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
    mutation.mutate({
      event_id: parseInt(eventId),
      attendee_id: parseInt(attendeeId),
      overall_rating: overall,
      venue_rating: venue || undefined,
      organization_rating: organization || undefined,
      speaker_rating: speaker || undefined,
      catering_rating: catering || undefined,
      comments: comments || undefined,
    });
  };

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-1">Feedback & Evaluation</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">Select an event to submit or view feedback.</p>
        <select
          value={eventId}
          onChange={(e) => { setEventId(e.target.value); setAttendeeId(""); }}
          className="w-full max-w-sm bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
        >
          <option value="">Select event</option>
          {events?.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {eventId && summary && summary.total_submissions > 0 && (
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
          <h3 className="font-display text-base font-semibold mb-4">
            Overall Rating: {summary.avg_overall} / 5 ⭐ ({summary.total_submissions} submissions)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><p className="text-[var(--text-muted)]">Venue</p><p className="font-semibold text-slate-800">{summary.avg_venue}</p></div>
            <div><p className="text-[var(--text-muted)]">Organization</p><p className="font-semibold text-slate-800">{summary.avg_organization}</p></div>
            <div><p className="text-[var(--text-muted)]">Speaker</p><p className="font-semibold text-slate-800">{summary.avg_speaker}</p></div>
            <div><p className="text-[var(--text-muted)]">Catering</p><p className="font-semibold text-slate-800">{summary.avg_catering}</p></div>
          </div>
        </div>
      )}

      {eventId && (
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 max-w-xl">
          <h3 className="font-display text-base font-semibold mb-4">Submit Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={attendeeId}
              onChange={(e) => setAttendeeId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
              required
            >
              <option value="">Select your name</option>
              {eventAttendees.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

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
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            />

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3.5 py-2.5">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending || overall === 0}
              className="w-full bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
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