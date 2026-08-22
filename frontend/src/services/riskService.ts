import api from "./api";
import type { RiskResponse } from "../types/risk";

export const getEventRisks = async (eventId: number): Promise<RiskResponse> => {
  const res = await api.get(`/risks/event/${eventId}`);
  return res.data;
};