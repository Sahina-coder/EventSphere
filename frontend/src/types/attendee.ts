export interface Attendee {
  id: number;
  event_id: number;
  name: string;
  email: string;
  phone: string;
  college?: string;
  department?: string;
  attendance_status: string;
  registered_at: string;
}

export interface AttendeeCreate {
  event_id: number;
  name: string;
  email: string;
  phone: string;
  college?: string;
  department?: string;
}