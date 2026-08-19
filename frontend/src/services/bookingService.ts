import api from "./api";
import type { Booking, BookingCreate } from "../types/booking";

export const getBookings = async (): Promise<Booking[]> => {
  const res = await api.get("/bookings/");
  return res.data;
};

export const createBooking = async (data: BookingCreate): Promise<Booking> => {
  const res = await api.post("/bookings/", data);
  return res.data;
};

export const deleteBooking = async (id: number): Promise<void> => {
  await api.delete(`/bookings/${id}`);
};