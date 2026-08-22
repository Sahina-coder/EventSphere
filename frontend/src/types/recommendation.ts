export interface VenueRecommendation {
  venue_id: number;
  name: string;
  location: string;
  capacity: number;
  is_available: string;
  score: number;
  reasons: string[];
}