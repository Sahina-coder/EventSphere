import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Search } from "lucide-react";
import { getAttendees } from "../../services/attendeeService";
import { getEvents } from "../../services/eventService";
import { generateCertificate, getCertificates, verifyCertificate } from "../../services/certificateService";
import type { CertificateVerifyResponse } from "../../types/certificate";

const Certificates = () => {
  const queryClient = useQueryClient();
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyResult, setVerifyResult] = useState<CertificateVerifyResponse | null>(null);

  const { data: attendees } = useQuery({ queryKey: ["attendees"], queryFn: getAttendees });
  const { data: events } = useQuery({ queryKey: ["events"], queryFn: getEvents });
  const { data: certificates } = useQuery({ queryKey: ["certificates"], queryFn: getCertificates });

  const genMutation = useMutation({
    mutationFn: generateCertificate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["certificates"] }),
  });

  const getEventName = (id: number) => events?.find((e) => e.id === id)?.name ?? `Event #${id}`;
  const getCertForAttendee = (attendeeId: number) => certificates?.find((c) => c.attendee_id === attendeeId);

  const checkedInAttendees = attendees?.filter((a) => a.attendance_status === "Checked In") ?? [];

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await verifyCertificate(verifyCode.trim());
    setVerifyResult(result);
  };

  return (
    <div className="col-span-1 md:col-span-2 space-y-6">
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-1">Certificates</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Checked-in attendees are eligible for a certificate.
        </p>

        {checkedInAttendees.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No checked-in attendees yet.</p>
        ) : (
          <div className="space-y-3">
            {checkedInAttendees.map((attendee) => {
              const cert = getCertForAttendee(attendee.id);
              return (
                <div
                  key={attendee.id}
                  className="border border-slate-100 rounded-lg px-4 py-3.5 flex items-center justify-between gap-4"
                  style={{ borderLeft: "3px solid #4F46E5" }}
                >
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{attendee.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{getEventName(attendee.event_id)}</p>
                  </div>
                  {cert ? (
                    <span className="text-xs font-medium text-[var(--accent)] flex items-center gap-1">
                      <Award size={14} /> {cert.certificate_code}
                    </span>
                  ) : (
                    <button
                      onClick={() => genMutation.mutate(attendee.id)}
                      disabled={genMutation.isPending}
                      className="text-xs font-medium text-white bg-[var(--accent)] px-3 py-1.5 rounded-lg hover:brightness-110 transition disabled:opacity-50"
                    >
                      Generate certificate
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 max-w-xl">
        <h3 className="font-display text-base font-semibold mb-4">Verify a Certificate</h3>
        <form onSubmit={handleVerify} className="flex gap-2">
          <input
            type="text"
            placeholder="CERT-2026-00001"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            required
          />
          <button
            type="submit"
            className="bg-[var(--accent)] text-white font-medium text-sm rounded-lg px-4 py-2.5 hover:brightness-110 transition flex items-center gap-1.5"
          >
            <Search size={14} /> Verify
          </button>
        </form>

        {verifyResult && (
          <div className="mt-4">
            {verifyResult.valid ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm">
                <p className="font-medium text-emerald-700 mb-2">✅ Valid Certificate</p>
                <p><span className="text-[var(--text-muted)]">Participant:</span> {verifyResult.participant_name}</p>
                <p><span className="text-[var(--text-muted)]">Event:</span> {verifyResult.event_name}</p>
                <p><span className="text-[var(--text-muted)]">Event Date:</span> {verifyResult.event_date && new Date(verifyResult.event_date).toLocaleDateString()}</p>
                <p><span className="text-[var(--text-muted)]">Issued:</span> {verifyResult.issue_date && new Date(verifyResult.issue_date).toLocaleDateString()}</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
                ❌ {verifyResult.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;