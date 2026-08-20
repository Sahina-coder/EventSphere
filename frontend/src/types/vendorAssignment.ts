export interface VendorAssignment {
  id: number;
  event_id: number;
  vendor_id: number;
  service: string;
  status: string;
}

export interface VendorAssignmentCreate {
  event_id: number;
  vendor_id: number;
  service: string;
  status?: string;
}