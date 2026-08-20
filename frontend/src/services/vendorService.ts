import api from "./api";
import type { Vendor, VendorCreate } from "../types/vendor";

export const getVendors = async (): Promise<Vendor[]> => {
  const res = await api.get("/vendors/");
  return res.data;
};

export const createVendor = async (data: VendorCreate): Promise<Vendor> => {
  const res = await api.post("/vendors/", data);
  return res.data;
};

export const deleteVendor = async (id: number): Promise<void> => {
  await api.delete(`/vendors/${id}`);
};