import api from "./api";
import type { Sponsor, SponsorCreate, FinancialSummary } from "../types/sponsor";

export const getSponsors = async (): Promise<Sponsor[]> => {
  const res = await api.get("/sponsors/");
  return res.data;
};

export const addSponsor = async (data: SponsorCreate): Promise<Sponsor> => {
  const res = await api.post("/sponsors/", data);
  return res.data;
};

export const deleteSponsor = async (id: number): Promise<void> => {
  await api.delete(`/sponsors/${id}`);
};

export const getFinancialSummary = async (eventId: number): Promise<FinancialSummary> => {
  const res = await api.get(`/sponsors/event/${eventId}/financial-summary`);
  return res.data;
};