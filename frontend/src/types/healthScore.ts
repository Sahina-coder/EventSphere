export interface HealthScore {
  event_id: number;
  score: number;
  status: string;
  breakdown: Record<string, number>;
  issues: string[];
}