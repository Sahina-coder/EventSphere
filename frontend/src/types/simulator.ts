export interface ParticipantSimResult {
  current_participants: number;
  simulated_participants: number;
  current_venue_capacity?: number;
  capacity_sufficient?: boolean;
  additional_chairs_needed: number;
  estimated_additional_cost: number;
  recommendation: string;
}

export interface BudgetSimResult {
  current_budget: number;
  simulated_budget: number;
  current_expenses: number;
  fits_new_budget: boolean;
  deficit: number;
  top_expense_categories: { category: string; amount: number }[];
  recommendation: string;
}