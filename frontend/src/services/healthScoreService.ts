import api from "./api";
import type { HealthScore } from "../types/healthScore";

export const getHealthScore = async (eventId: number): Promise<HealthScore> => {
  const res = await api.get(`/health-score/event/${eventId}`);
  return res.data;
};