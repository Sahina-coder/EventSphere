export interface Venue {
  id: number;
  name: string;
  location: string;
  capacity: number;
  is_available: string;
}

export interface VenueCreate {
  name: string;
  location: string;
  capacity: number;
  is_available?: string;
}