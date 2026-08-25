import api from "./api";
import type { ParticipantSimResult, BudgetSimResult } from "../types/simulator";

export const simulateParticipants = async (eventId: number, simulatedParticipants: number): Promise<ParticipantSimResult> => {
  const res = await api.get(`/simulate/event/${eventId}/participants?simulated_participants=${simulatedParticipants}`);
  return res.data;
};

export const simulateBudget = async (eventId: number, budgetChange: number): Promise<BudgetSimResult> => {
  const res = await api.get(`/simulate/event/${eventId}/budget?budget_change=${budgetChange}`);
  return res.data;
};