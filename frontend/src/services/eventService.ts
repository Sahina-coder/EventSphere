import api from "./api";
import type { Event, EventCreate } from "../types/event";

export const getEvents = async (): Promise<Event[]> => {
  const res = await api.get("/events/");
  return res.data;
};

export const getEvent = async (id: number): Promise<Event> => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const createEvent = async (data: EventCreate): Promise<Event> => {
  const res = await api.post("/events/", data);
  return res.data;
};

export const updateEvent = async (id: number, data: EventCreate): Promise<Event> => {
  const res = await api.put(`/events/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`);
};