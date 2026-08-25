import api from "./api";
import type { Incident, IncidentCreate } from "../types/incident";

export const getIncidents = async (): Promise<Incident[]> => {
  const res = await api.get("/incidents/");
  return res.data;
};

export const reportIncident = async (data: IncidentCreate): Promise<Incident> => {
  const res = await api.post("/incidents/", data);
  return res.data;
};

export const updateIncidentStatus = async (id: number, status: string): Promise<Incident> => {
  const res = await api.put(`/incidents/${id}/status?status=${encodeURIComponent(status)}`);
  return res.data;
};

export const assignStaff = async (id: number, staffName: string): Promise<Incident> => {
  const res = await api.put(`/incidents/${id}/assign?staff_name=${encodeURIComponent(staffName)}`);
  return res.data;
};