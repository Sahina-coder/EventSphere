export interface Certificate {
  id: number;
  certificate_code: string;
  attendee_id: number;
  event_id: number;
  issue_date: string;
}

export interface CertificateVerifyResponse {
  valid: boolean;
  certificate_code?: string;
  participant_name?: string;
  event_name?: string;
  event_date?: string;
  issue_date?: string;
  message?: string;
}