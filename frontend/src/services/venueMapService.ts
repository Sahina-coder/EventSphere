import api from "./api";
import type { VenueMapPoint, VenueMapPointCreate } from "../types/venueMap";

export const getVenueMap = async (venueId: number): Promise<VenueMapPoint[]> => {
  const res = await api.get(`/venue-map/venue/${venueId}`);
  return res.data;
};

export const addMapPoint = async (data: VenueMapPointCreate): Promise<VenueMapPoint> => {
  const res = await api.post("/venue-map/", data);
  return res.data;
};

export const deleteMapPoint = async (id: number): Promise<void> => {
  await api.delete(`/venue-map/${id}`);
};