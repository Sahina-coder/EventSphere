export interface Event {
  id: number;
  name: string;
  event_type: string;
  date: string;
  budget?: number;
  status: string;
}

export interface EventCreate {
  name: string;
  event_type: string;
  date: string;
  budget?: number;
  status?: string;
}