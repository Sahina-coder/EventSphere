import api from "./api";
import type { Venue, VenueCreate } from "../types/venue";

export const getVenues = async (): Promise<Venue[]> => {
  const res = await api.get("/venues/");
  return res.data;
};

export const createVenue = async (data: VenueCreate): Promise<Venue> => {
  const res = await api.post("/venues/", data);
  return res.data;
};

export const deleteVenue = async (id: number): Promise<void> => {
  await api.delete(`/venues/${id}`);
};