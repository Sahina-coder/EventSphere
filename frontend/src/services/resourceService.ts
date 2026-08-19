import api from "./api";
import type { Resource, ResourceCreate } from "../types/resource";

export const getResources = async (): Promise<Resource[]> => {
  const res = await api.get("/resources/");
  return res.data;
};

export const createResource = async (data: ResourceCreate): Promise<Resource> => {
  const res = await api.post("/resources/", data);
  return res.data;
};

export const deleteResource = async (id: number): Promise<void> => {
  await api.delete(`/resources/${id}`);
};