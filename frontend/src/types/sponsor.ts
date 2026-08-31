export interface Sponsor {
  id: number;
  event_id: number;
  name: string;
  contact_email?: string;
  amount: number;
  sponsorship_type?: string;
  received_at: string;
}

export interface SponsorCreate {
  event_id: number;
  name: string;
  contact_email?: string;
  amount: number;
  sponsorship_type?: string;
}

export interface FinancialSummary {
  event_id: number;
  total_budget: number;
  total_sponsorship: number;
  total_expenses: number;
  net_balance: number;
  sponsors: Sponsor[];
}