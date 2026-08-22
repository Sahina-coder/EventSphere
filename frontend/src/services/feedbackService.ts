import api from "./api";
import type { FeedbackCreate, FeedbackSummary } from "../types/feedback";

export const submitFeedback = async (data: FeedbackCreate) => {
  const res = await api.post("/feedback/", data);
  return res.data;
};

export const getFeedbackSummary = async (eventId: number): Promise<FeedbackSummary> => {
  const res = await api.get(`/feedback/event/${eventId}/summary`);
  return res.data;
};