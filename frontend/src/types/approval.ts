export interface ApprovalRequest {
  id: number;
  event_id: number;
  request_type: string;
  requested_by: string;
  description: string;
  amount?: number;
  status: string;
  reviewed_by?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface ApprovalCreate {
  event_id: number;
  request_type: string;
  requested_by: string;
  description: string;
  amount?: number;
}