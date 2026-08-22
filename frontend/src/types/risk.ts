export interface Risk {
  risk_type: string;
  description: string;
  severity: string;
  suggested_action?: string;
}

export interface RiskResponse {
  event_id: number;
  risks: Risk[];
}