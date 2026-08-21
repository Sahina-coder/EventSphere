export interface Expense {
  id: number;
  event_id: number;
  category: string;
  description?: string;
  amount: number;
  created_at: string;
}

export interface ExpenseCreate {
  event_id: number;
  category: string;
  description?: string;
  amount: number;
}

export interface BudgetSummary {
  event_id: number;
  total_budget: number;
  total_expenses: number;
  remaining_budget: number;
  utilization_percent: number;
  warning?: string;
  expenses_by_category: Record<string, number>;
  expenses: Expense[];
}