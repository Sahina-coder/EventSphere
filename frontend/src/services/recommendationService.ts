import api from "./api";
import type { VenueRecommendation } from "../types/recommendation";

export const getVenueRecommendations = async (expectedParticipants: number): Promise<VenueRecommendation[]> => {
  const res = await api.get(`/recommendations/venues?expected_participants=${expectedParticipants}`);
  return res.data;
};