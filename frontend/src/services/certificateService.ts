import api from "./api";
import type { Certificate, CertificateVerifyResponse } from "../types/certificate";

export const getCertificates = async (): Promise<Certificate[]> => {
  const res = await api.get("/certificates/");
  return res.data;
};

export const generateCertificate = async (attendeeId: number): Promise<Certificate> => {
  const res = await api.post(`/certificates/generate/${attendeeId}`);
  return res.data;
};

export const verifyCertificate = async (code: string): Promise<CertificateVerifyResponse> => {
  const res = await api.get(`/certificates/verify/${code}`);
  return res.data;
};