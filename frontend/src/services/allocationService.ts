import api from "./api";
import type { Allocation, AllocationCreate } from "../types/allocation";

export const getAllocations = async (): Promise<Allocation[]> => {
  const res = await api.get("/allocations/");
  return res.data;
};

export const createAllocation = async (data: AllocationCreate): Promise<Allocation> => {
  const res = await api.post("/allocations/", data);
  return res.data;
};

export const deleteAllocation = async (id: number): Promise<void> => {
  await api.delete(`/allocations/${id}`);
};