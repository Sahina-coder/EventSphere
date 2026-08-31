import api from "./api";
import type { ApprovalRequest, ApprovalCreate } from "../types/approval";

export const getApprovals = async (): Promise<ApprovalRequest[]> => {
  const res = await api.get("/approvals/");
  return res.data;
};

export const createApprovalRequest = async (data: ApprovalCreate): Promise<ApprovalRequest> => {
  const res = await api.post("/approvals/", data);
  return res.data;
};

export const decideApproval = async (id: number, decision: string, reviewedBy: string): Promise<ApprovalRequest> => {
  const res = await api.put(`/approvals/${id}/decision?decision=${decision}&reviewed_by=${encodeURIComponent(reviewedBy)}`);
  return res.data;
};