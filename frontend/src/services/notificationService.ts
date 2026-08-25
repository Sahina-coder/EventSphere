import api from "./api";
import type { Notification, NotificationCreate } from "../types/notification";

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get("/notifications/");
  return res.data;
};

export const sendNotification = async (data: NotificationCreate): Promise<Notification> => {
  const res = await api.post("/notifications/", data);
  return res.data;
};

export const markNotificationRead = async (id: number): Promise<Notification> => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
};

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};