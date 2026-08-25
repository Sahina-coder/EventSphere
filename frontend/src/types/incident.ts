export interface Incident {
  id: number;
  event_id: number;
  incident_type: string;
  description: string;
  location?: string;
  reported_by: string;
  priority: string;
  assigned_staff?: string;
  status: string;
  reported_at: string;
}

export interface IncidentCreate {
  event_id: number;
  incident_type: string;
  description: string;
  location?: string;
  reported_by: string;
  priority: string;
  assigned_staff?: string;
}