export interface FeedbackCreate {
  event_id: number;
  attendee_id: number;
  overall_rating: number;
  venue_rating?: number;
  organization_rating?: number;
  speaker_rating?: number;
  catering_rating?: number;
  comments?: string;
}

export interface FeedbackSummary {
  event_id: number;
  total_submissions: number;
  avg_overall: number;
  avg_venue: number;
  avg_organization: number;
  avg_speaker: number;
  avg_catering: number;
}