import api from "./api";
import type { VendorAssignment, VendorAssignmentCreate } from "../types/vendorAssignment";

export const getVendorAssignments = async (): Promise<VendorAssignment[]> => {
  const res = await api.get("/vendor-assignments/");
  return res.data;
};

export const assignVendor = async (data: VendorAssignmentCreate): Promise<VendorAssignment> => {
  const res = await api.post("/vendor-assignments/", data);
  return res.data;
};

export const deleteVendorAssignment = async (id: number): Promise<void> => {
  await api.delete(`/vendor-assignments/${id}`);
};