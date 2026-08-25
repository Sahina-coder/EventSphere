import api from "./api";
import type { LostFoundItem, LostFoundCreate } from "../types/lostFound";

export const getLostFoundItems = async (): Promise<LostFoundItem[]> => {
  const res = await api.get("/lost-found/");
  return res.data;
};

export const reportItem = async (data: LostFoundCreate): Promise<LostFoundItem> => {
  const res = await api.post("/lost-found/", data);
  return res.data;
};

export const updateItemStatus = async (id: number, status: string): Promise<LostFoundItem> => {
  const res = await api.put(`/lost-found/${id}/status?status=${encodeURIComponent(status)}`);
  return res.data;
};

export const deleteItem = async (id: number): Promise<void> => {
  await api.delete(`/lost-found/${id}`);
};