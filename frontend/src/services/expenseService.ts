import api from "./api";
import type { Expense, ExpenseCreate, BudgetSummary } from "../types/expense";

export const getExpenses = async (): Promise<Expense[]> => {
  const res = await api.get("/expenses/");
  return res.data;
};

export const createExpense = async (data: ExpenseCreate): Promise<Expense> => {
  const res = await api.post("/expenses/", data);
  return res.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};

export const getBudgetSummary = async (eventId: number): Promise<BudgetSummary> => {
  const res = await api.get(`/expenses/event/${eventId}/summary`);
  return res.data;
};