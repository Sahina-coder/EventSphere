export interface VenueMapPoint {
  id: number;
  venue_id: number;
  label: string;
  point_type: string;
  x: number;
  y: number;
}

export interface VenueMapPointCreate {
  venue_id: number;
  label: string;
  point_type: string;
  x: number;
  y: number;
}