import api from "./api";
import type { Attendee, AttendeeCreate } from "../types/attendee";

export const getAttendees = async (): Promise<Attendee[]> => {
  const res = await api.get("/attendees/");
  return res.data;
};

export const registerAttendee = async (data: AttendeeCreate): Promise<Attendee> => {
  const res = await api.post("/attendees/", data);
  return res.data;
};

export const updateAttendanceStatus = async (id: number, status: string): Promise<Attendee> => {
  const res = await api.put(`/attendees/${id}/status?status=${encodeURIComponent(status)}`);
  return res.data;
};

export const deleteAttendee = async (id: number): Promise<void> => {
  await api.delete(`/attendees/${id}`);
};