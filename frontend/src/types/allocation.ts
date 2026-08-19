export interface Allocation {
  id: number;
  event_id: number;
  resource_id: number;
  quantity: number;
}

export interface AllocationCreate {
  event_id: number;
  resource_id: number;
  quantity: number;
}