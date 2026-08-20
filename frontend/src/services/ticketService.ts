import api from "./api";
import type { Ticket } from "../types/ticket";

export const getTickets = async (): Promise<Ticket[]> => {
  const res = await api.get("/tickets/");
  return res.data;
};

export const generateTicket = async (attendeeId: number): Promise<Ticket> => {
  const res = await api.post(`/tickets/generate/${attendeeId}`);
  return res.data;
};

export const getTicketQrUrl = (ticketId: number): string => {
  return `http://127.0.0.1:8000/tickets/${ticketId}/qrcode`;
};