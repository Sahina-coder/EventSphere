export interface Notification {
  id: number;
  event_id?: number;
  recipient_type: string;
  recipient_id?: number;
  notification_type: string;
  message: string;
  sender: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationCreate {
  event_id?: number;
  recipient_type: string;
  recipient_id?: number;
  notification_type: string;
  message: string;
  sender: string;
}