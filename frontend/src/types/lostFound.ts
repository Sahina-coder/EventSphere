export interface LostFoundItem {
  id: number;
  event_id?: number;
  report_type: string;
  item_name: string;
  description?: string;
  location?: string;
  contact_info?: string;
  status: string;
  reported_at: string;
}

export interface LostFoundCreate {
  event_id?: number;
  report_type: string;
  item_name: string;
  description?: string;
  location?: string;
  contact_info?: string;
}