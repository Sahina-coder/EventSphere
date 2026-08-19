export interface Booking {
  id: number;
  event_id: number;
  venue_id: number;
  start_time: string;
  end_time: string;
}

export interface BookingCreate {
  event_id: number;
  venue_id: number;
  start_time: string;
  end_time: string;
}